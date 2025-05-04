#include <iostream>
#include <vector>
#include <queue>
#include <map>
#include <algorithm>

using namespace std;

using Position = pair<int, int>;

struct Node {
    Position position;
    int f_score;
    int g_score;

    // Reverse comparison for min-heap
    bool operator<(const Node& other) const {
        if (f_score == other.f_score)
            return g_score > other.g_score; // prefer lower g_score on tie
        return f_score > other.f_score;
    }
};

int getIndex(int row, int col, int cols) {
    return row * cols + col;
}

bool isWall(const vector<int>& grid, int row, int col, int cols) {
    int index = getIndex(row, col, cols);
    return grid[index] == 1;
}

// Diagonal-based Manhattan heuristic
int heuristic(Position current, Position goal) {
    int dx = abs(current.second - goal.second);
    int dy = abs(current.first - goal.first);
    return dx > dy ? 14 * dy + 10 * (dx - dy) : 14 * dx + 10 * (dy - dx);
}

vector<pair<Position, int>> getNeighbors(const vector<int>& grid, Position pos, int rows, int cols) {
    int row = pos.first, col = pos.second;
    vector<pair<Position, int>> neighbors;

    vector<pair<int, int>> directions = {
        {0, 1}, {1, 0}, {0, -1}, {-1, 0}
        // Uncomment below for diagonal movement:
        //,{1, 1}, {1, -1}, {-1, 1}, {-1, -1}
    };

    for (auto [dy, dx] : directions) {
        int new_row = row + dy;
        int new_col = col + dx;

        if (new_row < 0 || new_row >= rows || new_col < 0 || new_col >= cols)
            continue;

        if (isWall(grid, new_row, new_col, cols))
            continue;

        int cost = (abs(dy) + abs(dx) == 2) ? 14 : 10; // 14 for diagonal, 10 otherwise
        neighbors.push_back({{new_row, new_col}, cost});
    }

    return neighbors;
}

vector<Position> reconstructPath(map<Position, Position>& came_from, Position start, Position end) {
    vector<Position> path;
    Position current = end;

    while (current != start) {
        path.push_back(current);
        current = came_from[current];
    }
    path.push_back(start);
    reverse(path.begin(), path.end());
    return path;
}

pair<optional<vector<Position>>, vector<int>> astarGrid(
    vector<int>& grid, Position start, Position end, int rows, int cols
) {
    priority_queue<Node> open_set;
    map<Position, bool> closed_set;
    map<Position, int> g_scores;
    map<Position, int> f_scores;
    map<Position, Position> came_from;
    vector<int> visited_order;

    g_scores[start] = 0;
    int h_start = heuristic(start, end);
    f_scores[start] = h_start;

    open_set.push({start, h_start, 0});
    visited_order.push_back(getIndex(start.first, start.second, cols));

    while (!open_set.empty()) {
        Node current_node = open_set.top();
        open_set.pop();
        Position current = current_node.position;

        if (closed_set[current])
            continue;

        int current_index = getIndex(current.first, current.second, cols);
        if (find(visited_order.begin(), visited_order.end(), current_index) == visited_order.end()) {
            visited_order.push_back(current_index);
        }

        closed_set[current] = true;

        if (current == end) {
            vector<Position> path = reconstructPath(came_from, start, end);
            for (auto [r, c] : path) {
                int idx = getIndex(r, c, cols);
                if (grid[idx] != 1)
                    grid[idx] = 3;
            }
            return {path, visited_order};
        }

        for (auto [neighbor, cost] : getNeighbors(grid, current, rows, cols)) {
            if (closed_set[neighbor])
                continue;

            int tentative_g = g_scores[current] + cost;

            if (!g_scores.count(neighbor) || tentative_g < g_scores[neighbor]) {
                came_from[neighbor] = current;
                g_scores[neighbor] = tentative_g;
                int h = heuristic(neighbor, end);
                f_scores[neighbor] = tentative_g + h;

                open_set.push({neighbor, tentative_g + h, tentative_g});

                int idx = getIndex(neighbor.first, neighbor.second, cols);
                if (grid[idx] == 0)
                    grid[idx] = 2;
            }
        }
    }

    for (int idx : visited_order) {
        if (grid[idx] == 0)
            grid[idx] = 2;
    }

    return {nullopt, visited_order};
}

vector<int> getPathIndexes(const vector<Position>& path, int cols) {
    vector<int> indexes;
    for (auto [r, c] : path)
        indexes.push_back(getIndex(r, c, cols));
    return indexes;
}

tuple<vector<int>, vector<int>, vector<int>> findShortestPath(
    vector<int> grid, int start_row, int start_col, int end_row, int end_col, int rows, int cols
) {
    Position start = {start_row, start_col};
    Position end = {end_row, end_col};

    auto [opt_path, visited_order] = astarGrid(grid, start, end, rows, cols);

    vector<int> path_indexes;
    if (opt_path)
        path_indexes = getPathIndexes(opt_path.value(), cols);

    return {grid, visited_order, path_indexes};
}
