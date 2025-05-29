import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, TrendingUp, Target, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import mermaid from 'mermaid';

const Flowchart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mermaidSvg, setMermaidSvg] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });

    const flowchartCode = `
      flowchart TD
      Start[Start Here] --> A[Is it a graph?]
      A -->|Yes| B[Is it a tree?]
      B -->|Yes| C[DFS]
      B -->|No| D[Is it related to Directed Acyclic Graphs?]
      D -->|Yes| E[Topological Sort]
      D -->|No| F[Is it related to Shortest paths?]
      F -->|Yes| G[Weighted graph?]
      G -->|Yes| H[Dijkstra]
      G -->|No| I[BFS]
      F -->|No| J[Connectivity involved?]
      J -->|Yes| K[Disjoint Set Union]
      J -->|No| L[Small constraints?]
      L -->|Yes| M[DFS / Backtracking]
      L -->|No| N[BFS]

      A -->|No| A0[Need to solve for Kth smallest/largest?]
      A0 -->|Yes| A0a[Sorting / Heaps]
      A0 -->|No| A1[Involves Linked Lists?]
      A1 -->|Yes| A2[Two pointers]
      A1 -->|No| A3[Small constraint bounds?]
      A3 -->|Yes| A4[Is brute force fast enough?]
      A4 -->|Yes| A5[Brute force / Backtracking]
      A4 -->|No| A6[Dynamic Programming]

      A3 -->|No| A7[Deals with sums or additive?]
      A7 -->|Yes| A7a[Prefix Sums]
      A7 -->|NO| A8[About subarrays or substrings?]
      A8 -->|Yes| A9[Sliding Window]
      A8 -->|No| A11[Calculating max/min of something?]

      A11 -->|Yes| A12[Monotonic condition?]
      A12 -->|Yes| A13[Binary Search]
      A12 -->|No| A14[Can split into sub-problems?]
      A14 -->|Yes| A15[Dynamic Programming]
      A14 -->|No| A19[Greedily calculate answer?]
      A19 -->|Yes| A20[Greedy Algorithms]

      A11 -->|No| A16[Asking for number of ways?]
      A16 -->|Yes| A16a[Is brute force fast enough?]
      A16a -->|Yes| A16b[Brute Force / Backtracking]
      A16a -->|No| A16c[Dynamic Programming]

      A16 -->|No| A24[Multiple sequences?]
      A24 -->|Yes| A25[Monotonic conditions?]
      A25 -->|Yes| A26[Two pointers]
      A25 -->|No| A27[Can split into sub-problems?]
      A27 -->|Yes| A28[Dynamic Programming]
      A24 -->|No| A34[Find or enumerate indices?]
      A34 -->|Yes| A35[Monotonic Condition?]
      A35 -->|Yes| A36[Two pointers]

      A34 -->|No| A38[O of 1 memory required?]
      A38 -->|Yes| A39[Involves monotonic condition?]
      A39 -->|Yes| A40[Two pointers]
      A38 -->|No| A41[Do you need to parse symbols?]
      A41 -->|Yes| A42[Stack]
    `;

    mermaid.render('flowchart', flowchartCode).then(({ svg }) => {
      setMermaidSvg(svg);
    });
  }, []);

  const flowSteps = [
    {
      title: "Start Your Journey",
      description: "Create your account and set up your profile",
      icon: "👋",
      completed: !!user
    },
    {
      title: "Daily Practice",
      description: "Add daily coding tasks and track your progress",
      icon: "📝",
      action: () => navigate('/daily')
    },
    {
      title: "Track Ratings",
      description: "Monitor your ratings across different platforms",
      icon: "📊",
      action: () => navigate('/rating')
    },
    {
      title: "Learn Concepts",
      description: "Master data structures and algorithms",
      icon: "🧠",
      action: () => navigate('/learn')
    },
    {
      title: "View Analytics",
      description: "Analyze your progress with detailed charts",
      icon: "📈",
      action: () => navigate('/daily')
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Learning Path</h1>
        <p className="text-xl text-gray-600">
          Follow this structured approach to master competitive programming
        </p>
      </div>

      {/* Mermaid Flowchart */}
      <div className="mb-12 overflow-x-auto">
        <div className="min-w-[800px]">
          <div dangerouslySetInnerHTML={{ __html: mermaidSvg }} />
        </div>
      </div>

      {/* Flowchart Description */}
      <div className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding the Algorithm Selection Flowchart</h2>
        <div className="space-y-4 text-gray-700">
          <p className="leading-relaxed">
            This comprehensive flowchart serves as your strategic guide for selecting the most appropriate algorithm for any competitive programming problem. It starts with fundamental questions about the problem's nature and branches into specific algorithmic approaches.
          </p>
          <p className="leading-relaxed">
            The left branch focuses on graph-related problems, helping you choose between DFS, BFS, Dijkstra's algorithm, and other graph-specific solutions. The right branch guides you through array, string, and sequence-based problems, suggesting optimal approaches like two pointers, sliding window, or dynamic programming.
          </p>
          <p className="leading-relaxed">
            Each decision point is carefully designed to consider problem constraints, data structures involved, and the most efficient solution patterns. This systematic approach helps you make informed decisions about which algorithm to implement, saving valuable time during competitions.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {flowSteps.map((step, index) => (
          <div key={index} className="relative">
            <Card className={`mb-6 transition-all duration-300 hover:shadow-lg ${
              step.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{step.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {step.completed && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                    {step.action && (
                      <Button onClick={step.action} variant="outline">
                        Go
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {index < flowSteps.length - 1 && (
              <div className="flex justify-center mb-4">
                <ArrowDown className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Your Progress</div>
            <p className="text-xs text-muted-foreground">
              Track your daily achievements
            </p>
            <Button 
              className="mt-3 w-full" 
              onClick={() => navigate('/daily')}
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Ratings</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Multi-Platform</div>
            <p className="text-xs text-muted-foreground">
              Track across all coding platforms
            </p>
            <Button 
              className="mt-3 w-full" 
              onClick={() => navigate('/rating')}
            >
              Manage Ratings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Path</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Structured</div>
            <p className="text-xs text-muted-foreground">
              Learn concepts systematically
            </p>
            <Button 
              className="mt-3 w-full" 
              onClick={() => navigate('/learn')}
            >
              Start Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Flowchart;
