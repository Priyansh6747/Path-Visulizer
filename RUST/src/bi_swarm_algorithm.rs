use std::collections::{BTreeMap, BTreeSet, VecDeque};

// Define a position in the grid as a tuple (row, col)
type Position = (usize, usize);

fn is_wall(grid: &Vec<i32>, row: usize, col: usize, cols: usize) -> bool {
    let index = get_index(row, col, cols);
    grid[index] == 1
}

fn get_index(row: usize, col: usize, cols: usize) -> usize {
    row * cols + col
}

// Get neighboring positions that are valid moves
fn get_neighbors(
    grid: &Vec<i32>,
    position: Position,
    rows: usize,
    cols: usize,
) -> Vec<Position> {
    let (row, col) = position;
    let directions = [(0, 1), (1, 0), (0, usize::MAX), (usize::MAX, 0)]; // right, down, left, up
    let mut neighbors = Vec::new();

    for &(dx, dy) in &directions {
        let new_row = if dy == usize::MAX {
            if row == 0 { continue; } else { row - 1 }
        } else {
            row.saturating_add(dy)
        };

        let new_col = if dx == usize::MAX {
            if col == 0 { continue; } else { col - 1 }
        } else {
            col.saturating_add(dx)
        };

        // Check bounds
        if new_row >= rows || new_col >= cols {
            continue;
        }

        // Skip walls
        if is_wall(grid, new_row, new_col, cols) {
            continue;
        }

        neighbors.push((new_row, new_col));
    }

    neighbors
}

// Main bidirectional swarm search function
fn bidirectional_swarm_search(
    grid: &Vec<i32>,
    start: Position,
    end: Position,
    rows: usize,
    cols: usize,
) -> (Option<Vec<Position>>, Vec<usize>) {
    // Early exit if start or end is a wall
    if is_wall(grid, start.0, start.1, cols) || is_wall(grid, end.0, end.1, cols) {
        return (None, Vec::new());
    }

    // Initialize queues for both directions
    let mut forward_queue = VecDeque::new();
    let mut backward_queue = VecDeque::new();

    // Initialize visited sets and parent maps for both directions
    let mut forward_visited = BTreeSet::new();
    let mut backward_visited = BTreeSet::new();
    let mut forward_parent: BTreeMap<Position, Position> = BTreeMap::new();
    let mut backward_parent: BTreeMap<Position, Position> = BTreeMap::new();

    // Track all visited nodes in order for visualization
    let mut visited_order = Vec::new();

    // Initialize with start and end
    forward_queue.push_back(start);
    backward_queue.push_back(end);
    forward_visited.insert(start);
    backward_visited.insert(end);

    // Add start and end positions to visited order
    visited_order.push(get_index(start.0, start.1, cols));

    // Meeting point will be set when the two searches meet
    let mut meeting_point: Option<Position> = None;

    // Main search loop - alternate between forward and backward searches
    while !forward_queue.is_empty() && !backward_queue.is_empty() && meeting_point.is_none() {
        // Forward search step
        if let Some(meeting) = swarm_step(
            grid,
            &mut forward_queue,
            &mut forward_visited,
            &mut forward_parent,
            &backward_visited,
            &mut visited_order,
            rows,
            cols,
        ) {
            meeting_point = Some(meeting);
            break;
        }

        // Backward search step
        if let Some(meeting) = swarm_step(
            grid,
            &mut backward_queue,
            &mut backward_visited,
            &mut backward_parent,
            &forward_visited,
            &mut visited_order,
            rows,
            cols,
        ) {
            meeting_point = Some(meeting);
            break;
        }
    }

    // Reconstruct path if a meeting point was found
    if let Some(meeting) = meeting_point {
        // Build forward path: start -> meeting
        let mut forward_path = Vec::new();
        let mut current = meeting;

        while current != start {
            forward_path.push(current);
            if let Some(&parent) = forward_parent.get(&current) {
                current = parent;
            } else {
                break;
            }
        }
        forward_path.push(start);
        forward_path.reverse();

        // Build backward path: meeting -> end
        let mut backward_path = Vec::new();
        let mut current = meeting;

        while current != end {
            if let Some(&parent) = backward_parent.get(&current) {
                current = parent;
                backward_path.push(current);
            } else {
                break;
            }
        }

        // Combine paths: start -> meeting -> end
        let mut complete_path = forward_path;
        complete_path.extend(backward_path);

        return (Some(complete_path), visited_order);
    }

    (None, visited_order)
}

// Helper function for a single swarm search step
fn swarm_step(
    grid: &Vec<i32>,
    queue: &mut VecDeque<Position>,
    visited: &mut BTreeSet<Position>,
    parent_map: &mut BTreeMap<Position, Position>,
    other_visited: &BTreeSet<Position>,
    visited_order: &mut Vec<usize>,
    rows: usize,
    cols: usize,
) -> Option<Position> {
    // Process all nodes at the current level (breadth-first)
    let level_size = queue.len();

    for _ in 0..level_size {
        if let Some(current) = queue.pop_front() {
            // Check if we've found a meeting point
            if other_visited.contains(&current) {
                return Some(current);
            }

            // Get neighbors
            let neighbors = get_neighbors(grid, current, rows, cols);

            for neighbor in neighbors {
                if !visited.contains(&neighbor) {
                    // Mark as visited
                    visited.insert(neighbor);

                    // Add to queue
                    queue.push_back(neighbor);

                    // Record parent for path reconstruction
                    parent_map.insert(neighbor, current);

                    // Add to visited order for visualization
                    visited_order.push(get_index(neighbor.0, neighbor.1, cols));

                    // Check if we've found a meeting point immediately
                    if other_visited.contains(&neighbor) {
                        return Some(neighbor);
                    }
                }
            }
        }
    }

    None
}

// Similar to the Dijkstra implementation but using bidirectional search
pub fn bidirectional_swarm_grid(
    grid: &mut Vec<i32>,
    start: Position,
    end: Position,
    rows: usize,
    cols: usize,
) -> (Option<Vec<Position>>, Vec<usize>) {
    // Run bidirectional swarm search
    let (path_opt, visited_order) = bidirectional_swarm_search(grid, start, end, rows, cols);

    // Mark path and visited cells
    if let Some(ref path) = path_opt {
        // Mark path cells
        for &(row, col) in path {
            let index = get_index(row, col, cols);
            if grid[index] != 1 { // Don't mark walls
                grid[index] = 3; // Mark as path
            }
        }
    }

    // Mark visited cells
    for &index in &visited_order {
        if grid[index] == 0 {
            grid[index] = 2; // Mark as visited
        }
    }

    (path_opt, visited_order)
}

// Helper to get indexes of nodes in shortest path
pub fn get_path_indexes(path: &Vec<Position>, cols: usize) -> Vec<usize> {
    path.iter()
        .map(|&(row, col)| get_index(row, col, cols))
        .collect()
}

// Main function with the required signature
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

    let (path_opt, visited_order) = bidirectional_swarm_grid(&mut grid, start, end, rows, cols);

    // Get path indexes if a path was found
    let path_indexes = match path_opt {
        Some(path) => get_path_indexes(&path, cols),
        None => Vec::new()
    };

    (grid, visited_order, path_indexes)
}