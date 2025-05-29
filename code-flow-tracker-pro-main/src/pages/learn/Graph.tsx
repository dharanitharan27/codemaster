
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Graph = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/learn">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learn
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Graph Algorithms</h1>
        <p className="text-xl text-gray-600">
          Explore DFS, BFS, shortest paths, and advanced graph techniques
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Graph Fundamentals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                A graph is a collection of vertices (nodes) connected by edges. Graphs can be directed or undirected, 
                weighted or unweighted, and are fundamental to many algorithmic problems.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Graph Representations:</h4>
                <ul className="space-y-1">
                  <li><strong>Adjacency List:</strong> More space efficient for sparse graphs</li>
                  <li><strong>Adjacency Matrix:</strong> Better for dense graphs and edge queries</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Core Algorithms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Depth-First Search (DFS):</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start)  # Process node
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    
    return visited

# Iterative DFS
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            print(node)  # Process node
            stack.extend(graph[node])`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Breadth-First Search (BFS):</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        node = queue.popleft()
        print(node)  # Process node
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

# BFS for shortest path
def bfs_shortest_path(graph, start, goal):
    queue = deque([(start, [start])])
    visited = set([start])
    
    while queue:
        node, path = queue.popleft()
        
        if node == goal:
            return path
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Common Problems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Connected Components</h4>
                  <p className="text-sm text-gray-600">Find all connected components in a graph</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Easy</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Shortest Path (Unweighted)</h4>
                  <p className="text-sm text-gray-600">Find shortest path using BFS</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Topological Sort</h4>
                  <p className="text-sm text-gray-600">Linear ordering of vertices in DAG</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Dijkstra's Algorithm</h4>
                  <p className="text-sm text-gray-600">Shortest path in weighted graphs</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Hard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Algorithm Complexities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-2 bg-blue-50 rounded">
                  <strong>DFS/BFS:</strong> O(V + E)
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <strong>Dijkstra:</strong> O((V + E) log V)
                </div>
                <div className="p-2 bg-yellow-50 rounded">
                  <strong>Floyd-Warshall:</strong> O(V³)
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <strong>Topological Sort:</strong> O(V + E)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 200 - Number of Islands
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 207 - Course Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 743 - Network Delay Time
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Codeforces - Graph Problems
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Graph;
