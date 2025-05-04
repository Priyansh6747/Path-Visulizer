#include <vector>
#include <stack>
#include <tuple>
#include <utility>

using namespace std;

using Position = pair<size_t, size_t>;

size_t get_index(size_t row, size_t col, size_t cols) {
    return row * cols + col;
}

bool is_wall(const vector<int>& grid, size_t row, size_t col, size_t cols) {
    return grid[get_index(row, col, cols)] == 1;
}

bool is_valid(int row, int col, size_t rows, size_t cols, const vector<vector<bool>>& visited) {
    if (row < 0 || col < 0 || row >= (int)rows || col >= (int)cols)
        return false;
    if (visited[row][col])
        return false;
    return true;
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

    vector<vector<bool>> visited(rows, vector<bool>(cols, false));
    vector<vector<optional<Position>>> parent(rows, vector<optional<Position>>(cols, nullopt));
    vector<size_t> visited_order;

    int dx[4] = {0, 0, -1, 1};
    int dy[4] = {-1, 1, 0, 0};

    stack<Position> stk;
    stk.push(start);
    bool found_end = false;

    while (!stk.empty()) {
        auto [row, col] = stk.top();
        stk.pop();

        if (visited[row][col])
            continue;

        visited[row][col] = true;
        visited_order.push_back(get_index(row, col, cols));

        if (make_pair(row, col) == end) {
            found_end = true;
            break;
        }

        for (int i = 3; i >= 0; --i) {
            int adj_row = (int)row + dy[i];
            int adj_col = (int)col + dx[i];

            if (is_valid(adj_row, adj_col, rows, cols, visited)) {
                size_t arow = adj_row, acol = adj_col;
                if (is_wall(grid, arow, acol, cols))
                    continue;

                parent[arow][acol] = {row, col};
                stk.push({arow, acol});
            }
        }
    }

    vector<Position> path;
    if (found_end) {
        Position current = end;
        while (current != start) {
            path.push_back(current);
            if (parent[current.first][current.second])
                current = *parent[current.first][current.second];
            else
                break;
        }
        path.push_back(start);
        reverse(path.begin(), path.end());

        for (const auto& [r, c] : path) {
            size_t idx = get_index(r, c, cols);
            if (grid[idx] != 1)
                grid[idx] = 3;
        }
    }

    for (size_t idx : visited_order) {
        if (grid[idx] == 0)
            grid[idx] = 2;
    }

    vector<size_t> path_indexes;
    for (const auto& [r, c] : path) {
        path_indexes.push_back(get_index(r, c, cols));
    }

    return {grid, visited_order, path_indexes};
}
