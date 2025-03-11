use std::collections::VecDeque;

// Define a position in the grid as a tuple (row, col)
type Position = (usize, usize);

fn get_index(row: usize, col: usize, cols: usize) -> usize {
    row * cols + col
}

fn is_wall(grid: &Vec<i32>, row: usize, col: usize, cols: usize) -> bool {
    let index = get_index(row, col, cols);
    grid[index] == 1
}

// Function to check if a position is valid and not visited
fn is_valid(row: isize, col: isize, rows: usize, cols: usize, visited: &Vec<Vec<bool>>) -> bool {
    // If cell is out of bounds
    if row < 0 || col < 0 || row >= rows as isize || col >= cols as isize {
        return false;
    }

    // If the cell is already visited
    if visited[row as usize][col as usize] {
        return false;
    }

    // Otherwise, it can be visited
    true
}

fn dfs(
    grid: &mut Vec<i32>,
    start: Position,
    end: Position,
    rows: usize,
    cols: usize,
) -> (Option<Vec<Position>>, Vec<usize>) {
    // Initialize visited array
    let mut visited = vec![vec![false; cols]; rows];

    // Initialize parent map for path reconstruction
    let mut parent: Vec<Vec<Option<Position>>> = vec![vec![None; cols]; rows];

    // Track visited nodes in order
    let mut visited_order = Vec::new();

    // Initialize direction vectors (up, down, left, right) - changed order to prioritize up-down
    let dx: [isize; 4] = [0, 0, -1, 1];
    let dy: [isize; 4] = [-1, 1, 0, 0];

    // Initialize a stack for DFS
    let mut stack = Vec::new();
    stack.push(start);

    // Flag to track if end was found
    let mut found_end = false;

    // Perform DFS
    while !stack.is_empty() {
        // Pop the top position
        let current = stack.pop().unwrap();
        let (row, col) = current;

        // Check if the current cell is valid
        if visited[row][col] {
            continue;
        }

        // Mark as visited
        visited[row][col] = true;
        visited_order.push(get_index(row, col, cols));

        // Check if we've reached the end
        if current == end {
            found_end = true;
            break;
        }

        // Push all adjacent cells in reverse order (to match the exploration order)
        for i in (0..4).rev() {
            let adj_row = row as isize + dy[i];
            let adj_col = col as isize + dx[i];

            if is_valid(adj_row, adj_col, rows, cols, &visited) {
                let adj_row = adj_row as usize;
                let adj_col = adj_col as usize;

                // Skip walls
                if is_wall(grid, adj_row, adj_col, cols) {
                    continue;
                }

                // Set parent for path reconstruction
                parent[adj_row][adj_col] = Some(current);

                // Push to stack
                stack.push((adj_row, adj_col));
            }
        }
    }

    // Reconstruct path if end was found
    let path = if found_end {
        let mut path = Vec::new();
        let mut current = end;

        // Work backwards from end to start
        while current != start {
            path.push(current);

            if let Some(prev) = parent[current.0][current.1] {
                current = prev;
            } else {
                break; // Should not happen if end was found
            }
        }

        // Add start position
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

// Get the indexes of nodes in path
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

    let (path_opt, visited_order) = dfs(&mut grid, start, end, rows, cols);

    // Get path indexes if a path was found
    let path_indexes = match path_opt {
        Some(path) => get_path_indexes(&path, cols),
        None => Vec::new()
    };

    (grid, visited_order, path_indexes)
}