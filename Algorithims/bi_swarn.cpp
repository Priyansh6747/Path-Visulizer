#include <vector>
#include <queue>
#include <set>
#include <map>

using namespace std;

using Position = pair<int, int>;

int get_index(int row, int col, int cols) {
    return row * cols + col;
}

bool is_wall(const vector<int>& grid, int row, int col, int cols) {
    int index = get_index(row, col, cols);
    return grid[index] == 1;
}

vector<Position> get_neighbors(const vector<int>& grid, Position pos, int rows, int cols) {
    int row = pos.first;
    int col = pos.second;
    vector<Position> neighbors;
    vector<pair<int, int>> directions = {{0,1}, {1,0}, {0,-1}, {-1,0}};

    for (auto [dr, dc] : directions) {
        int new_row = row + dr;
        int new_col = col + dc;

        if (new_row < 0 || new_row >= rows || new_col < 0 || new_col >= cols) continue;
        if (is_wall(grid, new_row, new_col, cols)) continue;

        neighbors.emplace_back(new_row, new_col);
    }

    return neighbors;
}

optional<Position> swarm_step(
    const vector<int>& grid,
    queue<Position>& q,
    set<Position>& visited,
    map<Position, Position>& parent_map,
    const set<Position>& other_visited,
    vector<int>& visited_order,
    int rows, int cols
) {
    int level_size = q.size();
    for (int i = 0; i < level_size; ++i) {
        Position current = q.front(); q.pop();
        if (other_visited.count(current)) return current;

        for (auto neighbor : get_neighbors(grid, current, rows, cols)) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
                parent_map[neighbor] = current;
                visited_order.push_back(get_index(neighbor.first, neighbor.second, cols));
                if (other_visited.count(neighbor)) return neighbor;
            }
        }
    }
    return nullopt;
}

pair<optional<vector<Position>>, vector<int>> bidirectional_swarm_search(
    vector<int>& grid,
    Position start,
    Position end,
    int rows,
    int cols
) {
    if (is_wall(grid, start.first, start.second, cols) || is_wall(grid, end.first, end.second, cols)) {
        return {nullopt, {}};
    }

    queue<Position> forward_q, backward_q;
    set<Position> forward_visited, backward_visited;
    map<Position, Position> forward_parent, backward_parent;
    vector<int> visited_order;

    forward_q.push(start); forward_visited.insert(start);
    backward_q.push(end); backward_visited.insert(end);
    visited_order.push_back(get_index(start.first, start.second, cols));

    optional<Position> meeting_point = nullopt;

    while (!forward_q.empty() && !backward_q.empty() && !meeting_point.has_value()) {
        meeting_point = swarm_step(grid, forward_q, forward_visited, forward_parent, backward_visited, visited_order, rows, cols);
        if (meeting_point.has_value()) break;
        meeting_point = swarm_step(grid, backward_q, backward_visited, backward_parent, forward_visited, visited_order, rows, cols);
    }

    if (meeting_point) {
        vector<Position> forward_path, backward_path;
        Position current = *meeting_point;
        while (current != start) {
            forward_path.push_back(current);
            current = forward_parent[current];
        }
        forward_path.push_back(start);
        reverse(forward_path.begin(), forward_path.end());

        current = *meeting_point;
        while (current != end) {
            current = backward_parent[current];
            backward_path.push_back(current);
        }

        forward_path.insert(forward_path.end(), backward_path.begin(), backward_path.end());
        return {forward_path, visited_order};
    }

    return {nullopt, visited_order};
}

pair<vector<int>, pair<vector<int>, vector<int>>> find_shortest_path(
    vector<int> grid,
    int start_row,
    int start_col,
    int end_row,
    int end_col,
    int rows,
    int cols
) {
    Position start = {start_row, start_col};
    Position end = {end_row, end_col};

    auto [path_opt, visited_order] = bidirectional_swarm_search(grid, start, end, rows, cols);
    vector<int> path_indexes;

    if (path_opt) {
        for (const auto& [r, c] : *path_opt) {
            int idx = get_index(r, c, cols);
            if (grid[idx] != 1) grid[idx] = 3;
            path_indexes.push_back(idx);
        }
    }

    for (int idx : visited_order) {
        if (grid[idx] == 0) grid[idx] = 2;
    }

    return {grid, {visited_order, path_indexes}};
}
