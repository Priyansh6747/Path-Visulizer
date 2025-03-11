use std::collections::{BTreeMap, BTreeSet};
// Define a position in the grid as a tuple (row, col)
type Position = (usize, usize);

fn is_wall(grid: &Vec<i32>, row: usize, col: usize, cols: usize) -> bool {
    let index = get_index(row, col, cols);
    grid[index] == 1
}

fn get_index(row: usize, col: usize, cols: usize) -> usize {
    row * cols + col
}

fn build_graph_from_grid(
    grid: &Vec<i32>,
    rows: usize,
    cols: usize,
) -> BTreeMap<Position, BTreeMap<Position, isize>> {
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
                // Using isize for compatibility with Bellman-Ford
                graph.get_mut(&position).unwrap().insert((new_row, new_col), 1);
            }
        }
    }

    graph
}

fn reconstruct_path(
    shortest_paths: &BTreeMap<Position, Option<(Position, isize)>>,
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

// Bellman-Ford algorithm for grid pathfinding with visit order tracking
// Modified to stop when reaching the end node
fn bellman_ford_with_visit_order(
    graph: &BTreeMap<Position, BTreeMap<Position, isize>>,
    start: Position,
    end: Position,
    cols: usize,
) -> (BTreeMap<Position, Option<(Position, isize)>>, Vec<usize>) {
    let mut ans: BTreeMap<Position, Option<(Position, isize)>> = BTreeMap::new();
    let mut visited = BTreeSet::new();
    let mut visited_order = Vec::new();

    // Add start to visited
    visited.insert(start);
    visited_order.push(start.0 * cols + start.1);

    // Start is the special case that doesn't have a predecessor
    ans.insert(start, None);

    // If start isn't in the graph (e.g., it's a wall), return empty result
    if !graph.contains_key(&start) {
        return (ans, visited_order);
    }

    // Add neighbors of start
    for (new, weight) in &graph[&start] {
        ans.insert(*new, Some((start, *weight)));
        visited.insert(*new);
        visited_order.push(new.0 * cols + new.1);

        // If end is reached immediately, return early
        if *new == end {
            return (ans, visited_order);
        }
    }

    // Relax edges |V| - 1 times
    for _ in 1..graph.len() {
        let mut updated = false;

        for (&u, edges) in graph {
            // Skip if u is not reachable yet
            if !ans.contains_key(&u) {
                continue;
            }

            let dist_u = match ans.get(&u) {
                Some(Some((_, d))) => *d,
                Some(None) => 0, // Start vertex
                None => continue,
            };

            for (&v, &weight) in edges {
                let new_dist = dist_u + weight;

                match ans.get(&v) {
                    Some(Some((_, current_dist))) => {
                        if new_dist < *current_dist {
                            ans.insert(v, Some((u, new_dist)));
                            updated = true;

                            // Add to visited if not already
                            if !visited.contains(&v) {
                                visited.insert(v);
                                visited_order.push(v.0 * cols + v.1);
                            }

                            // If end is reached, return early
                            if v == end {
                                return (ans, visited_order);
                            }
                        }
                    }
                    None => {
                        ans.insert(v, Some((u, new_dist)));
                        updated = true;

                        // Add to visited if not already
                        if !visited.contains(&v) {
                            visited.insert(v);
                            visited_order.push(v.0 * cols + v.1);
                        }

                        // If end is reached, return early
                        if v == end {
                            return (ans, visited_order);
                        }
                    }
                    _ => {}
                }
            }
        }

        // Early termination if no updates in this round
        if !updated {
            break;
        }
    }

    (ans, visited_order)
}

pub fn bellman_ford_grid(
    grid: &mut Vec<i32>,
    start: Position,
    end: Position,
    rows: usize,
    cols: usize,
) -> (Option<Vec<Position>>, Vec<usize>) {
    // Create a graph representation from the grid
    let graph = build_graph_from_grid(grid, rows, cols);

    // Run Bellman-Ford algorithm and collect visited indexes in order
    let (shortest_paths, visited_order) = bellman_ford_with_visit_order(&graph, start, end, cols);

    // Reconstruct the path if end is reachable
    let path = if shortest_paths.contains_key(&end) {
        // Reconstruct the path from start to end
        let path = reconstruct_path(&shortest_paths, start, end);

        // Mark path cells in the grid
        for &(row, col) in &path {
            let index = row * cols + col;
            if grid[index] != 1 { // Don't mark walls
                grid[index] = 3; // Mark as path
            }
        }

        Some(path)
    } else {
        None
    };

    // Mark all visited cells in the grid (if they're not already part of the path)
    for &index in &visited_order {
        if grid[index] == 0 {
            grid[index] = 2; // Mark as visited
        }
    }

    (path, visited_order)
}

// Get the indexes of nodes in shortest path
pub fn get_path_indexes(path: &Vec<Position>, cols: usize) -> Vec<usize> {
    path.iter()
        .map(|&(row, col)| row * cols + col)
        .collect()
}

pub fn find_shortest_path(
    mut grid: Vec<i32>,
    start_row: usize,
    start_col: usize,
    end_row: usize,
    end_col: usize,
    rows: usize,
    cols: usize,
) -> (Vec<i32>, Vec<usize>, Vec<usize>) {
    let start = (start_row, start_col);
    let end = (end_row, end_col);

    let (path_opt, visited_order) = bellman_ford_grid(&mut grid, start, end, rows, cols);

    // Get path indexes if a path was found
    let path_indexes = match path_opt {
        Some(path) => get_path_indexes(&path, cols),
        None => Vec::new()
    };

    (grid, visited_order, path_indexes)
}