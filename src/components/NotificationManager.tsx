import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Bell, BellOff, Droplets, Dumbbell, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface NotificationSettings {
  waterReminders: boolean;
  waterInterval: number; // in minutes
  exerciseReminders: boolean;
  exerciseTime: string;
  dailyTipReminder: boolean;
}

interface Reminder {
  id: string;
  type: 'water' | 'exercise' | 'tip';
  message: string;
  timestamp: number;
}

export function NotificationManager() {
  const [settings, setSettings] = useState<NotificationSettings>({
    waterReminders: true,
    waterInterval: 60,
    exerciseReminders: true,
    exerciseTime: '18:00',
    dailyTipReminder: true,
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    // Load settings from localStorage
    const storedSettings = localStorage.getItem('notificationSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Check for active reminders
    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        toast.success('Notifications enabled! You\'ll receive reminders based on your settings.');
      } else {
        toast.error('Notifications blocked. Please enable them in your browser settings.');
      }
    }
  };

  const checkReminders = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check water reminder
    if (settings.waterReminders) {
      const lastWaterReminder = localStorage.getItem('lastWaterReminder');
      const lastReminderTime = lastWaterReminder ? parseInt(lastWaterReminder) : 0;
      const timeSinceLastReminder = Date.now() - lastReminderTime;
      const intervalMs = settings.waterInterval * 60 * 1000;

      if (timeSinceLastReminder >= intervalMs) {
        showReminder('water', '💧 Time to hydrate! Remember to drink some water.');
        localStorage.setItem('lastWaterReminder', Date.now().toString());
      }
    }

    // Check exercise reminder
    if (settings.exerciseReminders && settings.exerciseTime) {
      const [targetHour, targetMinute] = settings.exerciseTime.split(':').map(Number);
      const lastExerciseReminder = localStorage.getItem('lastExerciseReminderDate');
      const today = now.toDateString();

      if (
        currentHour === targetHour &&
        currentMinute === targetMinute &&
        lastExerciseReminder !== today
      ) {
        showReminder('exercise', '💪 Time for your workout! Let\'s get moving.');
        localStorage.setItem('lastExerciseReminderDate', today);
      }
    }

    // Check daily tip reminder (once at 9 AM)
    if (settings.dailyTipReminder && currentHour === 9 && currentMinute === 0) {
      const lastTipReminder = localStorage.getItem('lastTipReminderDate');
      const today = now.toDateString();

      if (lastTipReminder !== today) {
        showReminder('tip', '✨ Check out today\'s wellness tip in Fit Buddy!');
        localStorage.setItem('lastTipReminderDate', today);
      }
    }
  };

  const showReminder = (type: 'water' | 'exercise' | 'tip', message: string) => {
    const reminder: Reminder = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now(),
    };

    setActiveReminder(reminder);

    // Show browser notification if permission granted
    if (notificationPermission === 'granted') {
      new Notification('Fit Buddy Reminder', {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }

    // Show toast notification
    toast.info(message, {
      duration: 5000,
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      setActiveReminder(null);
    }, 10000);
  };

  const dismissReminder = () => {
    setActiveReminder(null);
  };

  return (
    <>
      {/* In-app Reminder Banner */}
      {activeReminder && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg animate-in slide-in-from-top">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                {activeReminder.type === 'water' && <Droplets className="w-6 h-6" />}
                {activeReminder.type === 'exercise' && <Dumbbell className="w-6 h-6" />}
                {activeReminder.type === 'tip' && <Bell className="w-6 h-6" />}
                <p className="text-white">{activeReminder.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissReminder}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    waterReminders: true,
    waterInterval: 60,
    exerciseReminders: true,
    exerciseTime: '18:00',
    dailyTipReminder: true,
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const storedSettings = localStorage.getItem('notificationSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }

    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      }
    }
  };

  const testNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Fit Buddy Test', {
        body: 'This is a test notification! 🎉',
        icon: '/favicon.ico',
      });
      toast.success('Test notification sent!');
    } else {
      toast.error('Please enable notifications first');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-blue-600">Notification Settings</h1>
        <p className="text-gray-600">Manage your reminders and notifications</p>
      </div>
      
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900 mb-1">Browser Notifications</h3>
            <p className="text-gray-600">Enable browser notifications for reminders</p>
          </div>
          {notificationPermission === 'granted' ? (
            <Bell className="w-6 h-6 text-green-600" />
          ) : (
            <BellOff className="w-6 h-6 text-gray-400" />
          )}
        </div>

        {notificationPermission !== 'granted' && (
          <Button onClick={requestNotificationPermission} className="w-full bg-blue-600 hover:bg-blue-700">
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </Button>
        )}

        {notificationPermission === 'granted' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-700">Notifications Enabled</span>
              <Bell className="w-4 h-4 text-green-600" />
            </div>
            <Button onClick={testNotification} variant="outline" className="w-full">
              Send Test Notification
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Water Reminders</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="waterReminders" className="text-gray-700">Enable water reminders</Label>
            <Switch
              id="waterReminders"
              checked={settings.waterReminders}
              onCheckedChange={(checked) => setSettings({ ...settings, waterReminders: checked })}
            />
          </div>

          {settings.waterReminders && (
            <div>
              <Label htmlFor="waterInterval" className="text-gray-700 mb-2 block">
                Reminder interval (minutes)
              </Label>
              <select
                id="waterInterval"
                value={settings.waterInterval}
                onChange={(e) => setSettings({ ...settings, waterInterval: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every hour</option>
                <option value={90}>Every 90 minutes</option>
                <option value={120}>Every 2 hours</option>
              </select>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Exercise Reminders</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="exerciseReminders" className="text-gray-700">Enable exercise reminders</Label>
            <Switch
              id="exerciseReminders"
              checked={settings.exerciseReminders}
              onCheckedChange={(checked) => setSettings({ ...settings, exerciseReminders: checked })}
            />
          </div>

          {settings.exerciseReminders && (
            <div>
              <Label htmlFor="exerciseTime" className="text-gray-700 mb-2 block">
                Reminder time
              </Label>
              <input
                type="time"
                id="exerciseTime"
                value={settings.exerciseTime}
                onChange={(e) => setSettings({ ...settings, exerciseTime: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Daily Wellness Tips</h3>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dailyTipReminder" className="text-gray-700">Daily tip reminder</Label>
            <p className="text-gray-500">Get a reminder at 9:00 AM daily</p>
          </div>
          <Switch
            id="dailyTipReminder"
            checked={settings.dailyTipReminder}
            onCheckedChange={(checked) => setSettings({ ...settings, dailyTipReminder: checked })}
          />
        </div>
      </Card>
    </div>
  );
}