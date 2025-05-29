
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Premium = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Basic algorithm flowchart",
        "5 daily tasks",
        "Basic progress tracking",
        "Community support"
      ],
      popular: false,
      buttonText: "Current Plan",
      disabled: true
    },
    {
      name: "Pro",
      price: "₹299",
      period: "month",
      description: "Best for serious learners",
      features: [
        "Advanced algorithm flowchart",
        "Unlimited daily tasks",
        "Detailed analytics",
        "Friends comparison",
        "Platform rating sync",
        "Priority support",
        "Advanced learning paths"
      ],
      popular: true,
      buttonText: "Upgrade to Pro",
      disabled: false
    },
    {
      name: "Premium",
      price: "₹499",
      period: "month",
      description: "For competitive programmers",
      features: [
        "Everything in Pro",
        "AI-powered recommendations",
        "Contest predictions",
        "Advanced friend features",
        "Custom study plans",
        "1-on-1 mentoring sessions",
        "Interview preparation",
        "Priority platform updates"
      ],
      popular: false,
      buttonText: "Upgrade to Premium",
      disabled: false
    }
  ];

  const handleSubscribe = async (planName: string, price: string) => {
    setLoading(true);
    try {
      // Here you would integrate with Razorpay
      // For now, we'll show a toast
      toast({
        title: "Payment Integration",
        description: `Redirecting to Razorpay for ${planName} plan (${price}/month)`,
      });
      
      // Simulate payment process
      setTimeout(() => {
        toast({
          title: "Payment Successful!",
          description: `Welcome to ${planName}! Your subscription is now active.`,
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment failed. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unlock powerful features to accelerate your competitive programming journey
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">
                  <Star className="h-4 w-4 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-8">
              <div className="mb-4">
                {plan.name === "Free" && <Zap className="h-12 w-12 text-gray-500 mx-auto" />}
                {plan.name === "Pro" && <Crown className="h-12 w-12 text-blue-500 mx-auto" />}
                {plan.name === "Premium" && <Star className="h-12 w-12 text-purple-500 mx-auto" />}
              </div>
              
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full ${plan.popular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                variant={plan.disabled ? "outline" : "default"}
                disabled={plan.disabled || loading}
                onClick={() => handleSubscribe(plan.name, plan.price)}
              >
                {loading ? "Processing..." : plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Premium?</h2>
          <p className="text-xl text-gray-600">
            Take your competitive programming to the next level
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">AI Recommendations</h3>
            <p className="text-sm text-gray-600">
              Get personalized problem recommendations based on your performance
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Crown className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-sm text-gray-600">
              Deep insights into your coding patterns and improvement areas
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Contest Predictions</h3>
            <p className="text-sm text-gray-600">
              AI-powered predictions for upcoming contest performance
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Check className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-2">Priority Support</h3>
            <p className="text-sm text-gray-600">
              Get help when you need it with priority customer support
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          All plans include a 7-day free trial. Cancel anytime.
        </p>
        <p className="text-sm text-gray-500">
          Payments are processed securely through Razorpay. Your data is protected with bank-level security.
        </p>
      </div>
    </div>
  );
};

export default Premium;
