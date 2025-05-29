
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Flowchart from "./pages/Flowchart";
import Learn from "./pages/Learn";
import DailyWork from "./pages/DailyWork";
import Rating from "./pages/Rating";
import Premium from "./pages/Premium";
import Admin from "./pages/Admin";
import PrefixSum from "./pages/learn/PrefixSum";
import SlidingWindow from "./pages/learn/SlidingWindow";
import Graph from "./pages/learn/Graph";
import DynamicProgramming from "./pages/learn/DynamicProgramming";
import TwoPointers from "./pages/learn/TwoPointers";
import BinarySearch from "./pages/learn/BinarySearch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/flowchart" element={<ProtectedRoute><Flowchart /></ProtectedRoute>} />
              <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
              <Route path="/learn/prefix-sum" element={<ProtectedRoute><PrefixSum /></ProtectedRoute>} />
              <Route path="/learn/sliding-window" element={<ProtectedRoute><SlidingWindow /></ProtectedRoute>} />
              <Route path="/learn/graph" element={<ProtectedRoute><Graph /></ProtectedRoute>} />
              <Route path="/learn/dynamic-programming" element={<ProtectedRoute><DynamicProgramming /></ProtectedRoute>} />
              <Route path="/learn/two-pointers" element={<ProtectedRoute><TwoPointers /></ProtectedRoute>} />
              <Route path="/learn/binary-search" element={<ProtectedRoute><BinarySearch /></ProtectedRoute>} />
              <Route path="/daily" element={<ProtectedRoute><DailyWork /></ProtectedRoute>} />
              <Route path="/rating" element={<ProtectedRoute><Rating /></ProtectedRoute>} />
              <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
