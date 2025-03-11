use std::collections::{BTreeMap, BinaryHeap};
use std::cmp::Ordering;


type Position = (usize, usize);

// Node for the priority queue
#[derive(Copy, Clone, Eq, PartialEq)]
struct Node {
    position: Position,
    f_score: usize,  // f_score = g_score + h_score
    g_score: usize,  // g_score = cost from start to current node
}

// Custom ordering for the priority queue (min-heap)
impl Ord for Node {
    fn cmp(&self, other: &Self) -> Ordering {
        // Compare by f_score (min-heap)
        other.f_score.cmp(&self.f_score)
            // Break ties with g_score (prefer nodes closer to start when f_scores are equal)
            .then_with(|| other.g_score.cmp(&self.g_score))
    }
}

impl PartialOrd for Node {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn is_wall(grid: &Vec<i32>, row: usize, col: usize, cols: usize) -> bool {
    let index = get_index(row, col, cols);
    grid[index] == 1
}

fn get_index(row: usize, col: usize, cols: usize) -> usize {
    row * cols + col
}

// Heuristic function for A* (Manhattan distance with diagonal movement)
fn heuristic(current: Position, goal: Position) -> usize {
    let dx = if current.1 > goal.1 { current.1 - goal.1 } else { goal.1 - current.1 };
    let dy = if current.0 > goal.0 { current.0 - goal.0 } else { goal.0 - current.0 };

    // Using the diagonal shortcut heuristic (same as in the C++ implementation)
    if dx > dy {
        14 * dy + 10 * (dx - dy)
    } else {
        14 * dx + 10 * (dy - dx)
    }
}

fn get_neighbors(
    grid: &Vec<i32>,
    position: Position,
    rows: usize,
    cols: usize,
) -> Vec<(Position, usize)> {
    let (row, col) = position;
    let mut neighbors = Vec::new();

    // Define possible movements (right, down, left, up)
    let directions = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    for &(dy, dx) in &directions {
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

        // Add neighbor with weight 1 (all steps cost the same)
        neighbors.push(((new_row, new_col), 1));
    }

    neighbors
}

fn reconstruct_path(
    came_from: &BTreeMap<Position, Position>,
    start: Position,
    end: Position,
) -> Vec<Position> {
    let mut path = Vec::new();
    let mut current = end;

    while current != start {
        path.push(current);
        current = came_from[&current];
    }

    // Add the start position
    path.push(start);

    // Reverse to get path from start to end
    path.reverse();

    path
}

pub fn astar_grid(
    grid: &mut Vec<i32>,
    start: Position,
    end: Position,
    rows: usize,
    cols: usize,
) -> (Option<Vec<Position>>, Vec<usize>) {
    let mut open_set = BinaryHeap::new();
    let mut closed_set = BTreeMap::new();
    let mut g_scores = BTreeMap::new();
    let mut f_scores = BTreeMap::new();
    let mut came_from = BTreeMap::new();
    let mut visited_order = Vec::new();

    // Initialize start node
    g_scores.insert(start, 0);
    f_scores.insert(start, heuristic(start, end));
    open_set.push(Node {
        position: start,
        f_score: heuristic(start, end),
        g_score: 0,
    });

    // Add start position to visited order
    visited_order.push(get_index(start.0, start.1, cols));

    while let Some(current_node) = open_set.pop() {
        let current = current_node.position;

        // If we've already processed this node, skip it
        if closed_set.contains_key(&current) {
            continue;
        }

        // Add current node to visited order if not already visited
        let current_index = get_index(current.0, current.1, cols);
        if !visited_order.contains(&current_index) {
            visited_order.push(current_index);
        }

        // Mark node as processed
        closed_set.insert(current, true);

        // Check if we've reached the goal
        if current == end {
            // Reconstruct the path
            let path = reconstruct_path(&came_from, start, end);

            // Mark path cells in the grid
            for &(row, col) in &path {
                let index = get_index(row, col, cols);
                if grid[index] != 1 {  // Don't mark walls
                    grid[index] = 3;   // Mark as path
                }
            }

            return (Some(path), visited_order);
        }

        // Process neighbors
        for (neighbor, cost) in get_neighbors(grid, current, rows, cols) {
            // Skip already processed nodes
            if closed_set.contains_key(&neighbor) {
                continue;
            }

            // Calculate tentative g_score
            let tentative_g_score = g_scores[&current] + cost;

            // If we found a better path to neighbor
            if !g_scores.contains_key(&neighbor) || tentative_g_score < g_scores[&neighbor] {
                // Update neighbor's scores
                came_from.insert(neighbor, current);
                g_scores.insert(neighbor, tentative_g_score);
                let h_score = heuristic(neighbor, end);
                f_scores.insert(neighbor, tentative_g_score + h_score);

                // Add neighbor to open set
                open_set.push(Node {
                    position: neighbor,
                    f_score: tentative_g_score + h_score,
                    g_score: tentative_g_score,
                });

                // Mark unvisited cells in the grid
                let index = get_index(neighbor.0, neighbor.1, cols);
                if grid[index] == 0 {
                    grid[index] = 2;  // Mark as visited
                }
            }
        }
    }

    // If we get here, there's no path to the goal
    // Mark all visited cells in the grid
    for &index in &visited_order {
        if grid[index] == 0 {
            grid[index] = 2;  // Mark as visited
        }
    }

    (None, visited_order)
}

// Function to get the indexes of nodes in shortest path
pub fn get_path_indexes(path: &Vec<Position>, cols: usize) -> Vec<usize> {
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

    let (path_opt, visited_order) = astar_grid(&mut grid, start, end, rows, cols);

    // Get path indexes if a path was found
    let path_indexes = match path_opt {
        Some(path) => get_path_indexes(&path, cols),
        None => Vec::new()
    };

    (grid, visited_order, path_indexes)
}