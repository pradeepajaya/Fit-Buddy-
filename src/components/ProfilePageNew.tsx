import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import * as Icons from "react-feather";

interface UserProfile {
  name: string;
  email: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
  activityLevel: string;
}

type ThemeMode = "light" | "dark" | "system";

export function ProfilePageNew() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "Alex Johnson",
    email: user?.email || "alex.johnson@email.com",
    age: "28",
    height: "175",
    weight: "70",
    goal: "Build Muscle & Stay Fit",
    activityLevel: "Moderately Active",
  });
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  useEffect(() => {
    // Load profile from localStorage
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      setProfile(parsed);
      setEditedProfile(parsed);
    } else if (user) {
      // Update with user data from auth
      const updatedProfile = { ...profile, name: user.name, email: user.email };
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
    }

    // Load theme preference
    const storedTheme = localStorage.getItem("theme") as ThemeMode;
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    }

    // Load notification preferences
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }

    const storedEmailUpdates = localStorage.getItem("emailUpdates");
    if (storedEmailUpdates) {
      setEmailUpdates(JSON.parse(storedEmailUpdates));
    }
  }, [user]);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    localStorage.setItem("userProfile", JSON.stringify(editedProfile));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem("notifications", JSON.stringify(checked));
  };

  const handleEmailUpdatesToggle = (checked: boolean) => {
    setEmailUpdates(checked);
    localStorage.setItem("emailUpdates", JSON.stringify(checked));
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
    <div className="p-6 space-y-6 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and settings
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Icons.Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline">
              <Icons.X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Icons.Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-white/30">
            <AvatarFallback className="text-blue-600 bg-white text-2xl">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">
              {profile.name}
            </h2>
            <p className="text-white/80 mb-3">{profile.email}</p>
            <Badge className="bg-white/20 text-white border-white/30">
              {profile.activityLevel}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Icons.User className="w-4 h-4" />
              Full Name
            </Label>
            {isEditing ? (
              <Input
                id="name"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
                className="dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                {profile.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Icons.Mail className="w-4 h-4" />
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
                className="dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                {profile.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="age"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Icons.Calendar className="w-4 h-4" />
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
                className="dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                {profile.age} years
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="height"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Icons.Move className="w-4 h-4" />
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
                className="dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                {profile.height} cm
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="weight"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Icons.Activity className="w-4 h-4" />
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
                className="dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                {profile.weight} kg
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="goal"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Icons.Target className="w-4 h-4" />
              Fitness Goal
            </Label>
            {isEditing ? (
              <Input
                id="goal"
                value={editedProfile.goal}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, goal: e.target.value })
                }
                className="dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                {profile.goal}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center dark:bg-gray-800 dark:border-gray-700">
          <h4 className="text-gray-600 dark:text-gray-400 mb-2">BMI</h4>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {calculateBMI()}
          </p>
          <Badge className={bmiCategory.color}>{bmiCategory.text}</Badge>
        </Card>

        <Card className="p-6 text-center dark:bg-gray-800 dark:border-gray-700">
          <h4 className="text-gray-600 dark:text-gray-400 mb-2">
            Target Weight
          </h4>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            68 kg
          </p>
          <p className="text-gray-500 dark:text-gray-400">2 kg to go</p>
        </Card>

        <Card className="p-6 text-center dark:bg-gray-800 dark:border-gray-700">
          <h4 className="text-gray-600 dark:text-gray-400 mb-2">Weekly Goal</h4>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            5
          </p>
          <p className="text-gray-500 dark:text-gray-400">Workouts</p>
        </Card>
      </div>

      {/* Settings Section */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Icons.Settings className="w-5 h-5" />
          Settings
        </h3>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mb-3 block font-semibold">
              Theme
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  theme === "light"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                }`}
              >
                <Icons.Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm font-medium dark:text-white">Light</p>
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  theme === "dark"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                }`}
              >
                <Icons.Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium dark:text-white">Dark</p>
              </button>
              <button
                onClick={() => handleThemeChange("system")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  theme === "system"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                }`}
              >
                <Icons.Monitor className="w-6 h-6 mx-auto mb-2 text-gray-500 dark:text-gray-400" />
                <p className="text-sm font-medium dark:text-white">System</p>
              </button>
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icons.Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <Label className="text-gray-900 dark:text-white font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive workout reminders
                </p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={handleNotificationsToggle}
            />
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Email Updates */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icons.Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <Label className="text-gray-900 dark:text-white font-medium">
                  Email Updates
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get weekly progress reports
                </p>
              </div>
            </div>
            <Switch
              checked={emailUpdates}
              onCheckedChange={handleEmailUpdatesToggle}
            />
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Logout Button */}
          <Button
            onClick={logout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Icons.LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
