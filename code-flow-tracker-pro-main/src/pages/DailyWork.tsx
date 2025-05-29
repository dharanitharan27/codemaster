import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, TrendingUp, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar
} from "recharts";

interface DailyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  platform: string;
  difficulty: string;
}

interface ProgressData {
  date: string;
  completed: number;
  total: number;
  completionRate: number;
}

const DailyWork = () => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [weeklyData, setWeeklyData] = useState<ProgressData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ProgressData[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    platform: "LeetCode",
    difficulty: "Easy"
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      generateProgressData();
    }
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTasks((data as any) || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const generateProgressData = () => {
    const today = new Date();
    
    // Generate weekly data (last 7 days)
    const weeklyProgress: ProgressData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTasks = tasks.filter(task => task.date === dateStr);
      const completed = dayTasks.filter(task => task.completed).length;
      const total = dayTasks.length;
      
      weeklyProgress.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed,
        total,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
    setWeeklyData(weeklyProgress);

    // Generate monthly data (last 30 days)
    const monthlyProgress: ProgressData[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTasks = tasks.filter(task => task.date === dateStr);
      const completed = dayTasks.filter(task => task.completed).length;
      const total = dayTasks.length;
      
      monthlyProgress.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed,
        total,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
    setMonthlyData(monthlyProgress);
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      const taskData = {
        ...newTask,
        user_id: user?.id,
        date: new Date().toISOString().split('T')[0],
        completed: false
      };

      const { error } = await supabase
        .from('daily_tasks')
        .insert([taskData as any]);

      if (error) throw error;

      toast({
        title: "Task added!",
        description: "Your daily task has been added successfully.",
      });

      setNewTask({
        title: "",
        description: "",
        platform: "LeetCode",
        difficulty: "Easy"
      });

      fetchTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .update({ completed: !completed } as any)
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !completed } : task
      ));

      toast({
        title: completed ? "Task uncompleted" : "Task completed!",
        description: completed ? "Task marked as incomplete" : "Great job on completing this task!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = tasks.filter(task => {
      const taskDate = new Date(task.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return taskDate >= weekAgo;
    });

    const thisMonth = tasks.filter(task => {
      const taskDate = new Date(task.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return taskDate >= monthAgo;
    });

    return {
      today: tasks.filter(task => task.date === today && task.completed).length,
      week: thisWeek.filter(task => task.completed).length,
      month: thisMonth.filter(task => task.completed).length,
      totalWeek: thisWeek.length,
      totalMonth: thisMonth.length,
      weeklyRate: thisWeek.length > 0 ? Math.round((thisWeek.filter(task => task.completed).length / thisWeek.length) * 100) : 0,
      monthlyRate: thisMonth.length > 0 ? Math.round((thisMonth.filter(task => task.completed).length / thisMonth.length) * 100) : 0
    };
  };

  const stats = getStats();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Daily Work & Analytics</h1>
        <p className="text-xl text-gray-600">
          Track your daily coding practice and analyze your progress with detailed insights
        </p>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="add">Add Task</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.today}</div>
                <p className="text-xs text-muted-foreground">tasks completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.week}/{stats.totalWeek}</div>
                <p className="text-xs text-muted-foreground">{stats.weeklyRate}% completion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.month}/{stats.totalMonth}</div>
                <p className="text-xs text-muted-foreground">{stats.monthlyRate}% completion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {weeklyData.filter(day => day.completed > 0).length}
                </div>
                <p className="text-xs text-muted-foreground">active days this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {tasks
              .filter(task => task.date === new Date().toISOString().split('T')[0])
              .map(task => (
                <Card key={task.id} className={task.completed ? "bg-green-50 border-green-200" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTask(task.id, task.completed)}
                        >
                          <CheckCircle 
                            className={`h-5 w-5 ${task.completed ? 'text-green-600' : 'text-gray-400'}`} 
                          />
                        </Button>
                        <div>
                          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600">{task.platform} - {task.difficulty}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Problem Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter problem title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Optional description or notes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <select
                    id="platform"
                    value={newTask.platform}
                    onChange={(e) => setNewTask({...newTask, platform: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="LeetCode">LeetCode</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="CodeChef">CodeChef</option>
                    <option value="AtCoder">AtCoder</option>
                    <option value="HackerRank">HackerRank</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    value={newTask.difficulty}
                    onChange={(e) => setNewTask({...newTask, difficulty: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <Button onClick={addTask} disabled={loading} className="w-full">
                {loading ? "Adding..." : "Add Task"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {tasks.map(task => (
              <Card key={task.id} className={task.completed ? "bg-green-50 border-green-200" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CheckCircle 
                        className={`h-5 w-5 ${task.completed ? 'text-green-600' : 'text-gray-400'}`} 
                      />
                      <div>
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {task.platform} - {task.difficulty} - {task.date}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTask(task.id, task.completed)}
                    >
                      {task.completed ? "Mark Incomplete" : "Mark Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Weekly Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.weeklyRate}%</div>
                <p className="text-xs text-muted-foreground">Last 7 days average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.week}</div>
                <p className="text-xs text-muted-foreground">Tasks this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.week / 7)}</div>
                <p className="text-xs text-muted-foreground">Tasks per day</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="Completed Tasks"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    name="Total Tasks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Monthly Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.monthlyRate}%</div>
                <p className="text-xs text-muted-foreground">Last 30 days average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.month}</div>
                <p className="text-xs text-muted-foreground">Tasks this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.month / 30)}</div>
                <p className="text-xs text-muted-foreground">Tasks per day</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#2563eb" name="Completed Tasks" />
                  <Bar dataKey="total" fill="#dc2626" name="Total Tasks" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyWork;
