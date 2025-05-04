#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <optional>
#include <utility>
#include <algorithm>

using Position = std::pair<int, int>;
using Graph = std::map<Position, std::map<Position, int>>;

// Convert 2D coordinates to 1D index
int get_index(int row, int col, int cols) {
    return row * cols + col;
}

// Check if a cell is a wall
bool is_wall(const std::vector<int>& grid, int row, int col, int cols) {
    int index = get_index(row, col, cols);
    return grid[index] == 1;
}

// Build graph from grid
Graph build_graph_from_grid(const std::vector<int>& grid, int rows, int cols) {
    Graph graph;
    std::vector<std::pair<int, int>> directions = {
        {0, 1}, {1, 0}, {0, -1}, {-1, 0}
    };

    for (int row = 0; row < rows; ++row) {
        for (int col = 0; col < cols; ++col) {
            if (is_wall(grid, row, col, cols)) continue;
            Position pos = {row, col};
            for (const auto& [dx, dy] : directions) {
                int new_row = row + dy;
                int new_col = col + dx;
                if (new_row < 0 || new_row >= rows || new_col < 0 || new_col >= cols) continue;
                if (is_wall(grid, new_row, new_col, cols)) continue;
                graph[pos][{new_row, new_col}] = 1;
            }
        }
    }
    return graph;
}

// Reconstruct path from predecessors
std::vector<Position> reconstruct_path(
    const std::map<Position, std::optional<std::pair<Position, int>>>& shortest_paths,
    Position start,
    Position end
) {
    std::vector<Position> path;
    Position current = end;
    while (current != start) {
        path.push_back(current);
        auto it = shortest_paths.find(current);
        if (it == shortest_paths.end() || !it->second.has_value()) break;
        current = it->second->first;
    }
    path.push_back(start);
    std::reverse(path.begin(), path.end());
    return path;
}

// Dijkstra's algorithm with visit order tracking
std::pair<std::map<Position, std::optional<std::pair<Position, int>>>, std::vector<int>>
dijkstra_with_visit_order(
    const Graph& graph,
    Position start,
    Position end,
    int cols
) {
    std::map<Position, std::optional<std::pair<Position, int>>> ans;
    std::set<std::pair<int, Position>> prio;
    std::vector<int> visited_order;

    visited_order.push_back(get_index(start.first, start.second, cols));
    ans[start] = std::nullopt;

    if (graph.find(start) == graph.end()) return {ans, visited_order};

    for (const auto& [neighbor, weight] : graph.at(start)) {
        ans[neighbor] = std::make_pair(start, weight);
        prio.insert({weight, neighbor});
    }

    while (!prio.empty()) {
        auto [path_weight, vertex] = *prio.begin();
        prio.erase(prio.begin());
        visited_order.push_back(get_index(vertex.first, vertex.second, cols));
        if (vertex == end) break;
        if (graph.find(vertex) == graph.end()) continue;
        for (const auto& [next, weight] : graph.at(vertex)) {
            int new_weight = path_weight + weight;
            auto it = ans.find(next);
            if (it != ans.end()) {
                if (it->second.has_value() && new_weight >= it->second->second) continue;
                prio.erase({it->second->second, next});
            }
            ans[next] = std::make_pair(vertex, new_weight);
            prio.insert({new_weight, next});
        }
    }

    return {ans, visited_order};
}

// Dijkstra's algorithm on grid
std::pair<std::optional<std::vector<Position>>, std::vector<int>>
dijkstra_grid(
    std::vector<int>& grid,
    Position start,
    Position end,
    int rows,
    int cols
) {
    Graph graph = build_graph_from_grid(grid, rows, cols);
    auto [shortest_paths, visited_order] = dijkstra_with_visit_order(graph, start, end, cols);

    std::optional<std::vector<Position>> path;
    if (shortest_paths.find(end) != shortest_paths.end()) {
        path = reconstruct_path(shortest_paths, start, end);
        for (const auto& [row, col] : *path) {
            int index = get_index(row, col, cols);
            if (grid[index] != 1) grid[index] = 3;
        }
    }

    for (int index : visited_order) {
        if (grid[index] == 0) grid[index] = 2;
    }

    return {path, visited_order};
}

// Get path indexes from positions
std::vector<int> get_path_indexes(const std::vector<Position>& path, int cols) {
    std::vector<int> indexes;
    for (const auto& [row, col] : path) {
        indexes.push_back(get_index(row, col, cols));
    }
    return indexes;
}

// Find shortest path
std::tuple<std::vector<int>, std::vector<int>, std::vector<int>>
find_shortest_path(
    std::vector<int> grid,
    int start_row,
    int start_col,
    int end_row,
    int end_col,
    int rows,
    int cols
) {
    Position start = {start_row, start_col};
    Position end = {end_row, end_col};
    auto [path_opt, visited_order] = dijkstra_grid(grid, start, end, rows, cols);
    std::vector<int> path_indexes;
    if (path_opt.has_value()) {
        path_indexes = get_path_indexes(*path_opt, cols);
    }
    return {grid, visited_order, path_indexes};
}
