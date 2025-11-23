import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Droplets, Plus, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WaterData {
  date: string;
  amount: number;
}

export function WaterIntakePage() {
  const [todayIntake, setTodayIntake] = useState(0);
  const [waterGoal] = useState(2000);
  const [history, setHistory] = useState<WaterData[]>([]);

  useEffect(() => {
    // Load today's intake
    const storedIntake = localStorage.getItem('todayWaterIntake');
    if (storedIntake) {
      setTodayIntake(parseInt(storedIntake));
    }

    // Load history
    const storedHistory = localStorage.getItem('waterHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    } else {
      // Generate sample history for last 7 days
      const sampleHistory = generateSampleHistory();
      setHistory(sampleHistory);
      localStorage.setItem('waterHistory', JSON.stringify(sampleHistory));
    }
  }, []);

  const generateSampleHistory = (): WaterData[] => {
    const data: WaterData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      data.push({
        date: dateStr,
        amount: Math.floor(Math.random() * 1000) + 1200, // Random between 1200-2200ml
      });
    }
    
    return data;
  };

  const addWater = (amount: number) => {
    const newIntake = Math.max(0, todayIntake + amount);
    setTodayIntake(newIntake);
    localStorage.setItem('todayWaterIntake', newIntake.toString());
  };

  const waterPercentage = Math.min((todayIntake / waterGoal) * 100, 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-blue-600">Water Intake</h1>
        <p className="text-gray-600">Track your daily hydration</p>
      </div>

      {/* Today's Progress */}
      <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-white/20 rounded-full">
            <Droplets className="w-12 h-12" />
          </div>
          <div>
            <p className="text-white/80 mb-1">Today's Intake</p>
            <h2 className="text-white">{todayIntake} ml</h2>
            <p className="text-white/80">Goal: {waterGoal} ml</p>
          </div>
          <div className="w-full">
            <Progress value={waterPercentage} className="h-3 bg-white/20" />
            <p className="text-white/90 mt-2">{Math.round(waterPercentage)}% of daily goal</p>
          </div>
        </div>
      </Card>

      {/* Quick Add Buttons */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Log Water Intake</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => addWater(250)}
            className="h-20 flex flex-col gap-1 bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            <span>250ml</span>
            <span className="text-xs opacity-80">1 Glass</span>
          </Button>
          <Button
            onClick={() => addWater(500)}
            className="h-20 flex flex-col gap-1 bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            <span>500ml</span>
            <span className="text-xs opacity-80">1 Bottle</span>
          </Button>
          <Button
            onClick={() => addWater(750)}
            className="h-20 flex flex-col gap-1 bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            <span>750ml</span>
            <span className="text-xs opacity-80">Large Bottle</span>
          </Button>
          <Button
            onClick={() => addWater(-250)}
            variant="outline"
            className="h-20 flex flex-col gap-1 border-gray-300"
          >
            <Minus className="w-5 h-5" />
            <span>Undo</span>
            <span className="text-xs opacity-60">-250ml</span>
          </Button>
        </div>
      </Card>

      {/* History Chart */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Last 7 Days</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#9ca3af' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#9ca3af' }}
                label={{ value: 'ml', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value} ml`, 'Water Intake']}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Daily Water Intake (ml)</span>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-gray-900 mb-2">Hydration Tips</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Drink a glass of water when you wake up</li>
          <li>• Keep a water bottle with you throughout the day</li>
          <li>• Drink water before, during, and after exercise</li>
          <li>• Set reminders to drink water every hour</li>
        </ul>
      </Card>
    </div>
  );
}
