import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
    this.createChannels();
  }

  configure = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  createChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'alarm-channel',
        channelName: 'Alarm Notifications',
        channelDescription: 'Notifications for alarms',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel 'alarm-channel' returned '${created}'`)
    );

    PushNotification.createChannel(
      {
        channelId: 'timer-channel',
        channelName: 'Timer Notifications',
        channelDescription: 'Notifications for timers',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel 'timer-channel' returned '${created}'`)
    );
  };

  scheduleAlarmNotification = (id: string, title: string, message: string, date: Date, repeat?: string) => {
    PushNotification.localNotificationSchedule({
      id: id,
      channelId: 'alarm-channel',
      title: title,
      message: message,
      date: date,
      soundName: 'default',
      playSound: true,
      vibrate: true,
      vibration: 300,
      repeatType: repeat as any,
      actions: ['Stop'],
    });
  };

  scheduleTimerNotification = (id: string, title: string, message: string, date: Date) => {
    PushNotification.localNotificationSchedule({
      id: id,
      channelId: 'timer-channel',
      title: title,
      message: message,
      date: date,
      soundName: 'default',
      playSound: true,
      vibrate: true,
      vibration: 300,
      actions: ['OK'],
    });
  };

  cancelNotification = (id: string) => {
    PushNotification.cancelLocalNotification(id);
  };

  cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  showLocalNotification = (title: string, message: string, channelId: string = 'alarm-channel') => {
    PushNotification.localNotification({
      channelId: channelId,
      title: title,
      message: message,
      soundName: 'default',
      playSound: true,
      vibrate: true,
      vibration: 300,
    });
  };
}

export default new NotificationService();