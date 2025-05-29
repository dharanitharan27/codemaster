
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Star, Crown, BarChart3, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  const features = [
    {
      title: "Interactive Flowchart",
      description: "Navigate through coding concepts with our interactive learning flowchart",
      icon: <Target className="h-8 w-8 text-blue-600" />,
      link: "/flowchart",
      color: "bg-blue-50 hover:bg-blue-100"
    },
    {
      title: "Learn Algorithms",
      description: "Master data structures and algorithms step by step",
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      link: "/learn",
      color: "bg-green-50 hover:bg-green-100"
    },
    {
      title: "Daily Practice",
      description: "Solve coding problems and track your daily progress",
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      link: "/daily",
      color: "bg-purple-50 hover:bg-purple-100"
    },
    {
      title: "Track Your Rating",
      description: "Monitor your coding skills and see your improvement over time",
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      link: "/rating",
      color: "bg-orange-50 hover:bg-orange-100"
    },
    {
      title: "Premium Features",
      description: "Unlock advanced features and personalized learning paths",
      icon: <Crown className="h-8 w-8 text-yellow-600" />,
      link: "/premium",
      color: "bg-yellow-50 hover:bg-yellow-100"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to continue your coding journey? Choose what you'd like to work on today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Link key={index} to={feature.link}>
            <Card className={`h-full transition-all duration-200 ${feature.color} border-2 hover:border-gray-300 hover:shadow-lg`}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to level up? 🚀</h2>
            <p className="text-blue-100 mb-4">
              Start with our interactive flowchart to find the perfect learning path for you.
            </p>
            <Link 
              to="/flowchart" 
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Target className="h-5 w-5 mr-2" />
              Start Learning
            </Link>
          </div>
          <div className="hidden md:block">
            <Star className="h-24 w-24 text-yellow-300 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
