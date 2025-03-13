/* tslint:disable */
/* eslint-disable */
export function greet(): void;
export function create_cell_state_buffer(n: number): Uint8Array;
export function temp(): void;
export function create_shared_buffer(n: number): Uint8Array;
export function modify_from_rust(index: number, value: number): boolean;
export function get_buffer_ref(): Uint8Array;
export function get_buffer_copy(): Uint8Array;
export function show_buffer(): void;
export function reset_non_wall_nodes(): void;
export function clear_shared_buffer(): boolean;
export function gen_maze(start: number, end: number, cols: number): void;
export function handle_dijkstra(start: number, end: number, rows: number, cols: number): Uint32Array;
export function handle_a_star(start: number, end: number, rows: number, cols: number): Uint32Array;
export function handle_greedy_bfs(start: number, end: number, rows: number, cols: number): Uint32Array;
export function handle_bfs(start: number, end: number, rows: number, cols: number): Uint32Array;
export function handle_dfs(start: number, end: number, rows: number, cols: number): Uint32Array;
export function handle_bellman_ford(start: number, end: number, rows: number, cols: number): Uint32Array;
export function handle_bi_swarn(start: number, end: number, rows: number, cols: number): Uint32Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly greet: () => void;
  readonly create_cell_state_buffer: (a: number) => any;
  readonly temp: () => void;
  readonly modify_from_rust: (a: number, b: number) => number;
  readonly get_buffer_ref: () => any;
  readonly get_buffer_copy: () => any;
  readonly show_buffer: () => void;
  readonly reset_non_wall_nodes: () => void;
  readonly clear_shared_buffer: () => number;
  readonly gen_maze: (a: number, b: number, c: number) => void;
  readonly handle_dijkstra: (a: number, b: number, c: number, d: number) => [number, number];
  readonly handle_a_star: (a: number, b: number, c: number, d: number) => [number, number];
  readonly handle_greedy_bfs: (a: number, b: number, c: number, d: number) => [number, number];
  readonly handle_bfs: (a: number, b: number, c: number, d: number) => [number, number];
  readonly handle_dfs: (a: number, b: number, c: number, d: number) => [number, number];
  readonly handle_bellman_ford: (a: number, b: number, c: number, d: number) => [number, number];
  readonly handle_bi_swarn: (a: number, b: number, c: number, d: number) => [number, number];
  readonly create_shared_buffer: (a: number) => any;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
