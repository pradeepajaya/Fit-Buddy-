import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrendingUp, Calendar, Droplets, Flame, Award, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Badge } from './ui/badge';

interface WeeklyData {
  week: string;
  water: number;
  calories: number;
  workouts: number;
}

interface DailyData {
  date: string;
  water: number;
  calories: number;
  workouts: number;
}

export function ProgressPage() {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    generateProgressData();
    checkAchievements();
  }, []);

  const generateProgressData = () => {
    // Generate weekly data (last 4 weeks)
    const weekly: WeeklyData[] = [];
    for (let i = 3; i >= 0; i--) {
      weekly.push({
        week: `Week ${4 - i}`,
        water: Math.floor(Math.random() * 5000) + 10000, // 10-15L per week
        calories: Math.floor(Math.random() * 1500) + 1500, // 1500-3000 cal per week
        workouts: Math.floor(Math.random() * 3) + 3, // 3-6 workouts per week
      });
    }
    setWeeklyData(weekly);

    // Generate daily data (last 30 days)
    const daily: DailyData[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      daily.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        water: Math.floor(Math.random() * 1000) + 1500, // 1500-2500ml per day
        calories: Math.floor(Math.random() * 300) + 200, // 200-500 cal per day
        workouts: Math.random() > 0.6 ? 1 : 0, // Some days have workouts
      });
    }
    setDailyData(daily);
  };

  const checkAchievements = () => {
    const unlocked: string[] = [];
    
    // Check for achievements based on stored data
    const exerciseHistory = localStorage.getItem('exerciseHistory');
    const waterHistory = localStorage.getItem('waterHistory');
    
    if (exerciseHistory) {
      const history = JSON.parse(exerciseHistory);
      if (history.length >= 5) unlocked.push('5 Workouts Complete');
      if (history.length >= 10) unlocked.push('10 Workouts Complete');
      if (history.length >= 20) unlocked.push('20 Workouts Complete');
      
      const totalCalories = history.reduce((sum: number, item: any) => sum + item.calories, 0);
      if (totalCalories >= 1000) unlocked.push('1000 Calories Burned');
      if (totalCalories >= 5000) unlocked.push('5000 Calories Burned');
    }
    
    if (waterHistory) {
      const history = JSON.parse(waterHistory);
      const daysWithGoal = history.filter((day: any) => day.amount >= 2000).length;
      if (daysWithGoal >= 3) unlocked.push('3 Day Hydration Streak');
      if (daysWithGoal >= 7) unlocked.push('7 Day Hydration Streak');
    }

    setAchievements(unlocked);
  };

  const calculateStats = () => {
    const data = timeframe === 'week' ? dailyData.slice(-7) : dailyData;
    
    const totalWater = data.reduce((sum, day) => sum + day.water, 0);
    const totalCalories = data.reduce((sum, day) => sum + day.calories, 0);
    const totalWorkouts = data.reduce((sum, day) => sum + day.workouts, 0);
    const avgWater = Math.round(totalWater / data.length);
    const avgCalories = Math.round(totalCalories / data.length);
    
    return {
      totalWater,
      totalCalories,
      totalWorkouts,
      avgWater,
      avgCalories,
      daysTracked: data.length,
    };
  };

  const stats = calculateStats();

  const getAchievementIcon = (achievement: string) => {
    if (achievement.includes('Workout')) return '💪';
    if (achievement.includes('Calories')) return '🔥';
    if (achievement.includes('Hydration')) return '💧';
    return '🏆';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-blue-600">Progress & Statistics</h1>
        <p className="text-gray-600">Track your fitness journey</p>
      </div>

      {/* Timeframe Toggle */}
      <div className="flex gap-2">
        <Button
          variant={timeframe === 'week' ? 'default' : 'outline'}
          onClick={() => setTimeframe('week')}
          className={timeframe === 'week' ? 'bg-blue-600' : ''}
        >
          <Calendar className="w-4 h-4 mr-2" />
          This Week
        </Button>
        <Button
          variant={timeframe === 'month' ? 'default' : 'outline'}
          onClick={() => setTimeframe('month')}
          className={timeframe === 'month' ? 'bg-blue-600' : ''}
        >
          <Calendar className="w-4 h-4 mr-2" />
          This Month
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5" />
            <span className="text-white/80">Avg Water</span>
          </div>
          <p className="text-white">{stats.avgWater}ml</p>
          <p className="text-white/70">per day</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-white/80">Total Calories</span>
          </div>
          <p className="text-white">{stats.totalCalories}</p>
          <p className="text-white/70">burned</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-white/80">Workouts</span>
          </div>
          <p className="text-white">{stats.totalWorkouts}</p>
          <p className="text-white/70">sessions</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-white/80">Active Days</span>
          </div>
          <p className="text-white">{stats.daysTracked}</p>
          <p className="text-white/70">tracked</p>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="water" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="water">Water Intake</TabsTrigger>
          <TabsTrigger value="calories">Calories Burned</TabsTrigger>
          <TabsTrigger value="workouts">Workout Frequency</TabsTrigger>
        </TabsList>

        <TabsContent value="water" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Water Intake Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeframe === 'week' ? dailyData.slice(-7) : dailyData}>
                  <defs>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} label={{ value: 'ml', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="water" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                💡 You're averaging <span className="text-blue-600">{stats.avgWater}ml</span> of water per day. 
                {stats.avgWater >= 2000 ? ' Great job staying hydrated! 🎉' : ' Try to reach 2000ml daily!'}
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="calories" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Calories Burned</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeframe === 'week' ? dailyData.slice(-7) : dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} label={{ value: 'calories', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="calories" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <p className="text-gray-700">
                🔥 You've burned <span className="text-orange-600">{stats.totalCalories}</span> calories total. 
                Keep up the great work!
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Workout Frequency</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeframe === 'week' ? dailyData.slice(-7) : dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} label={{ value: 'workouts', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="workouts" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-gray-700">
                💪 You've completed <span className="text-green-600">{stats.totalWorkouts}</span> workouts. 
                {stats.totalWorkouts >= 5 ? ' Excellent consistency! 🌟' : ' Keep building that habit!'}
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Weekly Comparison */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">4-Week Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} name="Water (ml)" />
              <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} name="Calories" />
              <Line type="monotone" dataKey="workouts" stroke="#10b981" strokeWidth={2} name="Workouts" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-yellow-500" />
          <h3 className="text-gray-900">Achievements Unlocked</h3>
        </div>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg text-center"
              >
                <div className="text-3xl mb-2">{getAchievementIcon(achievement)}</div>
                <p className="text-gray-700">{achievement}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p>Start tracking to unlock achievements!</p>
          </div>
        )}
      </Card>

      {/* Goals Summary */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <h3 className="text-gray-900 mb-4">Your Goals</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Daily Water Goal</span>
            </div>
            <Badge className="bg-blue-100 text-blue-700">2000ml</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Weekly Workouts</span>
            </div>
            <Badge className="bg-green-100 text-green-700">5 sessions</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className="text-gray-700">Daily Calories</span>
            </div>
            <Badge className="bg-orange-100 text-orange-700">300+ cal</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
