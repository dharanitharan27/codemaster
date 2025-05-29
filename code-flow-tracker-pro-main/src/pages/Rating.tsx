import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Trophy, Star, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PlatformRating {
  id: string;
  platform: string;
  username: string;
  rating: number;
  contests_attended: number;
  problems_solved: number;
  max_rating: number;
  user_id: string;
}

interface Friend {
  id: string;
  friend_username: string;
  platform: string;
  rating: number;
  verified: boolean;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  platform: string;
  current_rating: number;
  peak_rating: number;
  problems_solved: number;
  contests_participated: number;
  profiles?: {
    username: string;
    full_name: string;
  };
}

interface PlatformRatingData {
  user_id: string;
  platform: string;
  username: string;
  rating?: number;
  max_rating?: number;
  ranking?: number;
  problems_solved?: number;
  easy_solved?: number;
  medium_solved?: number;
  hard_solved?: number;
  rank?: string;
  max_rank?: string;
  contests_attended?: number;
  stars?: string;
  global_rank?: number;
  country_rank?: number;
}

interface LeaderboardData {
  user_id: string;
  platform: string;
  current_rating: number;
  peak_rating: number;
  problems_solved: number;
  contests_participated: number;
}

const Rating = () => {
  const [ratings, setRatings] = useState<PlatformRating[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("LeetCode");
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [newRating, setNewRating] = useState({
    platform: "LeetCode",
    username: "",
    rating: 0,
    contests_attended: 0,
    problems_solved: 0,
    max_rating: 0,
  });
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [friendUsername, setFriendUsername] = useState("");
  const [friendPlatform, setFriendPlatform] = useState("LeetCode");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const platforms = [
    { name: "LeetCode", color: "bg-orange-100 text-orange-800" },
    { name: "Codeforces", color: "bg-blue-100 text-blue-800" },
    { name: "CodeChef", color: "bg-brown-100 text-brown-800" },
    { name: "AtCoder", color: "bg-green-100 text-green-800" }
  ];

  useEffect(() => {
    fetchRatings();
    fetchFriends();
    fetchLeaderboard();
  }, [selectedPlatform]);

  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_ratings')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setRatings((data as any) || []);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setFriends((data as any) || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard_stats')
        .select(`
          *,
          profiles(username, full_name)
        `)
        .eq('platform', selectedPlatform)
        .order('current_rating', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLeaderboard((data as any) || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const addRating = async () => {
    // Require verification before saving
    const platformKey = newRating.platform.toLowerCase();
    if (!verificationResult || !verificationResult[platformKey] || verificationResult[platformKey].error) {
      toast({
        title: "Verification Required",
        description: "Please verify the username before updating the rating.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Use verification result data if available and valid, otherwise use manual input data
      const baseData: PlatformRatingData = { 
        user_id: user?.id || '', 
        platform: newRating.platform, 
        username: newRating.username 
      };

      let ratingDataToSave: PlatformRatingData = { ...baseData };

      if (verificationResult && verificationResult[platformKey] && !verificationResult[platformKey].error) {
        const verifiedData = verificationResult[platformKey];
        
        // Platform-specific data mapping
        switch (newRating.platform) {
          case "LeetCode":
            ratingDataToSave = {
              ...baseData,
              rating: verifiedData.rating || 0,
              max_rating: verifiedData.maxRating || verifiedData.rating || 0,
              ranking: verifiedData.ranking || 0,
              problems_solved: verifiedData.problemsSolved || 0,
              easy_solved: verifiedData.easySolved || 0,
              medium_solved: verifiedData.mediumSolved || 0,
              hard_solved: verifiedData.hardSolved || 0
            };
            break;
          case "Codeforces":
            ratingDataToSave = {
              ...baseData,
              rating: verifiedData.rating || 0,
              max_rating: verifiedData.maxRating || verifiedData.rating || 0,
              rank: verifiedData.rank || 'unrated',
              max_rank: verifiedData.maxRank || 'unrated',
              contests_attended: verifiedData.contestsParticipated || 0,
              problems_solved: verifiedData.problemsSolved || 0
            };
            break;
          case "CodeChef":
            ratingDataToSave = {
              ...baseData,
              rating: verifiedData.rating || 0,
              stars: verifiedData.stars || '0★',
              global_rank: verifiedData.globalRank || 0,
              country_rank: verifiedData.countryRank || 0,
              problems_solved: verifiedData.problemsSolved || 0
            };
            break;
          case "AtCoder":
            ratingDataToSave = {
              ...baseData,
              rating: verifiedData.rating || 0,
              rank: verifiedData.rank || 'unrated',
              contests_attended: verifiedData.contestsParticipated || 0,
              problems_solved: verifiedData.problemsSolved || 0
            };
            break;
        }
      }

      const { data: upsertedData, error } = await supabase
        .from('platform_ratings')
        .upsert([ratingDataToSave], {
          onConflict: 'user_id,platform'
        }).select();

      if (error) throw error;

      // Also update leaderboard_stats using the same data
      const leaderboardData: LeaderboardData = {
        user_id: user?.id || '',
        platform: ratingDataToSave.platform,
        current_rating: ratingDataToSave.rating || 0,
        peak_rating: ratingDataToSave.max_rating || 0,
        problems_solved: ratingDataToSave.problems_solved || 0,
        contests_participated: ratingDataToSave.contests_attended || 0
      };

      await supabase
        .from('leaderboard_stats')
        .upsert([leaderboardData], {
          onConflict: 'user_id,platform'
        });

      toast({
        title: "Rating updated!",
        description: `Your ${newRating.platform} rating has been updated.`,
      });

      // Update the ratings state with the upserted data
      if (upsertedData && upsertedData.length > 0) {
        setRatings(prevRatings => {
          const existingIndex = prevRatings.findIndex(r => r.id === upsertedData[0].id);
          if (existingIndex > -1) {
            const newRatings = [...prevRatings];
            newRatings[existingIndex] = upsertedData[0];
            return newRatings;
          } else {
            return [...prevRatings, upsertedData[0]];
          }
        });
      }

      // Clear the form and verification result after successful update
      setNewRating({
        platform: "LeetCode",
        username: "",
        rating: 0,
        contests_attended: 0,
        problems_solved: 0,
        max_rating: 0
      });
      setVerificationResult(null);

      fetchLeaderboard(); // Re-fetch leaderboard as it depends on potentially changed data
    } catch (error: any) {
      console.error('Error adding rating:', error);
      toast({
        title: "Error",
        description: `Failed to update rating: ${error?.message || error?.toString() || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async () => {
    if (!friendUsername.trim()) return;

    setLoading(true);
    try {
      const friendData = {
        user_id: user?.id,
        friend_username: friendUsername,
        platform: friendPlatform,
        rating: 0,
        verified: false
      };

      const { error } = await supabase
        .from('friends')
        .insert([friendData as any]);

      if (error) throw error;

      toast({
        title: "Friend added!",
        description: `${friendUsername} has been added to your friends list.`,
      });

      setFriendUsername("");
      fetchFriends();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add friend",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFriendRating = async (friendId: string, newRating: number) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ rating: newRating } as any)
        .eq('id', friendId);

      if (error) throw error;

      toast({
        title: "Friend rating updated!",
        description: "The friend's rating has been updated successfully.",
      });

      setEditingFriend(null);
      fetchFriends();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update friend rating",
        variant: "destructive",
      });
    }
  };

  const getRatingColor = (rating: number, platform: string) => {
    if (platform === "Codeforces") {
      if (rating >= 2400) return "text-red-600";
      if (rating >= 2100) return "text-orange-600";
      if (rating >= 1900) return "text-purple-600";
      if (rating >= 1600) return "text-blue-600";
      if (rating >= 1400) return "text-cyan-600";
      if (rating >= 1200) return "text-green-600";
      return "text-gray-600";
    }
    if (rating >= 2000) return "text-red-600";
    if (rating >= 1500) return "text-orange-600";
    if (rating >= 1000) return "text-blue-600";
    return "text-green-600";
  };

  const getPlatformStats = (platform: string, data: PlatformRatingData | undefined) => {
    // Ensure data object is valid before accessing properties
    if (!data) return {};

    switch (platform) {
      case "Codeforces":
        return {
          rating: data.rating ?? 0,
          maxRating: data.max_rating ?? 0,
          rank: data.rank ?? 'unrated',
          maxRank: data.max_rank ?? 'unrated',
          contestsParticipated: data.contests_attended ?? 0,
          problemsSolved: data.problems_solved ?? 0
        };
      case "CodeChef":
        return {
          rating: data.rating ?? 0,
          stars: data.stars ?? '0★',
          globalRank: data.global_rank ?? 0,
          countryRank: data.country_rank ?? 0,
          problemsSolved: data.problems_solved ?? 0
        };
      case "AtCoder":
        return {
          rating: data.rating ?? 0,
          rank: data.rank ?? 'unrated',
          contestsParticipated: data.contests_attended ?? 0,
          problemsSolved: data.problems_solved ?? 0
        };
      case "LeetCode":
        return {
          rating: data.rating ?? 0,
          ranking: data.ranking ?? 0,
          maxRating: data.max_rating ?? 0,
          problemsSolved: data.problems_solved ?? 0,
          easySolved: data.easy_solved ?? 0,
          mediumSolved: data.medium_solved ?? 0,
          hardSolved: data.hard_solved ?? 0
        };
      default:
        return {};
    }
  };

  const fetchProfiles = async (usernames: {
    codeforces?: string;
    codechef?: string;
    atcoder?: string;
    leetcode?: string;
  }) => {
    const params = new URLSearchParams();
    if (usernames.codeforces) params.append('cf', usernames.codeforces);
    if (usernames.codechef) params.append('cc', usernames.codechef);
    if (usernames.atcoder) params.append('ac', usernames.atcoder);
    if (usernames.leetcode) params.append('lc', usernames.leetcode);

    const response = await fetch(`http://localhost:3000/api/fetch-profile?${params}`);
    return response.json();
  };

  const verifyUsername = async () => {
    if (!newRating.username.trim()) return;

    // Clear previous verification result before verifying again
    setVerificationResult(null);
    setVerifying(true);
    try {
      const usernames = {
        leetcode: newRating.platform === "LeetCode" ? newRating.username : undefined,
        codeforces: newRating.platform === "Codeforces" ? newRating.username : undefined,
        codechef: newRating.platform === "CodeChef" ? newRating.username : undefined,
        atcoder: newRating.platform === "AtCoder" ? newRating.username : undefined,
      };

      const result = await fetchProfiles(usernames);
      // Keep the verification result visible
      setVerificationResult(result);

      const platformKey = newRating.platform.toLowerCase();
      const platformData = result[platformKey];

      if (platformData?.error) {
        toast({
          title: "Verification Failed",
          description: `Could not verify ${newRating.platform} username: ${platformData.error}`,
          variant: "destructive",
        });
        // Do NOT reset rating fields here, keep them as user entered or previous verified
        return;
      }

      // Optionally, you could update the manual input fields here with verified data if desired
      // But based on your request, we will use verificationResult directly in addRating

      toast({
        title: "Verification Successful",
        description: `Successfully verified ${newRating.platform} username!`,
      });
    } catch (error) {
      console.error('Verification error:', error); // Log the verification error
      setVerificationResult({
         [newRating.platform.toLowerCase()]: { error: "Verification failed due to an error." }
      });
      toast({
        title: "Verification Error",
        description: "Failed to verify username. Please try again.",
        variant: "destructive",
      });
       // Do NOT reset rating fields on a general error
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Rating Dashboard</h1>
        <p className="text-xl text-gray-600">
          Track your progress across multiple competitive programming platforms
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="update">Update Rating</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map(platform => {
              const rating = ratings.find(r => r.platform === platform.name);
              const stats = getPlatformStats(platform.name, rating);

              return (
                <Card key={platform.name} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">{platform.name}</CardTitle>
                    <Badge className={`${platform.color} px-2 py-1 rounded-full text-xs`}>{platform.name}</Badge>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    {stats && stats.rating !== undefined ? (
                      <div className="space-y-2 text-sm">
                        {/* Display main rating */}
                        <div className={`text-3xl font-extrabold ${getRatingColor(stats.rating, platform.name)}`}>
                          {stats.rating}
                        </div>

                        {/* Platform Specific Details */}
                        {Object.entries(stats).map(([key, value]) => {
                          if (key === 'rating' || value === undefined || value === null) return null;

                          let displayValue = value;
                          if (typeof value === 'number') {
                            displayValue = value.toLocaleString();
                          } else if (typeof value === 'string' && key.toLowerCase().includes('rank')) {
                            displayValue = value === 'unrated' ? value : `#${value}`;
                          }

                          const displayKey = key.replace(/([A-Z])/g, ' $1')
                                              .replace(/_/g, ' ')
                                              .split(' ')
                                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                              .join(' ');

                          if (key === 'stars' && platform.name === 'CodeChef') {
                            return (
                              <div key={key} className="flex items-center gap-1 text-gray-700">
                                {displayKey}: <span className="text-yellow-500 font-semibold">{value}</span>
                              </div>
                            );
                          }

                          if (key.toLowerCase().includes('rank')) {
                            return (
                              <div key={key} className="flex items-center gap-1 text-gray-700">
                                {displayKey}: <span className="font-semibold">{displayValue}</span>
                              </div>
                            );
                          }

                          return (
                            <div key={key} className="text-gray-700">
                              {displayKey}: {displayValue}
                            </div>
                          );
                        })}

                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">Not set up</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Progress Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ratings.map(rating => (
                    <div key={rating.platform} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                      <span className="font-medium text-gray-700">{rating.platform}</span>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${getRatingColor(rating.rating, rating.platform)}`}>
                          {rating.rating}
                        </div>
                        {/* Display Rating Change */}
                        {rating.max_rating > 0 && rating.rating !== rating.max_rating && (
                            <div className={`text-sm ${rating.rating > rating.max_rating ? 'text-green-600' : 'text-red-600'}`}>
                              {rating.rating > rating.max_rating ? '+' : ''}{rating.rating - rating.max_rating}
                            </div>
                         )}
                      </div>
                    </div>
                  ))}
                  {ratings.length > 0 && (
                    <div className="pt-4 border-t mt-4 space-y-2 text-gray-700">
                       <div className="font-semibold text-gray-800">Overall Stats</div>
                       <div>
                           Total Contests Participated: <span className="font-bold text-gray-900">
                               {ratings.reduce((sum, r) => sum + (r.contests_attended || 0), 0)}
                           </span>
                       </div>
                        <div>
                           Total Problems Solved: <span className="font-bold text-gray-900">
                               {ratings.reduce((sum, r) => sum + (r.problems_solved || 0), 0)}
                           </span>
                       </div>
                    </div>
                  )}
                  {ratings.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No rating information available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Achievements and Ranks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ratings.map(rating => {
                    const stats = getPlatformStats(rating.platform, rating);
                    return (
                      <div key={rating.platform} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                        <div className="font-medium text-gray-700">{rating.platform}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-700">
                          {/* Displaying Ranks */}
                          {rating.platform === "Codeforces" && stats.rank && (
                            <div>Rank: <span className="font-semibold text-gray-900">{stats.rank === 'unrated' ? 'unrated' : `#${stats.rank}`}</span></div>
                          )}
                          {rating.platform === "CodeChef" && stats.globalRank !== undefined && (
                            <div>Global Rank: <span className="font-semibold text-gray-900">{stats.globalRank === 0 ? 'N/A' : `#${stats.globalRank.toLocaleString()}`}</span></div>
                          )}
                          {rating.platform === "AtCoder" && stats.rank && (
                             <div>Rank: <span className="font-semibold text-gray-900">{stats.rank === 'unrated' ? 'unrated' : `#${stats.rank}`}</span></div>
                          )}
                           {rating.platform === "LeetCode" && stats.ranking !== undefined && (
                             <div>Ranking: <span className="font-semibold text-gray-900">{stats.ranking === 0 ? 'N/A' : `#${stats.ranking.toLocaleString()}`}</span></div>
                          )}

                          {/* Existing Achievements */}
                          {stats.problemsSolved > 0 && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">{stats.problemsSolved.toLocaleString()}+ Problems</Badge>
                          )}
                          {((stats.contestsParticipated) || 0) > 0 && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">{stats.contestsParticipated.toLocaleString()}+ Contests</Badge>
                          )}
                          {stats.rating >= 1500 && ( // Example rating-based badge
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Rated {stats.rating.toLocaleString()}</Badge>
                          )}
                          {stats.stars && stats.stars !== '0★' && rating.platform === "CodeChef" && (
                             <Badge variant="secondary" className="bg-orange-100 text-orange-800">{stats.stars} Stars</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {ratings.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No rating information available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="update" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Update Rating Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <select
                    id="platform"
                    value={newRating.platform}
                    onChange={(e) => setNewRating({...newRating, platform: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {platforms.map(platform => (
                      <option key={platform.name} value={platform.name}>{platform.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={newRating.username}
                      onChange={(e) => setNewRating({...newRating, username: e.target.value})}
                      placeholder="Your username on the platform"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={verifyUsername} 
                      disabled={verifying || !newRating.username.trim()} 
                      variant="outline"
                    >
                      {verifying ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>
              </div>
              {/* Conditional display of Update Rating button and Verification Result */}
              {verificationResult && (verificationResult[newRating.platform.toLowerCase()] !== undefined) && (
                 <div className="space-y-4">
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-medium mb-2">Verification Result</h3>
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(verificationResult[newRating.platform.toLowerCase()], null, 2)}
                      </pre>
                    </div>
                     {/* Show Update Rating button only if verification was successful and no error */}
                    {!verificationResult[newRating.platform.toLowerCase()]?.error && (
                         <Button onClick={addRating} disabled={loading} className="w-full">
                            {loading ? "Updating..." : "Update Rating"}
                         </Button>
                    )}
                 </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Friend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="friend-platform">Platform</Label>
                  <select
                    id="friend-platform"
                    value={friendPlatform}
                    onChange={(e) => setFriendPlatform(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {platforms.map(platform => (
                      <option key={platform.name} value={platform.name}>{platform.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="friend-username">Username</Label>
                  <Input
                    id="friend-username"
                    value={friendUsername}
                    onChange={(e) => setFriendUsername(e.target.value)}
                    placeholder="Friend's username"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addFriend} disabled={loading} className="w-full">
                    Add Friend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Friends List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {friends.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{friend.friend_username}</div>
                        <div className="text-sm text-gray-500">{friend.platform}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`font-bold ${getRatingColor(friend.rating, friend.platform)}`}>
                        {friend.rating || "N/A"}
                      </div>
                      {friend.verified && <Star className="h-4 w-4 text-yellow-500" />}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditingFriend(friend)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update {friend.friend_username}'s Rating</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="new-rating">New Rating</Label>
                              <Input
                                id="new-rating"
                                type="number"
                                defaultValue={friend.rating}
                                onChange={(e) => setEditingFriend({...friend, rating: parseInt(e.target.value) || 0})}
                                placeholder="Enter new rating"
                              />
                            </div>
                            <Button 
                              onClick={() => editingFriend && updateFriendRating(friend.id, editingFriend.rating)}
                              className="w-full"
                            >
                              Update Rating
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
                {friends.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No friends added yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="leaderboard-platform-select">Select Platform</Label>
                <select
                  id="leaderboard-platform-select"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="ml-2 p-1 border rounded"
                >
                  {platforms.map(platform => (
                    <option key={platform.name} value={platform.name}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">
                          {entry.profiles?.username || entry.profiles?.full_name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entry.problems_solved} problems solved • {entry.contests_participated} contests participated
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getRatingColor(entry.current_rating, entry.platform)}`}>
                        {entry.current_rating}
                      </div>
                      <div className="text-sm text-gray-500">
                        Peak: {entry.peak_rating}
                      </div>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No data available for {selectedPlatform}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rating;
