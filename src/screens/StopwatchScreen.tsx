import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface LapTime {
  id: number;
  time: number;
  lapTime: number;
}

const StopwatchScreen: React.FC = () => {
  const { colors } = useTheme();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastLapTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
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
  }, [isRunning]);

  const startStopwatch = () => {
    setIsRunning(true);
  };

  const pauseStopwatch = () => {
    setIsRunning(false);
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    lastLapTimeRef.current = 0;
  };

  const addLap = () => {
    if (isRunning) {
      const lapTime = time - lastLapTimeRef.current;
      const newLap: LapTime = {
        id: laps.length + 1,
        time: time,
        lapTime: lapTime,
      };
      setLaps(prevLaps => [newLap, ...prevLaps]);
      lastLapTimeRef.current = time;
    }
  };

  const formatTime = (timeMs: number, showMilliseconds: boolean = true) => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeMs % 1000) / 10);

    if (showMilliseconds) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const getFastestLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((fastest, current) => 
      current.lapTime < fastest.lapTime ? current : fastest
    );
  };

  const getSlowestLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((slowest, current) => 
      current.lapTime > slowest.lapTime ? current : slowest
    );
  };

  const renderLapItem = ({ item }: { item: LapTime }) => {
    const fastestLap = getFastestLap();
    const slowestLap = getSlowestLap();
    
    let lapStyle = {};
    if (laps.length > 1) {
      if (item.id === fastestLap?.id) {
        lapStyle = { color: '#4CAF50' }; // Green for fastest
      } else if (item.id === slowestLap?.id) {
        lapStyle = { color: '#F44336' }; // Red for slowest
      }
    }

    return (
      <View style={styles.lapItem}>
        <Text style={styles.lapNumber}>Lap {item.id}</Text>
        <View style={styles.lapTimes}>
          <Text style={[styles.lapTime, lapStyle]}>
            {formatTime(item.lapTime)}
          </Text>
          <Text style={styles.totalTime}>
            {formatTime(item.time)}
          </Text>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    stopwatchContainer: {
      alignItems: 'center',
      paddingVertical: 60,
      backgroundColor: colors.surface,
    },
    timeDisplay: {
      fontSize: 72,
      fontWeight: 'bold',
      color: colors.primary,
      fontFamily: 'monospace',
      marginBottom: 40,
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 30,
      gap: 30,
    },
    controlButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    startButton: {
      backgroundColor: '#4CAF50',
    },
    pauseButton: {
      backgroundColor: '#FF9800',
    },
    resetButton: {
      backgroundColor: '#F44336',
    },
    lapButton: {
      backgroundColor: colors.primary,
    },
    controlButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    lapsContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    lapsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lapsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    lapCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    lapsList: {
      flex: 1,
    },
    lapItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lapNumber: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    lapTimes: {
      alignItems: 'flex-end',
    },
    lapTime: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'monospace',
    },
    totalTime: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: 'monospace',
      marginTop: 2,
    },
    emptyLaps: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    emptyLapsText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 15,
      backgroundColor: colors.surface,
      marginBottom: 10,
    },
    statItem: {
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 5,
    },
    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'monospace',
    },
    fastestStat: {
      color: '#4CAF50',
    },
    slowestStat: {
      color: '#F44336',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.stopwatchContainer}>
        <Text style={styles.timeDisplay}>{formatTime(time)}</Text>
      </View>

      <View style={styles.controlsContainer}>
        {!isRunning ? (
          <TouchableOpacity 
            style={[styles.controlButton, styles.startButton]} 
            onPress={startStopwatch}
          >
            <Icon name="play-arrow" size={32} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.controlButton, styles.pauseButton]} 
            onPress={pauseStopwatch}
          >
            <Icon name="pause" size={32} color="white" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.lapButton]} 
          onPress={addLap}
          disabled={!isRunning}
        >
          <Icon name="flag" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.resetButton]} 
          onPress={resetStopwatch}
        >
          <Icon name="refresh" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.lapsContainer}>
        {laps.length > 0 ? (
          <>
            <View style={styles.lapsHeader}>
              <Text style={styles.lapsTitle}>Laps</Text>
              <Text style={styles.lapCount}>{laps.length} laps</Text>
            </View>
            
            {laps.length > 1 && (
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>FASTEST</Text>
                  <Text style={[styles.statValue, styles.fastestStat]}>
                    {formatTime(getFastestLap()?.lapTime || 0)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>SLOWEST</Text>
                  <Text style={[styles.statValue, styles.slowestStat]}>
                    {formatTime(getSlowestLap()?.lapTime || 0)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>AVERAGE</Text>
                  <Text style={styles.statValue}>
                    {formatTime(laps.reduce((sum, lap) => sum + lap.lapTime, 0) / laps.length)}
                  </Text>
                </View>
              </View>
            )}
            
            <FlatList
              data={laps}
              renderItem={renderLapItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.lapsList}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyLaps}>
            <Icon name="timer" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyLapsText}>
              Start the stopwatch and tap the flag button to record laps
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default StopwatchScreen;