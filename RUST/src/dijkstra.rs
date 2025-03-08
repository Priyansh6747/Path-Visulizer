use web_sys::console;
use std::collections::{BTreeMap, BTreeSet};

// Define a position in the grid as a tuple (row, col)
type Position = (usize, usize);

// Implement Dijkstra's algorithm for a 2D grid represented as a linear array
pub fn dijkstra_grid(
    grid: &mut Vec<i32>,
    start: Position,
    end: Position,
    rows: usize,
    cols: usize,
) -> Option<Vec<Position>> {
    // Create a graph representation from the grid
    let graph = build_graph_from_grid(grid, rows, cols);

    // Run Dijkstra's algorithm
    let shortest_paths = dijkstra(&graph, start);

    // Reconstruct the path if end is reachable
    if !shortest_paths.contains_key(&end) {
        return None;
    }

    // Reconstruct the path from start to end
    let path = reconstruct_path(&shortest_paths, start, end);

    // Mark visited cells and path cells in the grid
    for &(row, col) in graph.keys() {
        let index = row * cols + col;
        if grid[index] == 0 {
            grid[index] = 2; // Mark as visited
        }
    }

    for &(row, col) in &path {
        let index = row * cols + col;
        if grid[index] != 1 { // Don't mark walls
            grid[index] = 3; // Mark as path
        }
    }

    Some(path)
}

// Helper function to get index from row and column
fn get_index(row: usize, col: usize, cols: usize) -> usize {
    row * cols + col
}

// Helper function to check if a position is a wall
fn is_wall(grid: &Vec<i32>, row: usize, col: usize, cols: usize) -> bool {
    let index = get_index(row, col, cols);
    grid[index] == 1
}

// Build a graph representation from the grid
fn build_graph_from_grid(
    grid: &Vec<i32>,
    rows: usize,
    cols: usize,
) -> BTreeMap<Position, BTreeMap<Position, usize>> {
    let mut graph = BTreeMap::new();

    // Define possible movements (up, right, down, left)
    let directions = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    for row in 0..rows {
        for col in 0..cols {
            // Skip walls
            if is_wall(grid, row, col, cols) {
                continue;
            }

            let position = (row, col);
            let neighbors = BTreeMap::new();
            graph.insert(position, neighbors);

            // Add edges to neighbors
            for &(dx, dy) in &directions {
                let new_row = row as isize + dy;
                let new_col = col as isize + dx;

                // Check bounds
                if new_row < 0 || new_row >= rows as isize || new_col < 0 || new_col >= cols as isize {
                    continue;
                }

                let new_row = new_row as usize;
                let new_col = new_col as usize;

                // Skip walls
                if is_wall(grid, new_row, new_col, cols) {
                    continue;
                }

                // Add edge with weight 1 (all steps cost the same)
                graph.get_mut(&position).unwrap().insert((new_row, new_col), 1);
            }
        }
    }

    graph
}

fn dijkstra(
    graph: &BTreeMap<Position, BTreeMap<Position, usize>>,
    start: Position,
) -> BTreeMap<Position, Option<(Position, usize)>> {
    let mut ans = BTreeMap::new();
    let mut prio = BTreeSet::new();

    // Start is the special case that doesn't have a predecessor
    ans.insert(start, None);

    // If start isn't in the graph (e.g., it's a wall), return empty result
    if !graph.contains_key(&start) {
        return ans;
    }

    for (new, weight) in &graph[&start] {
        ans.insert(*new, Some((start, *weight)));
        prio.insert((*weight, *new));
    }

    while let Some((path_weight, vertex)) = prio.pop_first() {
        if !graph.contains_key(&vertex) {
            continue;
        }

        for (next, weight) in &graph[&vertex] {
            let new_weight = path_weight + *weight;
            match ans.get(next) {
                // If ans[next] is a lower dist than the alternative one, do nothing
                Some(Some((_, dist_next))) if new_weight >= *dist_next => {}
                // If ans[next] is None then next is start and the distance won't be changed
                Some(None) => {}
                // The new path is shorter, either new was not in ans or it was farther
                _ => {
                    if let Some(Some((_, prev_weight))) =
                        ans.insert(*next, Some((vertex, new_weight)))
                    {
                        prio.remove(&(prev_weight, *next));
                    }
                    prio.insert((new_weight, *next));
                }
            }
        }
    }

    ans
}

// Reconstruct the path from start to end using the shortest paths map
fn reconstruct_path(
    shortest_paths: &BTreeMap<Position, Option<(Position, usize)>>,
    start: Position,
    end: Position,
) -> Vec<Position> {
    let mut path = Vec::new();
    let mut current = end;

    // Work backwards from end to start
    while current != start {
        path.push(current);

        if let Some(Some((predecessor, _))) = shortest_paths.get(&current) {
            current = *predecessor;
        } else {
            break;
        }
    }

    // Add the start position
    path.push(start);

    // Reverse to get path from start to end
    path.reverse();

    path
}



// Public function for external use
pub fn find_shortest_path(
    mut grid: Vec<i32>,
    start_row: usize,
    start_col: usize,
    end_row: usize,
    end_col: usize,
    rows: usize,
    cols: usize,
) -> Vec<i32> {
    let start = (start_row, start_col);
    let end = (end_row, end_col);

    let _ = dijkstra_grid(&mut grid, start, end, rows, cols);

    grid
}