import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Graph = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* DFS Section */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">Depth First Search (DFS)</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
{`// C++ DFS using vector and visited array
void dfs(vector<vector<int>>& head, vector<bool>& visited, int start, vector<string>& names) {
    visited[start] = true;
    cout << names[start] << " ";
    for (int i : head[start]) {
        if (!visited[i])
            dfs(head, visited, i, names);
    }
}`}
          </pre>
          <p className="mt-2 text-sm font-mono">
            <strong>Input:</strong> names = ["A", "B", "C", "D"], edges = [(0,1), (0,2), (1,3)], start = 0<br />
            <strong>Output:</strong> A B D C
          </p>
        </CardContent>
      </Card>

      {/* BFS Section */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">Breadth First Search (BFS)</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
{`// C++ BFS using map and queue
void bfs(map<string, vector<string>>& graph, string start) {
    map<string, bool> visited;
    queue<string> q;
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        string node = q.front(); q.pop();
        cout << node << " ";
        for (auto& neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`}
          </pre>
          <p className="mt-2 text-sm font-mono">
            <strong>Input:</strong> graph = {"{A: [B, C], B: [D], C: [], D: []}"}, start = "A"<br />
            <strong>Output:</strong> A B C D
          </p>
        </CardContent>
      </Card>

      {/* Topological Sort Section */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">Topological Sort (DFS-based)</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
{`// C++ TopoSort using DFS and stack
void dfsTopo(int node, vector<vector<int>>& graph, vector<bool>& visited, stack<int>& st) {
    visited[node] = true;
    for (int adj : graph[node]) {
        if (!visited[adj])
            dfsTopo(adj, graph, visited, st);
    }
    st.push(node);
}

vector<int> topoSort(int n, vector<vector<int>>& graph) {
    vector<bool> visited(n, false);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        if (!visited[i])
            dfsTopo(i, graph, visited, st);
    }
    vector<int> res;
    while (!st.empty()) {
        res.push_back(st.top());
        st.pop();
    }
    return res;
}`}
          </pre>
          <p className="mt-2 text-sm font-mono">
            <strong>Input:</strong> n = 6, edges = [(5,2),(5,0),(4,0),(4,1),(2,3),(3,1)]<br />
            <strong>Output:</strong> 4 5 2 3 1 0 (One possible order)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Graph;
