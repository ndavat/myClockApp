# myClock - Complete Alarm & Timer App

A comprehensive React Native implementation inspired by vClock.com, featuring alarm clock, timer, stopwatch, and world clock functionality for Android devices.

## 🚀 Features

### ⏰ Alarm Clock
- Set multiple alarms with custom times and titles
- Toggle alarms on/off individually
- Persistent alarm storage
- Background notifications when alarms trigger
- Repeat daily option for alarms
- Visual time picker with intuitive controls

### ⏲️ Timer
- Countdown timer with hours, minutes, and seconds
- Quick preset times (1min, 3min, 5min, 10min, 15min, 30min, 45min, 1hour)
- Visual progress bar showing countdown progress
- Start, pause, resume, and reset functionality
- Background notifications when timer completes
- Custom time setting with easy-to-use picker

### ⏱️ Stopwatch
- High-precision stopwatch with millisecond accuracy
- Lap time recording with unlimited laps
- Fastest/slowest lap highlighting
- Average lap time calculation
- Start, pause, and reset controls
- Clean, professional interface

### 🌍 World Clock
- Display current time in multiple time zones
- Support for major cities worldwide (New York, London, Tokyo, Sydney, Dubai, Los Angeles)
- Automatic timezone detection and display
- 12/24 hour format support
- Current date and timezone information

### 🎨 Customization
- Dark/Light theme toggle (Night Mode)
- Multiple color themes (Blue, Red, Green, Purple, Orange, Teal)
- Adjustable font sizes (Small, Medium, Large)
- Digital/Analog font options
- Show/hide seconds and date options
- Persistent settings storage

## 📱 Screenshots

The app features a clean, modern interface with:
- Bottom tab navigation between all four main features
- Consistent design language across all screens
- Material Design icons and components
- Responsive layout for different screen sizes
- Smooth animations and transitions

## 🛠️ Technical Implementation

### Architecture
- **React Native 0.79.5** with TypeScript
- **Expo SDK 53.0.20**
- **React Navigation 6** for tab-based navigation
- **Context API** for theme management
- **AsyncStorage** for persistent data storage
- **Expo Notifications** for alarm/timer alerts

### Key Dependencies
- `@react-navigation/native` & `@react-navigation/bottom-tabs` - Navigation
- `react-native-vector-icons` - Material Design icons
- `expo-notifications` - Local notifications
- `@react-native-async-storage/async-storage` - Data persistence
- `react-native-safe-area-context` & `react-native-screens` - Navigation support

### Project Structure
```
src/
├── context/
│   └── ThemeContext.tsx          # Theme management
├── screens/
│   ├── AlarmScreen.tsx           # Alarm clock functionality
├── TimerScreen.tsx           # Countdown timer
├── StopwatchScreen.tsx       # Stopwatch with laps
└── ClockScreen.tsx           # World clock & settings
└── utils/
    ├── NotificationService.ts    # Push notification handling
    └── TimeUtils.ts              # Time formatting utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18)
- React Native development environment
- Expo CLI

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd myClockApp
npm install
```

2. **Start the Expo development server:**
```bash
npm start
```

3. **Run on Android:**
```bash
npm run android
```

4. **Run on iOS:**
```bash
npm run ios
```

## 🎯 Key Features Implementation

### Alarm Management
- Persistent storage of alarm configurations
- Background notification scheduling
- Automatic rescheduling for daily repeats
- Visual feedback for active/inactive alarms

### Timer Precision
- 1-second interval updates for countdown
- Automatic notification when timer reaches zero
- Progress visualization with animated progress bar
- Pause/resume functionality with state preservation

### Stopwatch Accuracy
- 10-millisecond precision timing
- Lap time calculation and comparison
- Statistical analysis (fastest, slowest, average)
- Unlimited lap recording with scrollable list

### Theme System
- Persistent theme preferences
- System theme detection
- Dynamic color application across all components
- Smooth theme transitions

## 🔄 Data Persistence

The app uses AsyncStorage to persist:
- Alarm configurations and states
- Theme preferences and settings
- Clock display preferences
- User customization choices

## 📋 Future Enhancements

Potential improvements for future versions:
- Custom alarm sounds
- Snooze functionality
- Multiple timer support
- Alarm categories and labels
- Export/import alarm settings
- Widget support for home screen
- Sleep timer functionality
- Bedtime reminders

## 🤝 Contributing

This is a complete implementation of the vClock.com functionality in React Native. The codebase is well-structured and documented for easy maintenance and extension.

## 📄 License

This project is a React Native implementation inspired by vClock.com, built for educational and practical purposes.

---

**Built with ❤️ using React Native, TypeScript, and Expo**

## ⚠️ Important Changes

This project has been migrated to use Expo Application Services (EAS) for builds, which replaces the previous native Android and iOS build configurations. The native Android and iOS files have been removed as part of this migration.

Additionally, several core files have been updated to modernize the codebase and improve functionality.