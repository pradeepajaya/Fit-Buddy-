import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  User,
  Mail,
  Calendar,
  Ruler,
  Weight,
  Target,
  Edit2,
  Save,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { useDarkMode } from "../hooks/useDarkMode";

interface UserProfile {
  name: string;
  email: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
  activityLevel: string;
}

export function ProfilePage() {
  const [isDark, setIsDark] = useDarkMode();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    age: "28",
    height: "175",
    weight: "70",
    goal: "Build Muscle & Stay Fit",
    activityLevel: "Moderately Active",
  });
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      setProfile(parsed);
      setEditedProfile(parsed);
    }
  }, []);

  const handleSave = () => {
    setProfile(editedProfile);
    localStorage.setItem("userProfile", JSON.stringify(editedProfile));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const calculateBMI = () => {
    const heightInMeters = parseFloat(profile.height) / 100;
    const weightInKg = parseFloat(profile.weight);
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5)
      return {
        text: "Underweight",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      };
    if (bmi < 25)
      return {
        text: "Normal",
        color: "bg-green-100 text-green-700 border-green-200",
      };
    if (bmi < 30)
      return {
        text: "Overweight",
        color: "bg-orange-100 text-orange-700 border-orange-200",
      };
    return { text: "Obese", color: "bg-red-100 text-red-700 border-red-200" };
  };

  const bmi = parseFloat(calculateBMI());
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-blue-600">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        <div className="flex gap-2">
          {/* Dark Mode Toggle */}
          <Button
            onClick={() => setIsDark(!isDark)}
            variant="outline"
            size="icon"
            className="w-10 h-10"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-white/30">
            <AvatarFallback className="text-blue-600 bg-white">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-white mb-1">{profile.name}</h2>
            <p className="text-white/80 mb-3">{profile.email}</p>
            <Badge className="bg-white/20 text-white border-white/30">
              {profile.activityLevel}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-2 text-gray-700"
            >
              <User className="w-4 h-4" />
              Full Name
            </Label>
            {isEditing ? (
              <Input
                id="name"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-900 p-2 bg-gray-50 rounded">
                {profile.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 text-gray-700"
            >
              <Mail className="w-4 h-4" />
              Email
            </Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={editedProfile.email}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, email: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-900 p-2 bg-gray-50 rounded">
                {profile.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="age"
              className="flex items-center gap-2 text-gray-700"
            >
              <Calendar className="w-4 h-4" />
              Age
            </Label>
            {isEditing ? (
              <Input
                id="age"
                type="number"
                value={editedProfile.age}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, age: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-900 p-2 bg-gray-50 rounded">
                {profile.age} years
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="height"
              className="flex items-center gap-2 text-gray-700"
            >
              <Ruler className="w-4 h-4" />
              Height (cm)
            </Label>
            {isEditing ? (
              <Input
                id="height"
                type="number"
                value={editedProfile.height}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, height: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-900 p-2 bg-gray-50 rounded">
                {profile.height} cm
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="weight"
              className="flex items-center gap-2 text-gray-700"
            >
              <Weight className="w-4 h-4" />
              Weight (kg)
            </Label>
            {isEditing ? (
              <Input
                id="weight"
                type="number"
                value={editedProfile.weight}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, weight: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-900 p-2 bg-gray-50 rounded">
                {profile.weight} kg
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="goal"
              className="flex items-center gap-2 text-gray-700"
            >
              <Target className="w-4 h-4" />
              Fitness Goal
            </Label>
            {isEditing ? (
              <Input
                id="goal"
                value={editedProfile.goal}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, goal: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-900 p-2 bg-gray-50 rounded">
                {profile.goal}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <h4 className="text-gray-600 mb-2">BMI</h4>
          <p className="text-blue-600 mb-2">{calculateBMI()}</p>
          <Badge className={bmiCategory.color}>{bmiCategory.text}</Badge>
        </Card>

        <Card className="p-6 text-center">
          <h4 className="text-gray-600 mb-2">Target Weight</h4>
          <p className="text-green-600 mb-2">68 kg</p>
          <p className="text-gray-500">2 kg to go</p>
        </Card>

        <Card className="p-6 text-center">
          <h4 className="text-gray-600 mb-2">Weekly Goal</h4>
          <p className="text-purple-600 mb-2">5 Workouts</p>
          <p className="text-gray-500">Stay active</p>
        </Card>
      </div>

      {/* Activity Level */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Activity Level</h3>
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="activityLevel" className="text-gray-700">
              Select your activity level
            </Label>
            <select
              id="activityLevel"
              value={editedProfile.activityLevel}
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  activityLevel: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option>Sedentary</option>
              <option>Lightly Active</option>
              <option>Moderately Active</option>
              <option>Very Active</option>
              <option>Extremely Active</option>
            </select>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {[
              "Sedentary",
              "Lightly Active",
              "Moderately Active",
              "Very Active",
              "Extremely Active",
            ].map((level) => (
              <Badge
                key={level}
                variant={
                  level === profile.activityLevel ? "default" : "outline"
                }
                className={level === profile.activityLevel ? "bg-blue-600" : ""}
              >
                {level}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Preferences */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-gray-900 mb-3">App Preferences</h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center justify-between p-2">
            <span>Daily Water Goal</span>
            <span className="text-blue-600">2000 ml</span>
          </div>
          <div className="flex items-center justify-between p-2">
            <span>Daily Calorie Goal</span>
            <span className="text-blue-600">2000 kcal</span>
          </div>
          <div className="flex items-center justify-between p-2">
            <span>Weekly Workout Goal</span>
            <span className="text-blue-600">5 sessions</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
