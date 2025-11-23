import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sparkles, Droplets, Flame, Scale, User } from "lucide-react";

const wellnessTips = [
  "Stay hydrated! Drinking water first thing in the morning kickstarts your metabolism.",
  "Take short breaks every hour to stretch and move around. Your body will thank you!",
  "Aim for 7-9 hours of quality sleep each night for optimal recovery and performance.",
  "Practice mindful eating - chew slowly and savor each bite to improve digestion.",
  "A 10-minute morning walk can boost your mood and energy for the entire day.",
  "Deep breathing exercises can reduce stress and improve focus in just 5 minutes.",
];

export function HomePage() {
  const [dailyTip, setDailyTip] = useState("");
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal] = useState(2000); // 2000ml or 2 liters
  const [lastExerciseCalories, setLastExerciseCalories] = useState(0);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");

  useEffect(() => {
    // Get random wellness tip
    const randomTip =
      wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
    setDailyTip(randomTip);

    // Load data from localStorage
    const storedWaterIntake = localStorage.getItem("todayWaterIntake");
    if (storedWaterIntake) {
      setWaterIntake(parseInt(storedWaterIntake));
    }

    const exerciseHistory = localStorage.getItem("exerciseHistory");
    if (exerciseHistory) {
      const history = JSON.parse(exerciseHistory);
      if (history.length > 0) {
        setLastExerciseCalories(history[history.length - 1].calories);
      }
    }

    // Load BMI data from localStorage
    const storedWeight = localStorage.getItem("userWeight");
    const storedHeight = localStorage.getItem("userHeight");
    if (storedWeight && storedHeight) {
      setWeight(storedWeight);
      setHeight(storedHeight);
      calculateBMI(parseFloat(storedWeight), parseFloat(storedHeight));
    }
  }, []);

  const calculateBMI = (weightKg: number, heightCm: number) => {
    if (weightKg > 0 && heightCm > 0) {
      const heightM = heightCm / 100;
      const bmiValue = weightKg / (heightM * heightM);
      setBmi(bmiValue);

      // Determine BMI category
      if (bmiValue < 18.5) {
        setBmiCategory("Underweight");
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory("Normal");
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory("Overweight");
      } else {
        setBmiCategory("Obese");
      }
    }
  };

  const handleCalculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum > 0 && heightNum > 0) {
      calculateBMI(weightNum, heightNum);
      // Save to localStorage
      localStorage.setItem("userWeight", weight);
      localStorage.setItem("userHeight", height);
    }
  };

  const getBMIColor = () => {
    if (!bmi) return "text-gray-600";
    if (bmi < 18.5) return "text-blue-600";
    if (bmi >= 18.5 && bmi < 25) return "text-green-600";
    if (bmi >= 25 && bmi < 30) return "text-orange-600";
    return "text-red-600";
  };

  const getBMIBgColor = () => {
    if (!bmi) return "bg-gray-100";
    if (bmi < 18.5) return "bg-blue-100";
    if (bmi >= 18.5 && bmi < 25) return "bg-green-100";
    if (bmi >= 25 && bmi < 30) return "bg-orange-100";
    return "bg-red-100";
  };

  const waterPercentage = Math.min((waterIntake / waterGoal) * 100, 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-blue-600">Fit Buddy</h1>
        <p className="text-gray-600">Your daily wellness companion</p>
      </div>

      {/* Daily Wellness Tip */}
      <Card className="bg-linear-to-br from-purple-500 to-pink-500 text-white p-6 border-0">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">Daily Wellness Tip</h3>
            <p className="text-white/90">{dailyTip}</p>
          </div>
        </div>
      </Card>

      {/* BMI Calculator */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 ${getBMIBgColor()} rounded-lg`}>
            <Scale className={`w-6 h-6 ${getBMIColor()}`} />
          </div>
          <div>
            <h3 className="text-gray-900">BMI Calculator</h3>
            <p className="text-gray-500">Track your body mass index</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <Input
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <Input
                type="number"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <Button
            onClick={handleCalculateBMI}
            className="w-full"
            disabled={!weight || !height}
          >
            Calculate BMI
          </Button>

          {bmi !== null && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Your BMI:</span>
                <span className={`text-2xl font-bold ${getBMIColor()}`}>
                  {bmi.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Category:</span>
                <span className={`font-semibold ${getBMIColor()}`}>
                  {bmiCategory}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  {bmi < 18.5 &&
                    "You may be underweight. Consider consulting a healthcare professional."}
                  {bmi >= 18.5 &&
                    bmi < 25 &&
                    "You have a healthy weight. Keep up the good work!"}
                  {bmi >= 25 &&
                    bmi < 30 &&
                    "You may be overweight. Consider a balanced diet and regular exercise."}
                  {bmi >= 30 &&
                    "You may be obese. Consult a healthcare professional for guidance."}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water Intake Goal */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Water Intake</h3>
              <p className="text-gray-500">Daily Goal: {waterGoal}ml</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {waterIntake}ml / {waterGoal}ml
              </span>
              <span className="text-blue-600">
                {Math.round(waterPercentage)}%
              </span>
            </div>
            <Progress value={waterPercentage} className="h-3" />
          </div>
        </Card>

        {/* Last Exercise Calories */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Last Exercise</h3>
              <p className="text-gray-500">Calories Burned</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-orange-600">{lastExerciseCalories}</span>
              <span className="text-gray-500">calories</span>
            </div>
            {lastExerciseCalories === 0 && (
              <p className="text-gray-400">No recent exercise logged</p>
            )}
          </div>
        </Card>
      </div>

      {/* Motivational Section */}
      <Card className="p-6 bg-linear-to-r from-green-50 to-blue-50 border-green-200">
        <h3 className="text-gray-900 mb-2">Keep Going!</h3>
        <p className="text-gray-600">
          Every small step counts towards a healthier you. Stay consistent and
          celebrate your progress!
        </p>
      </Card>
    </div>
  );
}
