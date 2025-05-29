
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Search, Shuffle, Layers, Binary } from "lucide-react";

const Learn = () => {
  const topics = [
    {
      title: "Prefix Sum",
      description: "Learn how to efficiently calculate range sums and solve array problems",
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      link: "/learn/prefix-sum",
      difficulty: "Beginner",
      color: "bg-green-100 text-green-800"
    },
    {
      title: "Sliding Window",
      description: "Master the technique for solving subarray and substring problems",
      icon: <Shuffle className="h-8 w-8 text-purple-600" />,
      link: "/learn/sliding-window",
      difficulty: "Intermediate",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      title: "Graph Algorithms",
      description: "Explore DFS, BFS, shortest paths, and advanced graph techniques",
      icon: <Layers className="h-8 w-8 text-green-600" />,
      link: "/learn/graph",
      difficulty: "Advanced",
      color: "bg-red-100 text-red-800"
    },
    {
      title: "Dynamic Programming",
      description: "Solve complex problems by breaking them into simpler subproblems",
      icon: <BookOpen className="h-8 w-8 text-red-600" />,
      link: "/learn/dynamic-programming",
      difficulty: "Advanced",
      color: "bg-red-100 text-red-800"
    },
    {
      title: "Two Pointers",
      description: "Efficiently solve array and string problems with multiple pointers",
      icon: <Search className="h-8 w-8 text-orange-600" />,
      link: "/learn/two-pointers",
      difficulty: "Intermediate",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      title: "Binary Search",
      description: "Master the art of searching and optimization problems",
      icon: <Binary className="h-8 w-8 text-pink-600" />,
      link: "/learn/binary-search",
      difficulty: "Intermediate",
      color: "bg-yellow-100 text-yellow-800"
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Learn Algorithms & Data Structures</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master the fundamental concepts with our comprehensive tutorials and interactive examples
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                {topic.icon}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${topic.color}`}>
                  {topic.difficulty}
                </span>
              </div>
              <CardTitle className="text-xl">{topic.title}</CardTitle>
              <CardDescription className="text-gray-600">
                {topic.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={topic.link}>
                <Button className="w-full">
                  Start Learning
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Learning Path Recommendation</h2>
        <p className="text-center text-gray-600 mb-6">
          New to competitive programming? Follow our recommended learning order:
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">1. Two Pointers</div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">2. Prefix Sum</div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">3. Sliding Window</div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">4. Binary Search</div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">5. Graph Algorithms</div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">6. Dynamic Programming</div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
