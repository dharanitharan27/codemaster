
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, BookOpen, Target, TrendingUp, Users, CheckCircle } from "lucide-react";
import Dashboard from "./Dashboard";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard />;
  }

  // If user is not authenticated, show landing page
  const features = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Interactive Learning Path",
      description: "Follow our guided flowchart to master programming concepts step by step"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      title: "Comprehensive Curriculum",
      description: "Learn algorithms, data structures, and problem-solving techniques"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Track Your Progress",
      description: "Monitor your improvement with detailed analytics and rating system"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Daily Challenges",
      description: "Practice with carefully curated problems to sharpen your skills"
    }
  ];

  const benefits = [
    "🎯 Personalized learning paths",
    "📊 Progress tracking and analytics",
    "💡 Interactive problem solving",
    "🏆 Achievement system",
    "📱 Mobile-friendly interface",
    "🎓 Expert-designed curriculum"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Code className="h-16 w-16 text-blue-200" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Master Coding with <span className="text-blue-200">CodeMaster</span>
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Transform your programming skills with our interactive learning platform. 
            From beginner to expert, we'll guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                Start Learning Today
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose CodeMaster?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform combines proven learning methods with cutting-edge technology 
              to help you become a better programmer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-gray-600 mb-8">
                CodeMaster provides a complete learning ecosystem designed to take you 
                from where you are to where you want to be in your programming journey.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="text-center">
                <Code className="h-20 w-20 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of learners who have transformed their coding skills with CodeMaster.
                </p>
                <Link to="/signup">
                  <Button size="lg" className="w-full">
                    Create Your Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Coding Journey Today
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our community and unlock your programming potential
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
