mod utils;
mod dijkstra;
mod maze;
mod a_star;
mod greedy_bfs;
mod bfs;
mod dfs;
mod bellman_ford;
mod bi_swarm_algorithm;

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
pub fn get_buffer_ref() -> js_sys::Uint8Array {
    SHARED_BUFFER.with(|cell| {
        if let Some(buffer) = &*cell.borrow() {
            unsafe {
                js_sys::Uint8Array::view(buffer.as_slice())
            }
        } else {
            console::log_1(&"No buffer".into());
            js_sys::Uint8Array::new(&JsValue::from(0))
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
fn clear_buffer(length:usize) {
    for i in 0..length {
        modify_from_rust(i,0);
    }
}
#[wasm_bindgen]
pub fn reset_non_wall_nodes() {
    let v = match get_buffer_as_vec() {
        Some(vec) => vec,
        _none => {
            console::log_1(&"Buffer not found".into());
            return;
        }
    };

    for (idx , val) in v.iter().enumerate() {
        if *val != 1 {
            modify_from_rust(idx,0);
        }
    }
}



fn update_shared_buffer(data: Vec<u8>) {
    for (idx , val) in data.iter().enumerate() {
        modify_from_rust(idx,*val);
    }
}

#[wasm_bindgen]
pub fn clear_shared_buffer() -> bool {
    let buffer = get_buffer_as_vec();
    match buffer {
        Some(v) => {
            clear_buffer(v.len());
            true
        },
        None => {
            console::log_1(&"No buffer found".into());
            false
        }
    }
}




#[wasm_bindgen]
pub fn gen_maze(start: usize , end : usize, cols: usize) {
    let mut grid;
    match get_buffer_as_vec() {
        Some(v) => {
            grid = v;
            maze::mazify(&mut grid, cols);
            for (idx , val) in grid.iter().enumerate() {
                if idx == start || idx == end {
                    modify_from_rust(idx,0);
                    continue;
                }
                modify_from_rust(idx,*val);
            }
        },
        None => console::log_1(&"No Buffer found".into())
    }
}

fn process_pathfinding<F>(
    start: usize,
    end: usize,
    rows: usize,
    cols: usize,
    algorithm: F,
) -> Vec<usize>
where
    F: FnOnce(Vec<i32>, usize, usize, usize, usize, usize, usize) -> (Vec<i32>, Vec<usize>, Vec<usize>),
{
    let buffer = match get_buffer_as_vec() {
        Some(data) => data,
        None => {
            console::error_1(&"No buffer data available".into());
            return Vec::new();
        }
    };

    // Convert buffer (u8) to grid (i32)
    let grid: Vec<i32> = buffer.iter().map(|&x| x as i32).collect();

    // Calculate row and col from linear index
    let start_row = start / cols;
    let start_col = start % cols;
    let end_row = end / cols;
    let end_col = end % cols;

    let (result_grid, visited_order, path_indexes) = algorithm(
        grid, start_row, start_col, end_row, end_col, rows, cols
    );

    let result_buffer: Vec<u8> = result_grid.iter().map(|&x| x as u8).collect();
    update_shared_buffer(result_buffer);

    // Return both visited order and path indexes as a combined array for JS
    let mut combined = Vec::new();
    combined.push(visited_order.len());
    combined.extend(visited_order);
    combined.push(path_indexes.len());
    combined.extend(path_indexes);

    combined
}

#[wasm_bindgen]
pub fn handle_dijkstra(start: usize, end: usize, rows: usize, cols: usize) -> Vec<usize> {
    process_pathfinding(start, end, rows, cols, dijkstra::find_shortest_path)
}

#[wasm_bindgen]
pub fn handle_a_star(start: usize, end: usize, rows: usize, cols: usize) -> Vec<usize> {
    let ret = process_pathfinding(start, end, rows, cols, a_star::find_shortest_path);
    reset_non_wall_nodes();
    let no_of_visited = ret[0];
    for i in 1..=no_of_visited {
        modify_from_rust(ret[i], 2);
    }
    let no_of_path_nodes = ret[no_of_visited+1];
    let path_start_idx = no_of_visited+2;
    for i in 0..no_of_path_nodes {
        modify_from_rust(ret[path_start_idx + i], 3);
    }
    ret
}

#[wasm_bindgen]
pub fn handle_greedy_bfs(start: usize, end: usize, rows: usize, cols: usize) -> Vec<usize> {
    process_pathfinding(start, end, rows, cols, greedy_bfs::find_shortest_path)
}

#[wasm_bindgen]
pub fn handle_bfs(start: usize, end: usize, rows: usize, cols: usize) -> Vec<usize> {
    process_pathfinding(start, end, rows, cols, bfs::find_shortest_path)
}

#[wasm_bindgen]
pub fn handle_dfs(start: usize, end: usize, rows: usize, cols: usize) -> Vec<usize> {
    process_pathfinding(start, end, rows, cols, dfs::find_shortest_path)
}

#[wasm_bindgen]
pub fn handle_bellman_ford(start: usize, end: usize, rows: usize, cols: usize) -> Vec<usize> {
    process_pathfinding(start, end, rows, cols, bellman_ford::find_shortest_path)
}

#[wasm_bindgen]
pub fn handle_bi_swarn(start: usize, end: usize, rows: usize, cols: usize) -> Vec<usize> {
    process_pathfinding(start, end, rows, cols, bi_swarm_algorithm::find_shortest_path)
}

#[inline(always)]
pub fn benchmark_one<F>(
    start: usize,
    end: usize,
    rows: usize,
    cols: usize,
    algorithm: F,
) -> usize
where
    F: FnOnce(Vec<i32>, usize, usize, usize, usize, usize, usize) -> (Vec<i32>, Vec<usize>, Vec<usize>) {
    let buffer = match get_buffer_as_vec() {
        Some(data) => data,
        None => {
            console::error_1(&"No buffer data available".into());
            return 0usize;
        }
    };

    // Convert buffer (u8) to grid (i32)
    let grid: Vec<i32> = buffer.iter().map(|&x| x as i32).collect();

    // Calculate row and col from linear index
    let start_row = start / cols;
    let start_col = start % cols;
    let end_row = end / cols;
    let end_col = end % cols;

    let (_result_grid, visited_order, _path_indexes) = algorithm(
        grid, start_row, start_col, end_row, end_col, rows, cols
    );

    visited_order.len()
}

#[wasm_bindgen]
pub fn benchmark_dijkstra(start: usize, end: usize, rows: usize, cols: usize) -> usize {
    benchmark_one(start,end,rows,cols,dijkstra::find_shortest_path)
}
#[wasm_bindgen]
pub fn benchmark_a_star(start: usize, end: usize, rows: usize, cols: usize) -> usize {
    benchmark_one(start,end,rows,cols,a_star::find_shortest_path)
}
pub fn benchmark_greedy_bfs(start: usize, end: usize, rows: usize, cols: usize) -> usize {
    benchmark_one(start,end,rows,cols,greedy_bfs::find_shortest_path)
}

#[wasm_bindgen]
pub fn bfs(start: usize, end: usize, rows: usize, cols: usize) -> usize {
    benchmark_one(start,end,rows,cols,bfs::find_shortest_path)
}
#[wasm_bindgen]
pub fn dfs(start: usize, end: usize, rows: usize, cols: usize) -> usize {
    benchmark_one(start,end,rows,cols,dfs::find_shortest_path)
}
#[wasm_bindgen]
pub fn bellman_ford(start: usize, end: usize, rows: usize, cols: usize) -> usize {
    benchmark_one(start,end,rows,cols,bellman_ford::find_shortest_path)
}
#[wasm_bindgen]
pub fn bi_swarn(start: usize, end: usize, rows: usize, cols: usize) -> usize {
    benchmark_one(start,end,rows,cols,bi_swarm_algorithm::find_shortest_path)
}

#[wasm_bindgen]
pub fn update_grid_for_algo(start: usize, end: usize, rows: usize, cols: usize, algo: usize) {
    reset_non_wall_nodes();
    match algo {
        0 => _= handle_dijkstra(start,end,rows,cols),
        1 => _= handle_a_star(start,end,rows,cols),
        2 => _= handle_dfs(start,end,rows,cols),
        3 => _= handle_bfs(start,end,rows,cols),
        4 => _= handle_greedy_bfs(start,end,rows,cols),
        5 => _= handle_bellman_ford(start,end,rows,cols),
        6 => _= handle_bi_swarn(start,end,rows,cols),
        _ => console::error_1(&"Unknown algorithm specified".into())
    }
}



/// * `algo_index` - Integer (0-6) representing the algorithm:
///   * 0: Dijkstra
///   * 1: A Star
///   * 2: DFS
///   * 3: BFS
///   * 4: Greedy BFS
///   * 5: Bellman Ford
///   * 6: Bi Swarm
/// * `execution_time_ms` - Execution time in milliseconds
#[wasm_bindgen]
pub fn calculate_maze_algorithm_cost(algo_index: usize, execution_time_ms: f64,
                                     visited_nodes: usize, total_nodes: usize) -> f64 {
    let cost_per_node = execution_time_ms / visited_nodes as f64;
    let scaling_factor = match algo_index {
        0 => { // Dijkstra: O((V+E) log V)
            let v = total_nodes as f64;
            let e = 4.0 * v;
            (v + e) * v.log2()
        },
        1 => { // A Star: O((V+E) log V) but usually more efficient than Dijkstra
            let v = total_nodes as f64;
            let e = 4.0 * v;
            (v + e) * v.log2() * 0.8
        },
        2 => { // DFS: O(V+E)
            let v = total_nodes as f64;
            let e = 4.0 * v;
            v + e
        },
        3 => { // BFS: O(V+E)
            let v = total_nodes as f64;
            let e = 4.0 * v;
            v + e
        },
        4 => {
            let v = total_nodes as f64;
            let e = 4.0 * v;
            (v + e) * v.log2() * 0.7
        },
        5 => { // Bellman Ford: O(V*E)
            let v = total_nodes as f64;
            let e = 4.0 * v;
            v * e
        },
        6 => { // Bi Swarm: Bidirectional BFS with O(b^(d/2)) where b is branching factor and d is path length
            let v = total_nodes as f64;
            let e = 4.0 * v;
            (v + e).sqrt() * 2.0
        },
        _ => {
            let v = total_nodes as f64;
            let e = 4.0 * v;
            v + e
        }
    };

    let efficiency_ratio = visited_nodes as f64 / total_nodes as f64;
    let total_cost = cost_per_node * efficiency_ratio * scaling_factor;
    total_cost
}