use wasm_bindgen::prelude::*;
use js_sys::Math;

// Custom random number generator for wasm
struct WasmRng;

impl WasmRng {
    fn new() -> Self {
        WasmRng
    }

    fn gen_range(&self, min: usize, max: usize) -> usize {
        (Math::random() * (max - min) as f64) as usize + min
    }
}

/// Represents a 2D grid as a 1D array with maze generation capabilities
struct Grid {
    cells: Vec<bool>,  // true = wall, false = path
    width: usize,
    height: usize,
}

impl Grid {
    /// Create a new grid with all walls
    fn new(width: usize, height: usize) -> Self {
        let size = width * height;
        Grid {
            cells: vec![true; size],  // Initialize all cells as walls
            width,
            height,
        }
    }

    /// Create a grid from existing data
    fn from_u8_vec(data: &[u8], width: usize) -> Self {
        let height = data.len() / width;
        let cells = data.iter().map(|&val| val > 0).collect();

        Grid {
            cells,
            width,
            height,
        }
    }

    /// Convert (x, y) coordinates to linear index
    fn idx(&self, x: usize, y: usize) -> usize {
        y * self.width + x
    }

    /// Check if coordinates are valid
    fn is_valid(&self, x: usize, y: usize) -> bool {
        x < self.width && y < self.height
    }

    /// Set a cell to be a path (not a wall)
    fn carve_path(&mut self, x: usize, y: usize) {
        let idx = self.idx(x, y);
        self.cells[idx] = false;
    }

    /// Check if a cell is a wall
    fn is_wall(&self, x: usize, y: usize) -> bool {
        if !self.is_valid(x, y) {
            return true;
        }
        self.cells[self.idx(x, y)]
    }

    /// Generate a maze using the depth-first search algorithm
    fn generate_maze(&mut self) {
        // Start with a grid full of walls
        for i in 0..self.cells.len() {
            self.cells[i] = true;
        }

        // Using wasm-bindgen for random number generation
        let rng = WasmRng::new();

        let start_x = 1;
        let start_y = 1;

        // Stack for backtracking
        let mut stack = vec![(start_x, start_y)];
        self.carve_path(start_x, start_y);

        // Directions: right, down, left, up
        let directions = [(2, 0), (0, 2), (-2, 0), (0, -2)];

        while !stack.is_empty() {
            let (x, y) = *stack.last().unwrap();

            // Get unvisited neighbors
            let mut neighbors = Vec::new();

            for (dx, dy) in directions.iter() {
                let nx = (x as isize + dx) as usize;
                let ny = (y as isize + dy) as usize;

                // Check if neighbor is valid and unvisited (is still a wall)
                if self.is_valid(nx, ny) && self.is_wall(nx, ny) {
                    neighbors.push((nx, ny));
                }
            }

            if !neighbors.is_empty() {
                // Using our custom random generator
                let idx = rng.gen_range(0, neighbors.len());
                let (nx, ny) = neighbors[idx];

                // Carve path in the next cell
                self.carve_path(nx, ny);

                // Carve path in the cell between current and next
                let wall_x = (x + nx) / 2;
                let wall_y = (y + ny) / 2;
                self.carve_path(wall_x, wall_y);

                // Add next cell to stack
                stack.push((nx, ny));
            } else {
                // Backtrack
                stack.pop();
            }
        }

        // Carve entrance and exit
        self.carve_path(0, 1);
        self.carve_path(self.width - 1, self.height - 2);
    }

    /// Convert to u8 vector (0 = path, 1 = wall)
    fn to_u8_vec(&self) -> Vec<u8> {
        self.cells.iter().map(|&wall| if wall { 1u8 } else { 0u8 }).collect()
    }

    /// Print the maze - this function would typically not be used in WASM
    #[allow(dead_code)]
    fn print(&self) {
        for y in 0..self.height {
            for x in 0..self.width {
                if self.is_wall(x, y) {
                    print!("█");
                } else {
                    print!(" ");
                }
            }
            println!();
        }
    }
}

/// Function to mazify a 2D grid represented as a 1D Vec<u8>

pub fn mazify(grid_data: &mut [u8], width: usize) {
    let height = grid_data.len() / width;
    let mut grid = Grid::from_u8_vec(grid_data, width);
    grid.generate_maze();
    let result = grid.to_u8_vec();
    for i in 0..grid_data.len() {
        grid_data[i] = result[i];
    }
}

// Export functions for use in JavaScript
pub fn generate_maze(width: usize, height: usize) -> Vec<u8> {
    let mut grid = Grid::new(width, height);
    grid.generate_maze();
    grid.to_u8_vec()
}

