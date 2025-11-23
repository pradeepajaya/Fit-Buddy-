import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Play, Pause, RotateCcw, Timer, X } from 'lucide-react';
import { Progress } from './ui/progress';

interface WorkoutTimerProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName?: string;
  onComplete?: (duration: number) => void;
}

export function WorkoutTimer({ isOpen, onClose, exerciseName, onComplete }: WorkoutTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'stopwatch' | 'countdown'>('stopwatch');
  const [countdownTarget, setCountdownTarget] = useState(300); // 5 minutes default
  const [intervalWorkout, setIntervalWorkout] = useState(false);
  const [workInterval, setWorkInterval] = useState(30);
  const [restInterval, setRestInterval] = useState(15);
  const [currentPhase, setCurrentPhase] = useState<'work' | 'rest'>('work');
  const [rounds, setRounds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'stopwatch') {
          setSeconds((prev) => prev + 1);
        } else if (mode === 'countdown') {
          setSeconds((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              playBeep();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  useEffect(() => {
    // Interval workout logic
    if (isRunning && intervalWorkout) {
      const phaseTime = currentPhase === 'work' ? workInterval : restInterval;
      
      if (seconds >= phaseTime) {
        playBeep();
        setSeconds(0);
        
        if (currentPhase === 'work') {
          setCurrentPhase('rest');
        } else {
          setCurrentPhase('work');
          setRounds((prev) => prev + 1);
        }
      }
    }
  }, [seconds, isRunning, intervalWorkout, currentPhase, workInterval, restInterval]);

  useEffect(() => {
    // Initialize audio
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjeP1vLNeSsFI3fH8N2RQAoUXrTp66hVFApGn+DyvmwhBjeP1vLNeSsFI3fH8N+RQAoUXrTp66hVFApGn+DyvmwhBjeP');
    }
  }, []);

  const playBeep = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore errors if audio can't play
      });
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(mode === 'countdown' ? countdownTarget : 0);
    setCurrentPhase('work');
    setRounds(0);
  };

  const handleComplete = () => {
    const duration = mode === 'stopwatch' ? seconds : countdownTarget;
    if (onComplete) {
      onComplete(Math.floor(duration / 60)); // Convert to minutes
    }
    handleClose();
  };

  const handleClose = () => {
    setIsRunning(false);
    setSeconds(0);
    setCurrentPhase('work');
    setRounds(0);
    onClose();
  };

  const getProgress = () => {
    if (mode === 'stopwatch') return 0;
    return ((countdownTarget - seconds) / countdownTarget) * 100;
  };

  const getIntervalProgress = () => {
    const phaseTime = currentPhase === 'work' ? workInterval : restInterval;
    return (seconds / phaseTime) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-600" />
            Workout Timer
            {exerciseName && ` - ${exerciseName}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'stopwatch' ? 'default' : 'outline'}
              onClick={() => {
                setMode('stopwatch');
                setSeconds(0);
                setIsRunning(false);
                setIntervalWorkout(false);
              }}
              className="flex-1"
            >
              Stopwatch
            </Button>
            <Button
              variant={mode === 'countdown' ? 'default' : 'outline'}
              onClick={() => {
                setMode('countdown');
                setSeconds(countdownTarget);
                setIsRunning(false);
                setIntervalWorkout(false);
              }}
              className="flex-1"
            >
              Countdown
            </Button>
            <Button
              variant={intervalWorkout ? 'default' : 'outline'}
              onClick={() => {
                setIntervalWorkout(!intervalWorkout);
                setMode('stopwatch');
                setSeconds(0);
                setIsRunning(false);
                setCurrentPhase('work');
                setRounds(0);
              }}
              className="flex-1"
            >
              Interval
            </Button>
          </div>

          {/* Countdown Settings */}
          {mode === 'countdown' && !isRunning && (
            <div>
              <label className="text-gray-700 mb-2 block">Set Duration</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCountdownTarget(300);
                    setSeconds(300);
                  }}
                >
                  5 min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCountdownTarget(600);
                    setSeconds(600);
                  }}
                >
                  10 min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCountdownTarget(1200);
                    setSeconds(1200);
                  }}
                >
                  20 min
                </Button>
              </div>
            </div>
          )}

          {/* Interval Settings */}
          {intervalWorkout && !isRunning && (
            <div className="space-y-3">
              <div>
                <label className="text-gray-700 mb-2 block">Work Interval (seconds)</label>
                <input
                  type="number"
                  value={workInterval}
                  onChange={(e) => setWorkInterval(parseInt(e.target.value) || 30)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="5"
                  max="300"
                />
              </div>
              <div>
                <label className="text-gray-700 mb-2 block">Rest Interval (seconds)</label>
                <input
                  type="number"
                  value={restInterval}
                  onChange={(e) => setRestInterval(parseInt(e.target.value) || 15)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="5"
                  max="300"
                />
              </div>
            </div>
          )}

          {/* Timer Display */}
          <Card className={`p-8 text-center ${
            intervalWorkout
              ? currentPhase === 'work'
                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          } text-white border-0`}>
            {intervalWorkout && (
              <div className="mb-2">
                <p className="text-white/80">
                  {currentPhase === 'work' ? '💪 WORK' : '😌 REST'}
                </p>
                <p className="text-white/80">Round {rounds + 1}</p>
              </div>
            )}
            <div className="text-white mb-4" style={{ fontSize: '3rem', lineHeight: 1 }}>
              {formatTime(seconds)}
            </div>
            {mode === 'countdown' && (
              <Progress value={getProgress()} className="h-2 bg-white/20" />
            )}
            {intervalWorkout && (
              <Progress value={getIntervalProgress()} className="h-2 bg-white/20 mt-2" />
            )}
          </Card>

          {/* Controls */}
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={handleStart} className="flex-1 bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} className="flex-1 bg-orange-600 hover:bg-orange-700">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Complete Button */}
          {seconds > 0 && !isRunning && (
            <Button onClick={handleComplete} className="w-full bg-blue-600 hover:bg-blue-700">
              Complete Workout
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
