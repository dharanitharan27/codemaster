
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";

const SlidingWindow = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/learn">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learn
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sliding Window</h1>
        <p className="text-xl text-gray-600">
          Master the technique for solving subarray and substring problems efficiently
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                What is Sliding Window?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Sliding window is a technique used to solve problems involving subarrays or substrings. 
                Instead of checking every possible subarray, we maintain a window that slides through the array.
              </p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Two Types:</h4>
                <ul className="space-y-1">
                  <li><strong>Fixed Size Window:</strong> Window size remains constant</li>
                  <li><strong>Variable Size Window:</strong> Window size changes based on conditions</li>
                </ul>
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
                  <h4 className="font-semibold mb-2">Fixed Size Sliding Window:</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def max_sum_subarray(arr, k):
    n = len(arr)
    if n < k:
        return -1
    
    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(n - k):
        window_sum = window_sum - arr[i] + arr[i + k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# Example usage
arr = [1, 4, 2, 9, 5, 10, 23]
k = 3
print(max_sum_subarray(arr, k))  # Output: 38 (5+10+23)`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Variable Size Sliding Window:</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def longest_subarray_with_sum_k(arr, k):
    left = 0
    current_sum = 0
    max_length = 0
    
    for right in range(len(arr)):
        current_sum += arr[right]
        
        # Shrink window if sum exceeds k
        while current_sum > k and left <= right:
            current_sum -= arr[left]
            left += 1
        
        # Update max_length if sum equals k
        if current_sum == k:
            max_length = max(max_length, right - left + 1)
    
    return max_length

# Example usage
arr = [1, 2, 3, 7, 5]
k = 12
print(longest_subarray_with_sum_k(arr, k))  # Output: 2 (7+5)`}</pre>
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
                    <li>Fixed Window: O(n)</li>
                    <li>Variable Window: O(n)</li>
                    <li>With HashMap: O(n)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Space Complexity</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>Basic: O(1)</li>
                    <li>With HashMap: O(k) where k is window size</li>
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
                  <h4 className="font-semibold">Maximum Sum Subarray of Size K</h4>
                  <p className="text-sm text-gray-600">Find max sum of k consecutive elements</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Easy</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Longest Substring Without Repeating</h4>
                  <p className="text-sm text-gray-600">Find longest substring with unique characters</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Minimum Window Substring</h4>
                  <p className="text-sm text-gray-600">Find minimum window containing all characters</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Hard</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Sliding Window Maximum</h4>
                  <p className="text-sm text-gray-600">Find maximum in every window of size k</p>
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
                  <span className="text-purple-600">•</span>
                  Use HashMap to track character frequencies in substring problems
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  For maximum/minimum in sliding window, consider using deque
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  Always validate window conditions before expanding
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  Practice both fixed and variable size window problems
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
                  LeetCode 3 - Longest Substring Without Repeating
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 76 - Minimum Window Substring
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 239 - Sliding Window Maximum
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 424 - Longest Repeating Character Replacement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SlidingWindow;
