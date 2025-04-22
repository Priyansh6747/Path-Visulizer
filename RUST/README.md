# RUST/src Directory

This directory contains the core Rust implementation of various pathfinding algorithms, utilities, and supporting modules. Below is a detailed explanation of each file and its role in the project:

### Files

1. **[`a_star.rs`](https://github.com/Priyansh6747/Path-Visulizer/blob/Prod/RUST/src/a_star.rs)**
   - Implements the **A\* search algorithm**.
   - A* is an efficient pathfinding algorithm that finds the shortest path between a start node and a goal node using heuristics.
   - Combines both **greedy best-first search** and **Dijkstra's algorithm** to find the shortest path while considering the least cost and estimated distance to the goal.

2. **[`bellman_ford.rs`](https://github.com/Priyansh6747/Path-Visulizer/blob/Prod/RUST/src/bellman_ford.rs)**
   - Contains the implementation of the **Bellman-Ford algorithm**.
   - This algorithm is suitable for graphs that may contain negative weight edges.
   - Unlike Dijkstra's, it can handle graphs with negative weights, but with a higher time complexity. It computes the shortest path from a single source to all other nodes.

3. **[`bfs.rs`](https://github.com/Priyansh6747/Path-Visulizer/blob/Prod/RUST/src/bfs.rs)**
   - Implements the **Breadth-First Search (BFS)** algorithm.
   - BFS is widely used for **unweighted graph traversal**.
   - It explores all the nodes at the present depth level before moving on to nodes at the next depth level, making it ideal for finding the shortest path in unweighted graphs.

4. **[`bi_swarm_algorithm.rs`](https://github.com/Priyansh6747/Path-Visulizer/blob/Prod/RUST/src/bi_swarm_algorithm.rs)**
   - Implements a **Bi-Swarm** (Bidirectional Swarm) algorithm.
   - Likely based on **swarm intelligence** principles, this algorithm simulates a distributed system of agents working cooperatively to find optimal solutions to pathfinding or optimization problems.
   - Utilizes **bi-directional search**, working from both the start and the goal simultaneously, to optimize search time.

5. **[`dfs.rs`](https://github.com/Priyansh6747/Path-Visulizer/blob/Prod/RUST/src/dfs.rs)**
   - Implements the **Depth-First Search (DFS)** algorithm.
   - DFS explores as far as possible down a branch before backtracking.
   - It's useful for searching all possible paths in a graph or tree, but does not guarantee the shortest path, which makes it more suitable for certain applications like topological sorting.

6. **[`dijkstra.rs`](https://github.com/Priyansh6747/Path-Visulizer/blob/Prod/RUST/src/dijkstra.rs)**
   - Implements **Dijkstra's algorithm**.
   - This algorithm is one of the most popular shortest path algorithms for graphs with non-negative weights.
   - It computes the shortest path from a single source node to all other nodes in a graph, guaranteeing the optimal path.

7. **[`greedy_bfs.rs`](https://github.com/Priyansh6747/Path-Visulizer/blob/Prod/RUST/src/greedy_bfs.rs)**
   - Implements the **Greedy Best-First Search (Greedy BFS)** algorithm.
   - Unlike A*, which balances cost and heuristics, Greedy BFS only uses the heuristic to select the next node, aiming to reach the goal as quickly as possible.
   - It’s faster but doesn't always guarantee the optimal path, making it suitable for faster approximations in certain scenarios.

8. **[`lib.rs`](https://github.com/Priyansh6747/Path-Visulizer/blob/Prod/RUST/src/lib.rs)**
   - This is the main library file for the Rust crate.
   - It provides an entry point to the various pathfinding algorithms and utilities.
   - It consolidates all algorithm implementations, offering a clean API for the frontend (via WebAssembly).

9. **[`maze.rs`](https://github.com/Priyansh6747/Path-Visulizer/blob/Prod/RUST/src/maze.rs)**
   - Contains the logic for **maze generation** and **solving**.
   - Useful for visualizing pathfinding algorithms in maze-like environments.
   - Supports the creation of both predefined and random mazes for algorithm testing and demonstrations.

10. **[`utils.rs`](https://github.com/Priyansh6747/Path-Visulizer/blob/Prod/RUST/src/utils.rs)**
    - Provides various **utility functions** and helper methods used across multiple modules in the project.
    - These utility functions handle common operations like grid manipulation, performance optimizations, and data formatting, which reduce redundancy in the main algorithm files.


**`Memory Sharing`** 
is achieved by creating a shared buffer. A thread is then locked to ensure safe access, enabling it to modify and interact with the grid efficiently.
---

Each of these files plays a vital role in building the core functionality of the **Path Visualizer**. The Rust logic is responsible for handling the computational-heavy tasks, providing a smooth and fast experience for visualizing pathfinding algorithms directly in the browser. For more details, check out the [repository root](https://github.com/Priyansh6747/Path-Visulizer).
