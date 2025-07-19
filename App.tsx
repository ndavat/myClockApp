import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AlarmScreen from './src/screens/AlarmScreen';
import TimerScreen from './src/screens/TimerScreen';
import StopwatchScreen from './src/screens/StopwatchScreen';
import ClockScreen from './src/screens/ClockScreen';
import { ThemeProvider } from './src/context/ThemeContext';

const Tab = createBottomTabNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = '';
              
              switch (route.name) {
                case 'Alarm':
                  iconName = 'alarm';
                  break;
                case 'Timer':
                  iconName = 'timer';
                  break;
                case 'Stopwatch':
                  iconName = 'timer';
                  break;
                case 'Clock':
                  iconName = 'access-time';
                  break;
              }
              
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1565c0',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#1565c0',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen name="Alarm" component={AlarmScreen} />
          <Tab.Screen name="Timer" component={TimerScreen} />
          <Tab.Screen name="Stopwatch" component={StopwatchScreen} />
          <Tab.Screen name="Clock" component={ClockScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
