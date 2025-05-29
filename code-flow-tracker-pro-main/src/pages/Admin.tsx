
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Activity, TrendingUp, Calendar, Search, Eye, Ban, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface UserActivity {
  id: string;
  email: string;
  username: string;
  full_name: string;
  created_at: string;
  total_tasks: number;
  completed_tasks: number;
  platforms: number;
  last_activity: string;
  avg_rating: number;
  status: 'active' | 'inactive';
}

interface TaskActivity {
  id: string;
  user_id: string;
  title: string;
  platform: string;
  difficulty: string;
  completed: boolean;
  date: string;
  username: string;
  created_at: string;
}

interface RatingActivity {
  id: string;
  user_id: string;
  platform: string;
  username: string;
  rating: number;
  max_rating: number;
  problems_solved: number;
  contests_attended: number;
  user_username: string;
}

interface Analytics {
  dailySignups: { date: string; count: number }[];
  platformDistribution: { platform: string; count: number }[];
  taskCompletion: { date: string; completed: number; total: number }[];
  difficultyDistribution: { difficulty: string; count: number }[];
}

const Admin = () => {
  const [users, setUsers] = useState<UserActivity[]>([]);
  const [tasks, setTasks] = useState<TaskActivity[]>([]);
  const [ratings, setRatings] = useState<RatingActivity[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    dailySignups: [],
    platformDistribution: [],
    taskCompletion: [],
    difficultyDistribution: []
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    activePlatforms: 0,
    avgCompletionRate: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserActivity | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "#10b981",
    },
    total: {
      label: "Total",
      color: "#3b82f6",
    },
    count: {
      label: "Count",
      color: "#8b5cf6",
    },
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .rpc('is_admin', { user_email: user.email });

      if (error) throw error;
      
      setIsAdmin(data);
      if (data) {
        fetchAdminData();
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin status",
        variant: "destructive",
      });
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data
      const [profilesResult, tasksResult, ratingsResult] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('daily_tasks').select('*'),
        supabase.from('platform_ratings').select('*')
      ]);

      const profilesData = profilesResult.data || [];
      const tasksData = tasksResult.data || [];
      const ratingsData = ratingsResult.data || [];

      // Process users with comprehensive stats
      const usersWithStats = profilesData.map(profile => {
        const userTasks = tasksData.filter(task => task.user_id === profile.id);
        const userRatings = ratingsData.filter(rating => rating.user_id === profile.id);
        const avgRating = userRatings.length > 0 
          ? userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length 
          : 0;
        
        const lastActivity = userTasks.length > 0 ? 
          new Date(Math.max(...userTasks.map(task => new Date(task.created_at).getTime()))).toISOString() : 
          profile.created_at;
        
        const isActive = new Date(lastActivity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return {
          id: profile.id,
          email: 'Protected',
          username: profile.username || 'Anonymous',
          full_name: profile.full_name || 'N/A',
          created_at: profile.created_at,
          total_tasks: userTasks.length,
          completed_tasks: userTasks.filter(task => task.completed).length,
          platforms: userRatings.length,
          last_activity: lastActivity,
          avg_rating: Math.round(avgRating),
          status: isActive ? 'active' : 'inactive'
        } as UserActivity;
      });

      setUsers(usersWithStats);

      // Process tasks with usernames
      const tasksWithUsername = tasksData.map(task => {
        const profile = profilesData.find(p => p.id === task.user_id);
        return {
          ...task,
          username: profile?.username || 'Anonymous'
        };
      });
      setTasks(tasksWithUsername);

      // Process ratings with usernames
      const ratingsWithUsername = ratingsData.map(rating => {
        const profile = profilesData.find(p => p.id === rating.user_id);
        return {
          ...rating,
          user_username: profile?.username || 'Anonymous'
        };
      });
      setRatings(ratingsWithUsername);

      // Generate analytics
      generateAnalytics(profilesData, tasksData, ratingsData);

      // Calculate comprehensive stats
      const totalUsers = profilesData.length;
      const totalTasks = tasksData.length;
      const completedTasks = tasksData.filter(task => task.completed).length;
      const activePlatforms = new Set(ratingsData.map(rating => rating.platform)).size;
      const avgCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const activeUsers = usersWithStats.filter(user => user.status === 'active').length;

      setStats({
        totalUsers,
        totalTasks,
        completedTasks,
        activePlatforms,
        avgCompletionRate,
        activeUsers
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAnalytics = (profiles: any[], tasks: any[], ratings: any[]) => {
    // Daily signups
    const signupsByDate = profiles.reduce((acc, profile) => {
      const date = new Date(profile.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dailySignups = Object.entries(signupsByDate)
      .map(([date, count]) => ({ date, count: Number(count) }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);

    // Platform distribution
    const platformCounts = ratings.reduce((acc, rating) => {
      acc[rating.platform] = (acc[rating.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const platformDistribution = Object.entries(platformCounts)
      .map(([platform, count]) => ({ platform, count: Number(count) }));

    // Task completion by date
    const tasksByDate = tasks.reduce((acc, task) => {
      const date = task.date;
      if (!acc[date]) acc[date] = { completed: 0, total: 0 };
      acc[date].total++;
      if (task.completed) acc[date].completed++;
      return acc;
    }, {} as Record<string, { completed: number; total: number }>);

    const taskCompletion = Object.entries(tasksByDate)
      .map(([date, data]) => ({ 
        date, 
        completed: (data as { completed: number; total: number }).completed, 
        total: (data as { completed: number; total: number }).total 
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10);

    // Difficulty distribution
    const difficultyCounts = tasks.reduce((acc, task) => {
      acc[task.difficulty] = (acc[task.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const difficultyDistribution = Object.entries(difficultyCounts)
      .map(([difficulty, count]) => ({ difficulty, count: Number(count) }));

    setAnalytics({
      dailySignups,
      platformDistribution,
      taskCompletion,
      difficultyDistribution
    });
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewUserDetails = (user: UserActivity) => {
    setSelectedUser(user);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin portal.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-xl text-gray-600">
          Comprehensive monitoring and analytics for CodeMaster
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} active this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">All time tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.avgCompletionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platforms</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePlatforms}</div>
            <p className="text-xs text-muted-foreground">In active use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{analytics.dailySignups.reduce((sum, day) => sum + day.count, 0)}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Signups (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.dailySignups}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.platformDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.platformDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Completion Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.taskCompletion}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="completed" stroke="var(--color-completed)" strokeWidth={2} />
                      <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Difficulty Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.difficultyDistribution}>
                      <XAxis dataKey="difficulty" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                User Management
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Avg Rating</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.total_tasks}</TableCell>
                      <TableCell>
                        <Badge variant={user.total_tasks > 0 && (user.completed_tasks / user.total_tasks) > 0.7 ? "default" : "secondary"}>
                          {user.total_tasks > 0 ? Math.round((user.completed_tasks / user.total_tasks) * 100) : 0}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold">{user.avg_rating}</div>
                      </TableCell>
                      <TableCell>{user.platforms}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewUserDetails(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Recent Task Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.slice(0, 50).map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.username}</TableCell>
                      <TableCell className="max-w-xs truncate">{task.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          task.difficulty === 'Hard' ? 'destructive' : 
                          task.difficulty === 'Medium' ? 'default' : 'secondary'
                        }>
                          {task.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.completed ? 'default' : 'secondary'}>
                          {task.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(task.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>User Platform Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Platform Username</TableHead>
                    <TableHead>Current Rating</TableHead>
                    <TableHead>Max Rating</TableHead>
                    <TableHead>Problems Solved</TableHead>
                    <TableHead>Contests</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ratings.map((rating) => (
                    <TableRow key={rating.id}>
                      <TableCell className="font-medium">{rating.user_username}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rating.platform}</Badge>
                      </TableCell>
                      <TableCell>{rating.username}</TableCell>
                      <TableCell className="font-bold text-blue-600">{rating.rating}</TableCell>
                      <TableCell className="font-bold text-green-600">{rating.max_rating}</TableCell>
                      <TableCell>{rating.problems_solved}</TableCell>
                      <TableCell>{rating.contests_attended}</TableCell>
                      <TableCell>
                        <Badge variant={
                          rating.rating >= rating.max_rating * 0.9 ? 'default' :
                          rating.rating >= rating.max_rating * 0.7 ? 'secondary' : 'destructive'
                        }>
                          {rating.max_rating > 0 ? Math.round((rating.rating / rating.max_rating) * 100) : 0}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.avgCompletionRate}%</div>
                    <div className="text-sm text-gray-600">Average Completion Rate</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(stats.activeUsers / Math.max(stats.totalUsers, 1) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">User Engagement</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {ratings.length > 0 ? Math.round(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) : 0}
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {users.length > 0 ? Math.round(users.reduce((sum, u) => sum + u.total_tasks, 0) / users.length) : 0}
                    </div>
                    <div className="text-sm text-gray-600">Tasks per User</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users
                      .sort((a, b) => (b.completed_tasks / Math.max(b.total_tasks, 1)) - (a.completed_tasks / Math.max(a.total_tasks, 1)))
                      .slice(0, 5)
                      .map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-gray-600">{user.completed_tasks}/{user.total_tasks} tasks</div>
                            </div>
                          </div>
                          <Badge variant="default">
                            {user.total_tasks > 0 ? Math.round((user.completed_tasks / user.total_tasks) * 100) : 0}%
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Popularity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.platformDistribution
                      .sort((a, b) => b.count - a.count)
                      .map((platform, index) => (
                        <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="font-medium">{platform.platform}</div>
                          </div>
                          <Badge variant="outline">{platform.count} users</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">User Details</h3>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Username:</strong> {selectedUser.username}</p>
                  <p><strong>Full Name:</strong> {selectedUser.full_name}</p>
                  <p><strong>Status:</strong> 
                    <Badge className="ml-2" variant={selectedUser.status === 'active' ? 'default' : 'secondary'}>
                      {selectedUser.status}
                    </Badge>
                  </p>
                  <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><strong>Total Tasks:</strong> {selectedUser.total_tasks}</p>
                  <p><strong>Completed:</strong> {selectedUser.completed_tasks}</p>
                  <p><strong>Completion Rate:</strong> {selectedUser.total_tasks > 0 ? Math.round((selectedUser.completed_tasks / selectedUser.total_tasks) * 100) : 0}%</p>
                  <p><strong>Platforms:</strong> {selectedUser.platforms}</p>
                  <p><strong>Avg Rating:</strong> {selectedUser.avg_rating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
