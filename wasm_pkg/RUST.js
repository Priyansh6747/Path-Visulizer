let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

export function greet() {
    wasm.greet();
}

/**
 * @param {number} n
 * @returns {Uint8Array}
 */
export function create_cell_state_buffer(n) {
    const ret = wasm.create_cell_state_buffer(n);
    return ret;
}

export function temp() {
    wasm.temp();
}

/**
 * @param {number} n
 * @returns {Uint8Array}
 */
export function create_shared_buffer(n) {
    const ret = wasm.create_shared_buffer(n);
    return ret;
}

/**
 * @param {number} index
 * @param {number} value
 * @returns {boolean}
 */
export function modify_from_rust(index, value) {
    const ret = wasm.modify_from_rust(index, value);
    return ret !== 0;
}

/**
 * @returns {Uint8Array}
 */
export function get_buffer_ref() {
    const ret = wasm.get_buffer_ref();
    return ret;
}

/**
 * @returns {Uint8Array}
 */
export function get_buffer_copy() {
    const ret = wasm.get_buffer_copy();
    return ret;
}

export function show_buffer() {
    wasm.show_buffer();
}

export function reset_non_wall_nodes() {
    wasm.reset_non_wall_nodes();
}

/**
 * @returns {boolean}
 */
export function clear_shared_buffer() {
    const ret = wasm.clear_shared_buffer();
    return ret !== 0;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} cols
 * @returns {Uint8Array}
 */
export function gen_maze(start, end, cols) {
    const ret = wasm.gen_maze(start, end, cols);
    return ret;
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {Uint32Array}
 */
export function handle_dijkstra(start, end, rows, cols) {
    const ret = wasm.handle_dijkstra(start, end, rows, cols);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {Uint32Array}
 */
export function handle_a_star(start, end, rows, cols) {
    const ret = wasm.handle_a_star(start, end, rows, cols);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {Uint32Array}
 */
export function handle_greedy_bfs(start, end, rows, cols) {
    const ret = wasm.handle_greedy_bfs(start, end, rows, cols);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {Uint32Array}
 */
export function handle_bfs(start, end, rows, cols) {
    const ret = wasm.handle_bfs(start, end, rows, cols);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {Uint32Array}
 */
export function handle_dfs(start, end, rows, cols) {
    const ret = wasm.handle_dfs(start, end, rows, cols);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {Uint32Array}
 */
export function handle_bellman_ford(start, end, rows, cols) {
    const ret = wasm.handle_bellman_ford(start, end, rows, cols);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {Uint32Array}
 */
export function handle_bi_swarn(start, end, rows, cols) {
    const ret = wasm.handle_bi_swarn(start, end, rows, cols);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {number}
 */
export function benchmark_dijkstra(start, end, rows, cols) {
    const ret = wasm.benchmark_dijkstra(start, end, rows, cols);
    return ret >>> 0;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {number}
 */
export function benchmark_a_star(start, end, rows, cols) {
    const ret = wasm.benchmark_a_star(start, end, rows, cols);
    return ret >>> 0;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {number}
 */
export function bfs(start, end, rows, cols) {
    const ret = wasm.bfs(start, end, rows, cols);
    return ret >>> 0;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {number}
 */
export function dfs(start, end, rows, cols) {
    const ret = wasm.dfs(start, end, rows, cols);
    return ret >>> 0;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {number}
 */
export function bellman_ford(start, end, rows, cols) {
    const ret = wasm.bellman_ford(start, end, rows, cols);
    return ret >>> 0;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @returns {number}
 */
export function bi_swarn(start, end, rows, cols) {
    const ret = wasm.bi_swarn(start, end, rows, cols);
    return ret >>> 0;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} rows
 * @param {number} cols
 * @param {number} algo
 */
export function update_grid_for_algo(start, end, rows, cols, algo) {
    wasm.update_grid_for_algo(start, end, rows, cols, algo);
}

/**
 * * `algo_index` - Integer (0-6) representing the algorithm:
 *   * 0: Dijkstra
 *   * 1: A Star
 *   * 2: DFS
 *   * 3: BFS
 *   * 4: Greedy BFS
 *   * 5: Bellman Ford
 *   * 6: Bi Swarm
 * * `execution_time_ms` - Execution time in milliseconds
 * @param {number} algo_index
 * @param {number} execution_time_ms
 * @param {number} visited_nodes
 * @param {number} total_nodes
 * @returns {number}
 */
export function calculate_maze_algorithm_cost(algo_index, execution_time_ms, visited_nodes, total_nodes) {
    const ret = wasm.calculate_maze_algorithm_cost(algo_index, execution_time_ms, visited_nodes, total_nodes);
    return ret;
}

/**
 * @returns {number}
 */
export function get_visited_nodes() {
    const ret = wasm.get_visited_nodes();
    return ret >>> 0;
}

/**
 * @returns {number}
 */
export function get_visited_percentage() {
    const ret = wasm.get_visited_percentage();
    return ret;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_alert_de1d4a866ee3e4c3 = function(arg0, arg1) {
        alert(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_error_524f506f44df1645 = function(arg0) {
        console.error(arg0);
    };
    imports.wbg.__wbg_log_c222819a41e063d3 = function(arg0) {
        console.log(arg0);
    };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_random_3ad904d98382defe = function() {
        const ret = Math.random();
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_0;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('RUST_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
