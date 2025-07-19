import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Alarm {
  id: string;
  time: string;
  title: string;
  isActive: boolean;
  sound: string;
  repeat: boolean;
}

const AlarmScreen: React.FC = () => {
  const { colors } = useTheme();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [alarmTitle, setAlarmTitle] = useState('Alarm');
  const [selectedSound, setSelectedSound] = useState('default');
  const [repeatSound, setRepeatSound] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    loadAlarms();
    setupNotifications();

    return () => clearInterval(timer);
  }, []);

  const setupNotifications = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      requestPermissions: true,
    });
  };

  const loadAlarms = async () => {
    try {
      const savedAlarms = await AsyncStorage.getItem('alarms');
      if (savedAlarms) {
        setAlarms(JSON.parse(savedAlarms));
      }
    } catch (error) {
      console.log('Error loading alarms:', error);
    }
  };

  const saveAlarms = async (newAlarms: Alarm[]) => {
    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(newAlarms));
    } catch (error) {
      console.log('Error saving alarms:', error);
    }
  };

  const addAlarm = () => {
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: timeString,
      title: alarmTitle,
      isActive: true,
      sound: selectedSound,
      repeat: repeatSound,
    };

    const updatedAlarms = [...alarms, newAlarm];
    setAlarms(updatedAlarms);
    saveAlarms(updatedAlarms);
    scheduleNotification(newAlarm);
    setShowModal(false);
    resetForm();
  };

  const scheduleNotification = (alarm: Alarm) => {
    const [hour, minute] = alarm.time.split(':').map(Number);
    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(hour, minute, 0, 0);

    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      id: alarm.id,
      title: 'Alarm',
      message: alarm.title,
      date: alarmTime,
      soundName: 'default',
      repeatType: alarm.repeat ? 'day' : undefined,
    });
  };

  const toggleAlarm = (id: string) => {
    const updatedAlarms = alarms.map(alarm => {
      if (alarm.id === id) {
        const updated = { ...alarm, isActive: !alarm.isActive };
        if (updated.isActive) {
          scheduleNotification(updated);
        } else {
          PushNotification.cancelLocalNotification(id);
        }
        return updated;
      }
      return alarm;
    });
    setAlarms(updatedAlarms);
    saveAlarms(updatedAlarms);
  };

  const deleteAlarm = (id: string) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            PushNotification.cancelLocalNotification(id);
            const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
            setAlarms(updatedAlarms);
            saveAlarms(updatedAlarms);
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setSelectedHour(7);
    setSelectedMinute(0);
    setAlarmTitle('Alarm');
    setSelectedSound('default');
    setRepeatSound(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    timeContainer: {
      alignItems: 'center',
      paddingVertical: 40,
      backgroundColor: colors.surface,
    },
    currentTime: {
      fontSize: 48,
      fontWeight: 'bold',
      color: colors.primary,
      fontFamily: 'monospace',
    },
    currentDate: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
    },
    addButton: {
      backgroundColor: colors.primary,
      margin: 20,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    addButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    alarmsList: {
      flex: 1,
      paddingHorizontal: 20,
    },
    alarmItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: 15,
      marginVertical: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    alarmTime: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'monospace',
    },
    alarmTitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 2,
    },
    alarmInfo: {
      flex: 1,
      marginLeft: 15,
    },
    alarmActions: {
      flexDirection: 'row',
      alignItems: 'center',
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
      marginBottom: 20,
    },
    timePicker: {
      alignItems: 'center',
      marginHorizontal: 20,
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
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    switchLabel: {
      fontSize: 16,
      color: colors.text,
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
      <View style={styles.timeContainer}>
        <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
        <Text style={styles.currentDate}>{formatDate(currentTime)}</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>+ Set Alarm</Text>
      </TouchableOpacity>

      <ScrollView style={styles.alarmsList}>
        {alarms.map((alarm) => (
          <View key={alarm.id} style={styles.alarmItem}>
            <View style={styles.alarmInfo}>
              <Text style={styles.alarmTime}>{alarm.time}</Text>
              <Text style={styles.alarmTitle}>{alarm.title}</Text>
            </View>
            <View style={styles.alarmActions}>
              <Switch
                value={alarm.isActive}
                onValueChange={() => toggleAlarm(alarm.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
              <TouchableOpacity
                onPress={() => deleteAlarm(alarm.id)}
                style={{ marginLeft: 15 }}
              >
                <Icon name="delete" size={24} color={colors.accent} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Alarm</Text>
            
            <View style={styles.timePickerContainer}>
              <View style={styles.timePicker}>
                <Text style={styles.timePickerLabel}>Hour</Text>
                <Text style={styles.timePickerValue}>
                  {selectedHour.toString().padStart(2, '0')}
                </Text>
                <View style={styles.timePickerButtons}>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setSelectedHour(selectedHour > 0 ? selectedHour - 1 : 23)}
                  >
                    <Icon name="keyboard-arrow-left" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setSelectedHour(selectedHour < 23 ? selectedHour + 1 : 0)}
                  >
                    <Icon name="keyboard-arrow-right" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={[styles.timePickerValue, { fontSize: 40 }]}>:</Text>
              
              <View style={styles.timePicker}>
                <Text style={styles.timePickerLabel}>Minute</Text>
                <Text style={styles.timePickerValue}>
                  {selectedMinute.toString().padStart(2, '0')}
                </Text>
                <View style={styles.timePickerButtons}>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setSelectedMinute(selectedMinute > 0 ? selectedMinute - 1 : 59)}
                  >
                    <Icon name="keyboard-arrow-left" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setSelectedMinute(selectedMinute < 59 ? selectedMinute + 1 : 0)}
                  >
                    <Icon name="keyboard-arrow-right" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Alarm Title"
              placeholderTextColor={colors.textSecondary}
              value={alarmTitle}
              onChangeText={setAlarmTitle}
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Repeat Daily</Text>
              <Switch
                value={repeatSound}
                onValueChange={setRepeatSound}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={addAlarm}>
                <Text style={styles.modalButtonText}>Set Alarm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AlarmScreen;