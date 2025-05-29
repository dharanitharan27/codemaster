
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";

const BinarySearch = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/learn">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learn
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Binary Search</h1>
        <p className="text-xl text-gray-600">
          Master the art of searching and optimization problems
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Binary Search Fundamentals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Binary search is a divide-and-conquer algorithm that efficiently searches for a target value 
                in a sorted array by repeatedly dividing the search space in half.
              </p>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Key Requirements:</h4>
                <ul className="space-y-1">
                  <li><strong>Sorted Data:</strong> Array must be sorted</li>
                  <li><strong>Random Access:</strong> Must be able to access middle element</li>
                  <li><strong>Monotonic Property:</strong> Search space must have monotonic property</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Implementation Variants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Standard Binary Search:</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Target not found

# Recursive version
def binary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid = left + (right - left) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Binary Search on Answer:</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def binary_search_answer(check_function, min_val, max_val):
    """Generic binary search on answer space"""
    left, right = min_val, max_val
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if check_function(mid):
            result = mid
            right = mid - 1  # Look for smaller valid answer
        else:
            left = mid + 1
    
    return result

# Example: Find square root
def sqrt_binary_search(x):
    if x < 2:
        return x
    
    left, right = 1, x // 2
    
    while left <= right:
        mid = left + (right - left) // 2
        square = mid * mid
        
        if square == x:
            return mid
        elif square < x:
            left = mid + 1
        else:
            right = mid - 1
    
    return right  # Floor of square root`}</pre>
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
                Binary Search Variants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Find First/Last Occurrence</h4>
                  <p className="text-sm text-gray-600">Find leftmost or rightmost target</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Easy</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Search in Rotated Array</h4>
                  <p className="text-sm text-gray-600">Binary search in rotated sorted array</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Peak Element</h4>
                  <p className="text-sm text-gray-600">Find peak element in array</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Median of Two Sorted Arrays</h4>
                  <p className="text-sm text-gray-600">Find median using binary search</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Hard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time & Space Complexity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Time Complexity</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>Best Case: O(1)</li>
                    <li>Average Case: O(log n)</li>
                    <li>Worst Case: O(log n)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Space Complexity</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>Iterative: O(1)</li>
                    <li>Recursive: O(log n)</li>
                  </ul>
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
                  LeetCode 704 - Binary Search
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 33 - Search in Rotated Sorted Array
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 162 - Find Peak Element
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 4 - Median of Two Sorted Arrays
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BinarySearch;
