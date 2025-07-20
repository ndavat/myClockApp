import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Notifications from 'expo-notifications';

const TimerScreen: React.FC = () => {
  const { colors } = useTheme();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const presetTimes = [
    { label: '1 min', hours: 0, minutes: 1, seconds: 0 },
    { label: '3 min', hours: 0, minutes: 3, seconds: 0 },
    { label: '5 min', hours: 0, minutes: 5, seconds: 0 },
    { label: '10 min', hours: 0, minutes: 10, seconds: 0 },
    { label: '15 min', hours: 0, minutes: 15, seconds: 0 },
    { label: '30 min', hours: 0, minutes: 30, seconds: 0 },
    { label: '45 min', hours: 0, minutes: 45, seconds: 0 },
    { label: '1 hour', hours: 1, minutes: 0, seconds: 0 },
  ];

  useEffect(() => {
    if (isRunning && !isPaused && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            showTimerFinishedAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, totalSeconds]);

  const showTimerFinishedAlert = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Timer Finished',
        body: 'Your timer has completed!',
        sound: 'default',
      },
      trigger: null,
    });

    Alert.alert(
      'Timer Finished!',
      'Your timer has completed.',
      [{ text: 'OK', onPress: () => {} }]
    );
  };

  const startTimer = () => {
    if (totalSeconds === 0) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total === 0) {
        Alert.alert('Invalid Time', 'Please set a valid time for the timer.');
        return;
      }
      setTotalSeconds(total);
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTotalSeconds(0);
  };

  const setPresetTime = (preset: typeof presetTimes[0]) => {
    if (!isRunning) {
      setHours(preset.hours);
      setMinutes(preset.minutes);
      setSeconds(preset.seconds);
      setTotalSeconds(0);
    }
  };

  const formatTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getDisplayTime = () => {
    if (isRunning || isPaused) {
      return formatTime(totalSeconds);
    }
    return formatTime(hours * 3600 + minutes * 60 + seconds);
  };

  const getProgress = () => {
    if (!isRunning && !isPaused) return 0;
    const initialTotal = hours * 3600 + minutes * 60 + seconds;
    if (initialTotal === 0) return 0;
    return ((initialTotal - totalSeconds) / initialTotal) * 100;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    timerContainer: {
      alignItems: 'center',
      paddingVertical: 40,
      backgroundColor: colors.surface,
    },
    timerDisplay: {
      fontSize: 64,
      fontWeight: 'bold',
      color: colors.primary,
      fontFamily: 'monospace',
      marginBottom: 20,
    },
    progressBar: {
      width: '80%',
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      marginBottom: 20,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 20,
      gap: 20,
    },
    controlButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 25,
      minWidth: 100,
      alignItems: 'center',
    },
    controlButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    pauseButton: {
      backgroundColor: colors.accent,
    },
    resetButton: {
      backgroundColor: colors.textSecondary,
    },
    setTimeButton: {
      backgroundColor: colors.primary,
      margin: 20,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    setTimeButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    presetsContainer: {
      paddingHorizontal: 20,
    },
    presetsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 15,
    },
    presetsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    presetButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 10,
      marginBottom: 10,
      width: '48%',
      alignItems: 'center',
    },
    presetButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: colors.background,
      margin: 20,
      borderRadius: 10,
      padding: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    timePickerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    timePicker: {
      alignItems: 'center',
      marginHorizontal: 15,
    },
    timePickerLabel: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 10,
    },
    timePickerValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.primary,
      fontFamily: 'monospace',
      minWidth: 60,
      textAlign: 'center',
    },
    timePickerButtons: {
      flexDirection: 'row',
      marginTop: 10,
    },
    timePickerButton: {
      backgroundColor: colors.primary,
      padding: 8,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    modalButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 10,
      borderRadius: 5,
    },
    modalButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerDisplay}>{getDisplayTime()}</Text>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${getProgress()}%` }]} 
          />
        </View>
      </View>

      <View style={styles.controlsContainer}>
        {!isRunning ? (
          <TouchableOpacity style={styles.controlButton} onPress={startTimer}>
            <Text style={styles.controlButtonText}>Start</Text>
          </TouchableOpacity>
        ) : isPaused ? (
          <TouchableOpacity style={styles.controlButton} onPress={resumeTimer}>
            <Text style={styles.controlButtonText}>Resume</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.controlButton, styles.pauseButton]} onPress={pauseTimer}>
            <Text style={styles.controlButtonText}>Pause</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={[styles.controlButton, styles.resetButton]} onPress={resetTimer}>
          <Text style={styles.controlButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {!isRunning && (
        <>
          <TouchableOpacity style={styles.setTimeButton} onPress={() => setShowModal(true)}>
            <Text style={styles.setTimeButtonText}>Set Custom Time</Text>
          </TouchableOpacity>

          <View style={styles.presetsContainer}>
            <Text style={styles.presetsTitle}>Quick Presets</Text>
            <View style={styles.presetsGrid}>
              {presetTimes.map((preset, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.presetButton}
                  onPress={() => setPresetTime(preset)}
                >
                  <Text style={styles.presetButtonText}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Timer</Text>
            
            <View style={styles.timePickerContainer}>
              <View style={styles.timePicker}>
                <Text style={styles.timePickerLabel}>Hours</Text>
                <Text style={styles.timePickerValue}>
                  {hours.toString().padStart(2, '0')}
                </Text>
                <View style={styles.timePickerButtons}>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setHours(hours > 0 ? hours - 1 : 23)}
                  >
                    <Icon name="keyboard-arrow-left" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setHours(hours < 23 ? hours + 1 : 0)}
                  >
                    <Icon name="keyboard-arrow-right" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.timePicker}>
                <Text style={styles.timePickerLabel}>Minutes</Text>
                <Text style={styles.timePickerValue}>
                  {minutes.toString().padStart(2, '0')}
                </Text>
                <View style={styles.timePickerButtons}>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setMinutes(minutes > 0 ? minutes - 1 : 59)}
                  >
                    <Icon name="keyboard-arrow-left" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setMinutes(minutes < 59 ? minutes + 1 : 0)}
                  >
                    <Icon name="keyboard-arrow-right" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.timePicker}>
                <Text style={styles.timePickerLabel}>Seconds</Text>
                <Text style={styles.timePickerValue}>
                  {seconds.toString().padStart(2, '0')}
                </Text>
                <View style={styles.timePickerButtons}>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setSeconds(seconds > 0 ? seconds - 1 : 59)}
                  >
                    <Icon name="keyboard-arrow-left" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setSeconds(seconds < 59 ? seconds + 1 : 0)}
                  >
                    <Icon name="keyboard-arrow-right" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => {
                  setShowModal(false);
                  setTotalSeconds(0);
                }}
              >
                <Text style={styles.modalButtonText}>Set Timer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimerScreen;