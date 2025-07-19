export const formatTime = (date: Date, is24Hour: boolean = false, showSeconds: boolean = true): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !is24Hour,
  };

  if (showSeconds) {
    options.second = '2-digit';
  }

  return date.toLocaleTimeString([], options);
};

export const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatStopwatchTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

export const getNextAlarmTime = (hour: number, minute: number): Date => {
  const now = new Date();
  const alarmTime = new Date();
  alarmTime.setHours(hour, minute, 0, 0);

  // If the alarm time has already passed today, set it for tomorrow
  if (alarmTime <= now) {
    alarmTime.setDate(alarmTime.getDate() + 1);
  }

  return alarmTime;
};

export const getTimeUntilAlarm = (alarmTime: Date): string => {
  const now = new Date();
  const diff = alarmTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Alarm time passed';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const parseTimeString = (timeString: string): { hour: number; minute: number } => {
  const [hour, minute] = timeString.split(':').map(Number);
  return { hour, minute };
};