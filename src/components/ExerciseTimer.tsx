import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContextRN";

interface ExerciseTimerProps {
  exerciseName: string;
  duration?: number; // in minutes
  onComplete?: () => void;
}

export function ExerciseTimer({
  exerciseName,
  duration = 30,
  onComplete,
}: ExerciseTimerProps) {
  const { colors } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [totalTime] = useState(duration * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onComplete) onComplete();
            Alert.alert(
              "Timer Complete! 🎉",
              `Great job completing ${exerciseName}!`,
              [{ text: "OK" }]
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeLeft, exerciseName, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(totalTime);
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Feather name="clock" size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Exercise Timer
        </Text>
      </View>

      {/* Circular Progress */}
      <View style={styles.timerContainer}>
        <View style={styles.circleContainer}>
          <View
            style={[
              styles.progressCircle,
              {
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  height: `${progress}%`,
                },
              ]}
            />
          </View>
          <View style={styles.timeDisplay}>
            <Text style={[styles.timeText, { color: colors.text }]}>
              {formatTime(timeLeft)}
            </Text>
            <Text
              style={[styles.totalTimeText, { color: colors.textSecondary }]}
            >
              / {formatTime(totalTime)}
            </Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity
            style={[
              styles.button,
              styles.startButton,
              { backgroundColor: colors.success },
            ]}
            onPress={handleStart}
          >
            <Feather name="play" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isPaused ? colors.success : colors.warning },
              ]}
              onPress={handlePause}
            >
              <Feather
                name={isPaused ? "play" : "pause"}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.buttonText}>
                {isPaused ? "Resume" : "Pause"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.error }]}
              onPress={handleReset}
            >
              <Feather name="rotate-ccw" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  timerContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  circleContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    overflow: "hidden",
    position: "absolute",
  },
  progressFill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 100,
  },
  timeDisplay: {
    alignItems: "center",
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  totalTimeText: {
    fontSize: 14,
    marginTop: 4,
  },
  controls: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  startButton: {
    flex: 1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
