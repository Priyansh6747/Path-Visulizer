use std::collections::{BinaryHeap, BTreeMap, HashSet};
use std::cmp::Ordering;

// Define a position in the grid as a tuple (row, col)
type Position = (usize, usize);

// Node in the priority queue for Greedy Best-First Search
#[derive(Copy, Clone, Eq, PartialEq)]
struct Node {
    position: Position,
    priority: usize,  // Heuristic value (estimated distance to goal)
}

// Custom ordering for priority queue (min-heap)
impl Ord for Node {
    fn cmp(&self, other: &Self) -> Ordering {
        // Compare by priority (reversed for min-heap)
        other.priority.cmp(&self.priority)
    }
}

impl PartialOrd for Node {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn get_index(row: usize, col: usize, cols: usize) -> usize {
    row * cols + col
}

fn is_wall(grid: &Vec<i32>, row: usize, col: usize, cols: usize) -> bool {
    let index = get_index(row, col, cols);
    grid[index] == 1
}

// Manhattan distance heuristic
fn heuristic(position: Position, goal: Position) -> usize {
    let dx = if position.1 > goal.1 { position.1 - goal.1 } else { goal.1 - position.1 };
    let dy = if position.0 > goal.0 { position.0 - goal.0 } else { goal.0 - position.0 };
    dx + dy
}

fn greedy_best_first_search(
    grid: &mut Vec<i32>,
    start: Position,
    end: Position,
    rows: usize,
    cols: usize,
) -> (Option<Vec<Position>>, Vec<usize>) {
    let mut open_set = BinaryHeap::new();
    let mut closed_set = HashSet::new();
    let mut came_from = BTreeMap::new();
    let mut visited_order = Vec::new();

    // Define possible movements (up, right, down, left)
    let directions = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    // Add start node to open set
    open_set.push(Node {
        position: start,
        priority: heuristic(start, end),
    });

    while let Some(current) = open_set.pop() {
        let current_pos = current.position;
        let current_index = get_index(current_pos.0, current_pos.1, cols);

        // Skip if already processed
        if !closed_set.insert(current_pos) {
            continue;
        }

        // Add to visited order
        visited_order.push(current_index);

        // Check if we've reached the goal
        if current_pos == end {
            break;
        }

        // Explore neighbors
        for &(dx, dy) in &directions {
            let new_row = current_pos.0 as isize + dy;
            let new_col = current_pos.1 as isize + dx;

            // Check bounds
            if new_row < 0 || new_row >= rows as isize || new_col < 0 || new_col >= cols as isize {
                continue;
            }

            let new_row = new_row as usize;
            let new_col = new_col as usize;
            let neighbor = (new_row, new_col);

            // Skip walls and already visited positions
            if is_wall(grid, new_row, new_col, cols) || closed_set.contains(&neighbor) {
                continue;
            }

            // Add neighbor to the open set
            came_from.insert(neighbor, current_pos);
            open_set.push(Node {
                position: neighbor,
                priority: heuristic(neighbor, end),
            });
        }
    }

    // Reconstruct path
    let path = if came_from.contains_key(&end) {
        let mut path = Vec::new();
        let mut current = end;

        // Work backwards from end to start
        while current != start {
            path.push(current);
            current = came_from[&current];
        }

        // Add the start position
        path.push(start);

        // Reverse to get path from start to end
        path.reverse();

        // Mark path cells in the grid
        for &(row, col) in &path {
            let index = get_index(row, col, cols);
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
fn get_path_indexes(path: &Vec<Position>, cols: usize) -> Vec<usize> {
    path.iter()
        .map(|&(row, col)| get_index(row, col, cols))
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

    let (path_opt, visited_order) = greedy_best_first_search(&mut grid, start, end, rows, cols);

    // Get path indexes if a path was found
    let path_indexes = match path_opt {
        Some(path) => get_path_indexes(&path, cols),
        None => Vec::new()
    };

    (grid, visited_order, path_indexes)
}