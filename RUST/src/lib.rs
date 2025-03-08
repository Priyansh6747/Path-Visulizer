mod utils;

use wasm_bindgen::prelude::*;
use web_sys::console;
use js_sys;
use std::cell::RefCell;
use std::rc::Rc;


#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, RUST!");
}



#[wasm_bindgen]
pub fn create_cell_state_buffer(n : usize) -> js_sys::Uint8Array {
    create_shared_buffer(n)
}

#[wasm_bindgen]
pub fn temp()  {
    console::log_1(&"Trying to log".into());
}

// Store our buffer in a static location that Rust code can access
thread_local! {
    static SHARED_BUFFER: RefCell<Option<Vec<u8>>> = RefCell::new(None);
}
#[wasm_bindgen]
pub fn create_shared_buffer(n: usize) -> js_sys::Uint8Array {
    let buffer = vec![0u8; n];

    // Create a view into this buffer for JavaScript
    let js_array = unsafe {
        js_sys::Uint8Array::view(&buffer)
    };

    // Store the buffer so Rust can access it later
    SHARED_BUFFER.with(|cell| {
        *cell.borrow_mut() = Some(buffer);
    });

    js_array
}

#[wasm_bindgen]
pub fn modify_from_rust(index: usize, value: u8) -> bool {
    SHARED_BUFFER.with(|cell| {
        if let Some(buffer) = &mut *cell.borrow_mut() {
            if index < buffer.len() {
                buffer[index] = value;
                return true;
            }
        }
        false
    })
}

// Returns a copy of the shared buffer as a Vec<u8>
pub fn get_buffer_as_vec() -> Option<Vec<u8>> {
    SHARED_BUFFER.with(|cell| {
        if let Some(buffer) = &*cell.borrow() {
            Some(buffer.clone())
        } else {
            None
        }
    })
}

// Returns a slice of the shared buffer as a new Vec<u8>
pub fn get_buffer_slice_as_vec(start: usize, end: Option<usize>) -> Option<Vec<u8>> {
    SHARED_BUFFER.with(|cell| {
        if let Some(buffer) = &*cell.borrow() {
            let end_idx = end.unwrap_or(buffer.len()).min(buffer.len());
            if start < end_idx {
                // Create a new Vec containing the slice
                Some(buffer[start..end_idx].to_vec())
            } else {
                Some(Vec::new())
            }
        } else {
            None
        }
    })
}

#[wasm_bindgen]
pub fn get_buffer_copy() -> js_sys::Uint8Array {
    SHARED_BUFFER.with(|cell| {
        if let Some(buffer) = &*cell.borrow() {
            js_sys::Uint8Array::from(buffer.as_slice())
        } else {
            js_sys::Uint8Array::new(&JsValue::from(0))
        }
    })
}

#[wasm_bindgen]
pub fn show_buffer(){
    let v = match get_buffer_as_vec() {
        Some(vec) => vec,
        _none => {
            console::log_1(&"Buffer not found".into());
            return;
        }
    };
    let s:String = v.iter().map(|i| i.to_string()).collect();
    console::log_1(&s.into());
}