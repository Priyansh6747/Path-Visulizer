#include <vector>
#include <queue>
#include <tuple>

using namespace std;

using Position = pair<size_t, size_t>;

size_t get_index(size_t row, size_t col, size_t cols) {
    return row * cols + col;
}

bool is_wall(const vector<int>& grid, size_t row, size_t col, size_t cols) {
    size_t index = get_index(row, col, cols);
    return grid[index] == 1;
}

pair<vector<Position>, vector<size_t>> bfs(
    vector<int>& grid,
    Position start,
    Position end,
    size_t rows,
    size_t cols
) {
    vector<vector<int>> levels(rows, vector<int>(cols, -1));
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));
    vector<size_t> visited_order;

    int dx[4] = {1, -1, 0, 0};
    int dy[4] = {0, 0, 1, -1};

    queue<Position> q;
    q.push(start);
    visited[start.first][start.second] = true;
    levels[start.first][start.second] = 0;
    visited_order.push_back(get_index(start.first, start.second, cols));

    while (!q.empty() && !visited[end.first][end.second]) {
        auto [curr_x, curr_y] = q.front();
        q.pop();

        for (int i = 0; i < 4; ++i) {
            int new_x = static_cast<int>(curr_x) + dy[i];
            int new_y = static_cast<int>(curr_y) + dx[i];

            if (new_x < 0 || new_x >= static_cast<int>(rows) ||
                new_y < 0 || new_y >= static_cast<int>(cols)) {
                continue;
            }

            size_t nx = static_cast<size_t>(new_x);
            size_t ny = static_cast<size_t>(new_y);

            if (is_wall(grid, nx, ny, cols) || visited[nx][ny]) {
                continue;
            }

            visited[nx][ny] = true;
            levels[nx][ny] = levels[curr_x][curr_y] + 1;
            visited_order.push_back(get_index(nx, ny, cols));
            q.emplace(nx, ny);
        }
    }

    vector<Position> path;
    if (levels[end.first][end.second] != -1) {
        Position curr = end;
        path.push_back(curr);
        int curr_level = levels[curr.first][curr.second];

        while (curr != start) {
            for (int i = 0; i < 4; ++i) {
                int prev_x = static_cast<int>(curr.first) + dy[i];
                int prev_y = static_cast<int>(curr.second) + dx[i];

                if (prev_x < 0 || prev_x >= static_cast<int>(rows) ||
                    prev_y < 0 || prev_y >= static_cast<int>(cols)) {
                    continue;
                }

                size_t px = static_cast<size_t>(prev_x);
                size_t py = static_cast<size_t>(prev_y);

                if (visited[px][py] && levels[px][py] == curr_level - 1) {
                    curr = {px, py};
                    curr_level--;
                    path.push_back(curr);
                    break;
                }
            }
        }

        reverse(path.begin(), path.end());

        for (const auto& [r, c] : path) {
            size_t idx = get_index(r, c, cols);
            if (grid[idx] != 1) {
                grid[idx] = 3;
            }
        }
    }

    for (size_t idx : visited_order) {
        if (grid[idx] == 0) {
            grid[idx] = 2;
        }
    }

    return {path, visited_order};
}

vector<size_t> get_path_indexes(const vector<Position>& path, size_t cols) {
    vector<size_t> indexes;
    for (const auto& [row, col] : path) {
        indexes.push_back(get_index(row, col, cols));
    }
    return indexes;
}

tuple<vector<int>, vector<size_t>, vector<size_t>> find_shortest_path(
    vector<int> grid,
    size_t start_row,
    size_t start_col,
    size_t end_row,
    size_t end_col,
    size_t rows,
    size_t cols
) {
    Position start = {start_row, start_col};
    Position end = {end_row, end_col};

    auto [path, visited_order] = bfs(grid, start, end, rows, cols);
    vector<size_t> path_indexes = get_path_indexes(path, cols);

    return {grid, visited_order, path_indexes};
}
