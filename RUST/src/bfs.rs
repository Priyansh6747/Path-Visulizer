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

fn bfs(
    grid: &mut Vec<i32>,
    start: Position,
    end: Position,
    rows: usize,
    cols: usize,
) -> (Option<Vec<Position>>, Vec<usize>) {
    // Initialize levels array (distances from start)
    let mut levels = vec![vec![-1; cols]; rows];

    // Initialize visited array
    let mut visited = vec![vec![false; cols]; rows];

    // Track visited nodes in order
    let mut visited_order = Vec::new();

    // Define possible movements (right, left, down, up)
    let dx: [isize; 4] = [1, -1, 0, 0];
    let dy: [isize; 4] = [0, 0, 1, -1];

    // Initialize the queue with start position
    let mut queue = VecDeque::new();
    queue.push_back(start);

    // Mark start as visited
    visited[start.0][start.1] = true;
    levels[start.0][start.1] = 0;
    visited_order.push(get_index(start.0, start.1, cols));

    // Process the queue until it's empty or we've visited the end
    while !queue.is_empty() && !visited[end.0][end.1] {
        // Get next position
        let (curr_x, curr_y) = queue.pop_front().unwrap();

        // Check all four directions
        for i in 0..4 {
            let new_x = curr_x as isize + dy[i];
            let new_y = curr_y as isize + dx[i];

            // Check bounds
            if new_x < 0 || new_x >= rows as isize || new_y < 0 || new_y >= cols as isize {
                continue;
            }

            let new_x = new_x as usize;
            let new_y = new_y as usize;

            // Skip walls and already visited cells
            if is_wall(grid, new_x, new_y, cols) || visited[new_x][new_y] {
                continue;
            }

            // Mark as visited and set level
            visited[new_x][new_y] = true;
            levels[new_x][new_y] = levels[curr_x][curr_y] + 1;

            // Add to visited order
            visited_order.push(get_index(new_x, new_y, cols));

            // Add to queue
            queue.push_back((new_x, new_y));
        }
    }

    // Reconstruct path if end is reachable
    let path = if levels[end.0][end.1] != -1 {
        let mut path = Vec::new();
        let mut curr = end;
        path.push(curr);

        // Work backwards from end to start
        let mut curr_level = levels[curr.0][curr.1];

        while curr != start {
            for i in 0..4 {
                let prev_x = curr.0 as isize + dy[i];
                let prev_y = curr.1 as isize + dx[i];

                // Check bounds
                if prev_x < 0 || prev_x >= rows as isize || prev_y < 0 || prev_y >= cols as isize {
                    continue;
                }

                let prev_x = prev_x as usize;
                let prev_y = prev_y as usize;

                // If this is the previous cell in the path
                if visited[prev_x][prev_y] && levels[prev_x][prev_y] == curr_level - 1 {
                    curr = (prev_x, prev_y);
                    curr_level -= 1;
                    path.push(curr);
                    break;
                }
            }
        }

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

    let (path_opt, visited_order) = bfs(&mut grid, start, end, rows, cols);

    // Get path indexes if a path was found
    let path_indexes = match path_opt {
        Some(path) => get_path_indexes(&path, cols),
        None => Vec::new()
    };

    (grid, visited_order, path_indexes)
}