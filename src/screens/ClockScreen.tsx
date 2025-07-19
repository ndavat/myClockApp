import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ClockSettings {
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  digitalFont: boolean;
  fontSize: 'small' | 'medium' | 'large';
  colorTheme: string;
}

const ClockScreen: React.FC = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [settings, setSettings] = useState<ClockSettings>({
    is24Hour: false,
    showSeconds: true,
    showDate: true,
    digitalFont: true,
    fontSize: 'large',
    colorTheme: 'blue',
  });
  const [showSettings, setShowSettings] = useState(false);

  const colorThemes = {
    blue: '#1565c0',
    red: '#d32f2f',
    green: '#388e3c',
    purple: '#7b1fa2',
    orange: '#f57c00',
    teal: '#00796b',
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    loadSettings();

    return () => clearInterval(timer);
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('clockSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log('Error loading clock settings:', error);
    }
  };

  const saveSettings = async (newSettings: ClockSettings) => {
    try {
      await AsyncStorage.setItem('clockSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving clock settings:', error);
    }
  };

  const updateSetting = (key: keyof ClockSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !settings.is24Hour,
    };

    if (settings.showSeconds) {
      options.second = '2-digit';
    }

    return date.toLocaleTimeString([], options);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeZoneInfo = () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = currentTime.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetSign = offset <= 0 ? '+' : '-';
    
    return {
      name: timeZone,
      offset: `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`,
    };
  };

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small':
        return 48;
      case 'medium':
        return 64;
      case 'large':
        return 80;
      default:
        return 64;
    }
  };

  const getCurrentColor = () => {
    return colorThemes[settings.colorTheme as keyof typeof colorThemes] || colors.primary;
  };

  const timeZoneInfo = getTimeZoneInfo();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    clockContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    timeDisplay: {
      fontSize: getFontSize(),
      fontWeight: 'bold',
      color: getCurrentColor(),
      fontFamily: settings.digitalFont ? 'monospace' : 'System',
      textAlign: 'center',
      marginBottom: 20,
    },
    dateDisplay: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 10,
    },
    timezoneDisplay: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    settingsButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 25,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    settingsPanel: {
      backgroundColor: colors.surface,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '60%',
    },
    settingsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    settingsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 5,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
    },
    settingDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    fontSizeContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    fontSizeButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.border,
    },
    fontSizeButtonActive: {
      backgroundColor: getCurrentColor(),
      borderColor: getCurrentColor(),
    },
    fontSizeButtonText: {
      color: colors.text,
      fontSize: 14,
    },
    fontSizeButtonTextActive: {
      color: 'white',
    },
    colorThemeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 10,
    },
    colorButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorButtonActive: {
      borderColor: colors.text,
    },
    worldClockContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    worldClockTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 15,
    },
    worldClockItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    worldClockCity: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    worldClockTime: {
      fontSize: 16,
      color: colors.textSecondary,
      fontFamily: 'monospace',
    },
  });

  const worldClockCities = [
    { name: 'New York', timezone: 'America/New_York' },
    { name: 'London', timezone: 'Europe/London' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' },
    { name: 'Sydney', timezone: 'Australia/Sydney' },
    { name: 'Dubai', timezone: 'Asia/Dubai' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  ];

  const getWorldClockTime = (timezone: string) => {
    const date = new Date();
    return date.toLocaleTimeString([], {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: !settings.is24Hour,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setShowSettings(!showSettings)}
      >
        <Icon name="settings" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.clockContainer}>
        <Text style={styles.timeDisplay}>{formatTime(currentTime)}</Text>
        {settings.showDate && (
          <Text style={styles.dateDisplay}>{formatDate(currentTime)}</Text>
        )}
        <Text style={styles.timezoneDisplay}>
          {timeZoneInfo.name} ({timeZoneInfo.offset})
        </Text>
      </View>

      {!showSettings && (
        <View style={styles.worldClockContainer}>
          <Text style={styles.worldClockTitle}>World Clock</Text>
          {worldClockCities.map((city, index) => (
            <View key={index} style={styles.worldClockItem}>
              <Text style={styles.worldClockCity}>{city.name}</Text>
              <Text style={styles.worldClockTime}>
                {getWorldClockTime(city.timezone)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {showSettings && (
        <View style={styles.settingsPanel}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Clock Settings</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
            >
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>24-Hour Format</Text>
                <Text style={styles.settingDescription}>
                  Use 24-hour time format instead of AM/PM
                </Text>
              </View>
              <Switch
                value={settings.is24Hour}
                onValueChange={(value) => updateSetting('is24Hour', value)}
                trackColor={{ false: colors.border, true: getCurrentColor() }}
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>Show Seconds</Text>
                <Text style={styles.settingDescription}>
                  Display seconds in the time
                </Text>
              </View>
              <Switch
                value={settings.showSeconds}
                onValueChange={(value) => updateSetting('showSeconds', value)}
                trackColor={{ false: colors.border, true: getCurrentColor() }}
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>Show Date</Text>
                <Text style={styles.settingDescription}>
                  Display the current date below the time
                </Text>
              </View>
              <Switch
                value={settings.showDate}
                onValueChange={(value) => updateSetting('showDate', value)}
                trackColor={{ false: colors.border, true: getCurrentColor() }}
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>Digital Font</Text>
                <Text style={styles.settingDescription}>
                  Use monospace font for digital clock appearance
                </Text>
              </View>
              <Switch
                value={settings.digitalFont}
                onValueChange={(value) => updateSetting('digitalFont', value)}
                trackColor={{ false: colors.border, true: getCurrentColor() }}
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>Night Mode</Text>
                <Text style={styles.settingDescription}>
                  Toggle between light and dark theme
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: getCurrentColor() }}
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>Font Size</Text>
                <Text style={styles.settingDescription}>
                  Adjust the size of the clock display
                </Text>
              </View>
              <View style={styles.fontSizeContainer}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.fontSizeButton,
                      settings.fontSize === size && styles.fontSizeButtonActive,
                    ]}
                    onPress={() => updateSetting('fontSize', size)}
                  >
                    <Text
                      style={[
                        styles.fontSizeButtonText,
                        settings.fontSize === size && styles.fontSizeButtonTextActive,
                      ]}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>Color Theme</Text>
                <Text style={styles.settingDescription}>
                  Choose a color for the clock display
                </Text>
              </View>
            </View>
            <View style={styles.colorThemeContainer}>
              {Object.entries(colorThemes).map(([name, color]) => (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    settings.colorTheme === name && styles.colorButtonActive,
                  ]}
                  onPress={() => updateSetting('colorTheme', name)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ClockScreen;