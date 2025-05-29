
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";

const PrefixSum = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/learn">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learn
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Prefix Sum</h1>
        <p className="text-xl text-gray-600">
          Learn how to efficiently calculate range sums and solve array problems
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                What is Prefix Sum?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Prefix sum is a technique used to efficiently calculate the sum of elements in a subarray. 
                Instead of calculating the sum every time from scratch, we precompute cumulative sums.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Key Concept:</h4>
                <p>
                  For an array [a₀, a₁, a₂, ..., aₙ], the prefix sum array is [a₀, a₀+a₁, a₀+a₁+a₂, ..., sum of all elements]
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Prefix Sum:</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def build_prefix_sum(arr):
    prefix = [0] * (len(arr) + 1)
    for i in range(len(arr)):
        prefix[i + 1] = prefix[i] + arr[i]
    return prefix

def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]

# Example usage
arr = [1, 2, 3, 4, 5]
prefix = build_prefix_sum(arr)
print(range_sum(prefix, 1, 3))  # Sum from index 1 to 3: 2+3+4 = 9`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2D Prefix Sum:</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def build_2d_prefix(matrix):
    rows, cols = len(matrix), len(matrix[0])
    prefix = [[0] * (cols + 1) for _ in range(rows + 1)]
    
    for i in range(1, rows + 1):
        for j in range(1, cols + 1):
            prefix[i][j] = matrix[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]
    
    return prefix

def rectangle_sum(prefix, r1, c1, r2, c2):
    return prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time & Space Complexity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Time Complexity</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>Preprocessing: O(n)</li>
                    <li>Range Query: O(1)</li>
                    <li>2D Preprocessing: O(n×m)</li>
                    <li>2D Range Query: O(1)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Space Complexity</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>1D Prefix Sum: O(n)</li>
                    <li>2D Prefix Sum: O(n×m)</li>
                  </ul>
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
                  <h4 className="font-semibold">Range Sum Query</h4>
                  <p className="text-sm text-gray-600">Calculate sum of elements between indices i and j</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Easy</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Subarray Sum Equals K</h4>
                  <p className="text-sm text-gray-600">Find number of subarrays with sum equal to k</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Range Sum Query 2D</h4>
                  <p className="text-sm text-gray-600">Calculate sum of rectangle in 2D matrix</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Maximum Size Subarray Sum Equals k</h4>
                  <p className="text-sm text-gray-600">Find longest subarray with sum equal to k</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Hard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  Use HashMap with prefix sums to solve subarray problems
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  For 2D problems, think about row-wise and column-wise prefix sums
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  Remember to handle negative numbers carefully
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  Consider using difference arrays for range updates
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 303 - Range Sum Query
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 560 - Subarray Sum Equals K
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 304 - Range Sum Query 2D
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Codeforces - Little Girl and Maximum Sum
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrefixSum;
