#include <vector>
#include <map>
#include <set>
#include <optional>

using namespace std;

using Position = pair<int, int>;

int getIndex(int row, int col, int cols) {
    return row * cols + col;
}

bool isWall(const vector<int>& grid, int row, int col, int cols) {
    int index = getIndex(row, col, cols);
    return grid[index] == 1;
}

map<Position, map<Position, int>> buildGraphFromGrid(
    const vector<int>& grid, int rows, int cols
) {
    map<Position, map<Position, int>> graph;
    vector<pair<int, int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    for (int row = 0; row < rows; ++row) {
        for (int col = 0; col < cols; ++col) {
            if (isWall(grid, row, col, cols)) continue;

            Position pos = {row, col};
            graph[pos] = {};

            for (auto [dx, dy] : directions) {
                int newRow = row + dy;
                int newCol = col + dx;

                if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
                if (isWall(grid, newRow, newCol, cols)) continue;

                graph[pos][{newRow, newCol}] = 1;
            }
        }
    }

    return graph;
}

vector<Position> reconstructPath(
    const map<Position, optional<pair<Position, int>>>& paths,
    Position start, Position end
) {
    vector<Position> path;
    Position current = end;

    while (current != start) {
        path.push_back(current);
        if (paths.at(current)) {
            current = paths.at(current).value().first;
        } else {
            break;
        }
    }

    path.push_back(start);
    reverse(path.begin(), path.end());
    return path;
}

pair<map<Position, optional<pair<Position, int>>>, vector<int>> bellmanFordWithVisitOrder(
    const map<Position, map<Position, int>>& graph,
    Position start, Position end, int cols
) {
    map<Position, optional<pair<Position, int>>> ans;
    set<Position> visited;
    vector<int> visitedOrder;

    ans[start] = nullopt;
    visited.insert(start);
    visitedOrder.push_back(getIndex(start.first, start.second, cols));

    if (graph.find(start) == graph.end()) return {ans, visitedOrder};

    for (const auto& [neighbor, weight] : graph.at(start)) {
        ans[neighbor] = make_pair(start, weight);
        if (visited.insert(neighbor).second) {
            visitedOrder.push_back(getIndex(neighbor.first, neighbor.second, cols));
        }
        if (neighbor == end) return {ans, visitedOrder};
    }

    for (size_t i = 1; i < graph.size(); ++i) {
        bool updated = false;
        for (const auto& [u, edges] : graph) {
            if (!ans.count(u)) continue;

            int distU = ans[u] ? ans[u].value().second : 0;

            for (const auto& [v, weight] : edges) {
                int newDist = distU + weight;

                if (!ans.count(v) || (ans[v] && newDist < ans[v].value().second)) {
                    ans[v] = make_pair(u, newDist);
                    updated = true;

                    if (visited.insert(v).second) {
                        visitedOrder.push_back(getIndex(v.first, v.second, cols));
                    }

                    if (v == end) return {ans, visitedOrder};
                }
            }
        }
        if (!updated) break;
    }

    return {ans, visitedOrder};
}

tuple<vector<int>, vector<int>, vector<int>> findShortestPath(
    vector<int> grid,
    int startRow, int startCol,
    int endRow, int endCol,
    int rows, int cols
) {
    Position start = {startRow, startCol};
    Position end = {endRow, endCol};

    auto graph = buildGraphFromGrid(grid, rows, cols);
    auto [paths, visitedOrder] = bellmanFordWithVisitOrder(graph, start, end, cols);

    vector<int> pathIndexes;
    if (paths.count(end)) {
        auto path = reconstructPath(paths, start, end);
        for (auto [r, c] : path) {
            int idx = getIndex(r, c, cols);
            if (grid[idx] != 1) grid[idx] = 3;
            pathIndexes.push_back(idx);
        }
    }

    for (int index : visitedOrder) {
        if (grid[index] == 0) grid[index] = 2;
    }

    return {grid, visitedOrder, pathIndexes};
}
