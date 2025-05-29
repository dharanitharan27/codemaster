import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

interface ProfileResponse {
  codeforces?: any;
  codechef?: any;
  atcoder?: any;
  leetcode?: any;
}

app.get('/api/fetch-profile', async (req, res) => {
  const { cf, cc, ac, lc } = req.query;
  const results: ProfileResponse = {};

  try {
    // Codeforces
    if (cf) {
      try {
        const cfRes = await axios.get(`https://codeforces.com/api/user.info?handles=${cf}`);
        results.codeforces = {
          ...cfRes.data.result[0],
          rating: cfRes.data.result[0].rating || 0,
          maxRating: cfRes.data.result[0].maxRating || 0,
          rank: cfRes.data.result[0].rank || 'unrated',
          maxRank: cfRes.data.result[0].maxRank || 'unrated'
        };

        // Placeholder values - replace with actual fetched data
        let codeforcesProblemsSolved = 0; // Your logic to fetch problems solved
        let codeforcesContestsParticipated = 0; // Your logic to fetch contests participated

        // Example of how you might fetch using scraping (requires implementation):
       

        // Add the fetched problems solved and contests participated to the results object
        results.codeforces.problemsSolved = codeforcesProblemsSolved;
        results.codeforces.contestsParticipated = codeforcesContestsParticipated;

        // --- End of Section ---

      } catch (err) {
        results.codeforces = { error: 'User not found or API error' };
      }
    }

    // CodeChef
    if (cc) {
      try {
        // Use a different unofficial API
        const ccRes = await axios.get(`https://codechef-api.vercel.app/handle/${cc}`);
        if (ccRes.data && ccRes.data.status !== 'Failed') { // Check for valid response and not a failed status
           // Map the response data to our desired format
          results.codechef = {
            username: cc,
            rating: parseInt(ccRes.data.rating) || 0,
            globalRank: parseInt(ccRes.data.global_rank) || 0,
            countryRank: parseInt(ccRes.data.country_rank) || 0,
            stars: ccRes.data.stars || '0★',
            problemsSolved: parseInt(ccRes.data.problems_solved) || 0,
            contestsParticipated: parseInt(ccRes.data.contests_participated) || 0
          };
        } else {
           // If the API returns a failed status or empty data
          results.codechef = { error: ccRes.data.message || 'User not found or API error' };
        }
      } catch (err) {
        console.error('CodeChef API error:', err);
        results.codechef = { error: 'Failed to fetch CodeChef data' };
      }
    }

    // AtCoder
    if (ac) {
      try {
        // Use the @qatadaazzeh/atcoder-api library
        const { fetchUserInfo } = require('@qatadaazzeh/atcoder-api'); // Use require for commonjs module
        const userInfo = await fetchUserInfo(ac);

        if (userInfo && userInfo.userName) {
          results.atcoder = {
            username: userInfo.userName,
            rating: userInfo.userRating || 0,
            rank: userInfo.userRank || 'unrated',
            contestsParticipated: userInfo.userContests?.length || 0,
            problemsSolved: userInfo.userAcceptedProblems || 0
             // The library doesn't provide detailed problem counts by type (ABC, ARC, AGC)
          };
        } else {
          results.atcoder = { error: 'User not found or API error' };
        }
      } catch (err) {
        console.error('AtCoder API library error:', err);
        results.atcoder = { error: 'Failed to fetch AtCoder data' };
      }
    }

    // LeetCode
    if (lc) {
      try {
        const lcRes = await axios.post('https://leetcode.com/graphql', {
          query: `
            query {
              matchedUser(username: "${lc}") {
                username
                profile {
                  realName
                  ranking
                  reputation
                  starRating
                }
                submitStats {
                  acSubmissionNum {
                    difficulty
                    count
                  }
                }
                contestBadge {
                  name
                  expired
                  hoverText
                  icon
                }
              }
            }
          `
        }, {
          headers: { 'Content-Type': 'application/json' }
        });

        const userData = lcRes.data.data.matchedUser;
        
        // Calculate total problems solved from acSubmissionNum
        const totalLeetCodeProblemsSolved = userData.submitStats.acSubmissionNum.reduce((sum: number, stat: any) => {
          // Only sum problems for specific difficulties if needed, or sum 'All'
          if (stat.difficulty !== 'All') {
             return sum + stat.count;
          }
           return sum; // Or handle 'All' if needed, but summing Easy/Medium/Hard is typical
        }, 0);

        // Extract solved counts by difficulty
        const easySolved = userData.submitStats.acSubmissionNum.find((stat: any) => stat.difficulty === 'Easy')?.count || 0;
        const mediumSolved = userData.submitStats.acSubmissionNum.find((stat: any) => stat.difficulty === 'Medium')?.count || 0;
        const hardSolved = userData.submitStats.acSubmissionNum.find((stat: any) => stat.difficulty === 'Hard')?.count || 0;

        results.leetcode = {
          username: userData.username,
          profile: userData.profile,
          submissions: userData.submitStats.acSubmissionNum,
          contestBadge: userData.contestBadge,
          // Map LeetCode specific data to standard fields for the frontend
          rating: (userData.profile.starRating || 0) * 100,
          maxRating: (userData.profile.starRating || 0) * 100, // Assuming maxRating is similar to current for simplicity
          problemsSolved: totalLeetCodeProblemsSolved,
          contestsAttended: 0, // LeetCode GraphQL doesn't provide contest count directly here
          easy_solved: easySolved,
          medium_solved: mediumSolved,
          hard_solved: hardSolved
        };
      } catch (err) {
        console.error('LeetCode fetch failed:', err);
        results.leetcode = { error: 'LeetCode fetch failed' };
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 