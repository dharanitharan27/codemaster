
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";

const TwoPointers = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/learn">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learn
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Two Pointers</h1>
        <p className="text-xl text-gray-600">
          Efficiently solve array and string problems with multiple pointers
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Two Pointers Technique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Two pointers is a technique where we use two pointers to traverse through a data structure. 
                This approach can reduce time complexity from O(n²) to O(n) for many problems.
              </p>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Common Patterns:</h4>
                <ul className="space-y-1">
                  <li><strong>Opposite Direction:</strong> One pointer from start, one from end</li>
                  <li><strong>Same Direction:</strong> Both pointers move in same direction</li>
                  <li><strong>Fast & Slow:</strong> One pointer moves faster than the other</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Implementation Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Two Sum (Sorted Array):</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []  # No solution found

# Example usage
arr = [2, 7, 11, 15]
target = 9
print(two_sum_sorted(arr, target))  # Output: [0, 1]`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Remove Duplicates:</h4>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                    <pre>{`def remove_duplicates(arr):
    if not arr:
        return 0
    
    slow = 0
    for fast in range(1, len(arr)):
        if arr[fast] != arr[slow]:
            slow += 1
            arr[slow] = arr[fast]
    
    return slow + 1

# Floyd's Cycle Detection (Fast & Slow)
def has_cycle(head):
    if not head or not head.next:
        return False
    
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    
    return False`}</pre>
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
                  <h4 className="font-semibold">Two Sum</h4>
                  <p className="text-sm text-gray-600">Find pair that sums to target</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Easy</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Three Sum</h4>
                  <p className="text-sm text-gray-600">Find triplets that sum to zero</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Container With Most Water</h4>
                  <p className="text-sm text-gray-600">Find maximum area container</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Trapping Rain Water</h4>
                  <p className="text-sm text-gray-600">Calculate trapped rainwater</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Hard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>When to Use Two Pointers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  Array/string is sorted
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  Looking for pairs/triplets with specific sum
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  Need to compare elements at different positions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  Detecting cycles in linked lists
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  Palindrome checking
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
                  LeetCode 1 - Two Sum
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 15 - 3Sum
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 11 - Container With Most Water
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  LeetCode 42 - Trapping Rain Water
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TwoPointers;
