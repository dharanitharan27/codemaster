
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";

const DynamicProgramming = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/learn">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learn
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dynamic Programming</h1>
        <p className="text-xl text-gray-600">
          Solve complex problems by breaking them into simpler subproblems
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                What is Dynamic Programming?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Dynamic Programming is an optimization technique that solves complex problems by breaking them down 
                into simpler subproblems. It stores the results of subproblems to avoid redundant calculations.
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Key Principles:</h4>
                <ul className="space-y-1">
                  <li><strong>Optimal Substructure:</strong> Optimal solution contains optimal solutions of subproblems</li>
                  <li><strong>Overlapping Subproblems:</strong> Same subproblems are solved multiple times</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Implementation Approaches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Top-Down (Memoization):</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    
    if n <= 2:
        return 1
    
    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
    return memo[n]

# Using functools.lru_cache
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci_cache(n):
    if n <= 2:
        return 1
    return fibonacci_cache(n-1) + fibonacci_cache(n-2)`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Bottom-Up (Tabulation):</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def fibonacci_dp(n):
    if n <= 2:
        return 1
    
    dp = [0] * (n + 1)
    dp[1] = dp[2] = 1
    
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

# Space optimized version
def fibonacci_optimized(n):
    if n <= 2:
        return 1
    
    prev2, prev1 = 1, 1
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    
    return prev1`}</pre>
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
                Common DP Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Linear DP</h4>
                  <p className="text-sm text-gray-600">Fibonacci, House Robber, Climbing Stairs</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Easy</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">2D DP</h4>
                  <p className="text-sm text-gray-600">Unique Paths, Edit Distance, LCS</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Knapsack Problems</h4>
                  <p className="text-sm text-gray-600">0/1 Knapsack, Unbounded Knapsack</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Hard</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">DP on Trees</h4>
                  <p className="text-sm text-gray-600">Tree diameter, Binary tree cameras</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Hard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DP Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">1.</span>
                  Define the DP state/subproblem
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">2.</span>
                  Find the recurrence relation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">3.</span>
                  Determine base cases
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">4.</span>
                  Decide computation order
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">5.</span>
                  Optimize space if possible
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 70 - Climbing Stairs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 62 - Unique Paths
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 72 - Edit Distance
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 300 - Longest Increasing Subsequence
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DynamicProgramming;
