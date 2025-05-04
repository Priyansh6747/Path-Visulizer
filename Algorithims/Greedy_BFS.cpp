#include <vector>
#include <queue>
#include <unordered_set>
#include <unordered_map>
#include <utility>
#include <algorithm>

using namespace std;

using Position = pair<int, int>;

struct Node {
    Position position;
    int priority;

    bool operator>(const Node& other) const {
        return priority > other.priority;
    }
};

inline int get_index(int row, int col, int cols) {
    return row * cols + col;
}

inline bool is_wall(const vector<int>& grid, int row, int col, int cols) {
    int index = get_index(row, col, cols);
    return grid[index] == 1;
}

int heuristic(Position a, Position b) {
    return abs(a.first - b.first) + abs(a.second - b.second); // Manhattan distance
}

pair<vector<Position>, vector<int>> greedy_best_first_search(
    vector<int>& grid,
    Position start,
    Position end,
    int rows,
    int cols
) {
    priority_queue<Node, vector<Node>, greater<Node>> open_set;
    unordered_set<int> closed_set;
    unordered_map<int, Position> came_from;
    vector<int> visited_order;

    vector<Position> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    open_set.push({start, heuristic(start, end)});

    while (!open_set.empty()) {
        Node current = open_set.top();
        open_set.pop();

        int current_index = get_index(current.position.first, current.position.second, cols);

        if (closed_set.count(current_index)) continue;
        closed_set.insert(current_index);
        visited_order.push_back(current_index);

        if (current.position == end) break;

        for (auto [dy, dx] : directions) {
            int new_row = current.position.first + dy;
            int new_col = current.position.second + dx;

            if (new_row < 0 || new_row >= rows || new_col < 0 || new_col >= cols)
                continue;

            int neighbor_index = get_index(new_row, new_col, cols);
            Position neighbor = {new_row, new_col};

            if (is_wall(grid, new_row, new_col, cols) || closed_set.count(neighbor_index))
                continue;

            came_from[neighbor_index] = current.position;
            open_set.push({neighbor, heuristic(neighbor, end)});
        }
    }

    vector<Position> path;
    int end_index = get_index(end.first, end.second, cols);
    if (came_from.find(end_index) != came_from.end()) {
        Position current = end;
        while (current != start) {
            path.push_back(current);
            current = came_from[get_index(current.first, current.second, cols)];
        }
        path.push_back(start);
        reverse(path.begin(), path.end());

        for (const auto& [row, col] : path) {
            int idx = get_index(row, col, cols);
            if (grid[idx] != 1) grid[idx] = 3;
        }
    }

    for (int idx : visited_order) {
        if (grid[idx] == 0) grid[idx] = 2;
    }

    return {path, visited_order};
}

vector<int> get_path_indexes(const vector<Position>& path, int cols) {
    vector<int> indexes;
    for (const auto& [row, col] : path) {
        indexes.push_back(get_index(row, col, cols));
    }
    return indexes;
}

tuple<vector<int>, vector<int>, vector<int>> find_shortest_path(
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

    auto [path, visited_order] = greedy_best_first_search(grid, start, end, rows, cols);
    vector<int> path_indexes = get_path_indexes(path, cols);

    return {grid, visited_order, path_indexes};
}
