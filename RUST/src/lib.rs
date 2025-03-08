mod utils;

use wasm_bindgen::prelude::*;
use web_sys::console;
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
pub fn create_cell_state_buffer(n : usize) -> *mut u8 {
    let mut buffer = vec![0u8;n];
    let ptr = buffer.as_mut_ptr();
    std::mem::forget(buffer); // Prevent Rust from freeing the memory
    ptr
}

#[wasm_bindgen]
pub fn temp()  {
    console::log_1(&"Trying to log".into());
}