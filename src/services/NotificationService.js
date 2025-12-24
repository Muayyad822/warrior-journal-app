// NotificationService.js
class NotificationService {
  constructor() {
    this.permission = null;
    this.registration = null;
    this.reminders = new Map();
    this.reminderConfigs = new Map(); // Store reminder configurations
    this.init();
  }

  async init() {
    // Check if service worker and notifications are supported
    if ('serviceWorker' in navigator && 'Notification' in window) {
      try {
        this.registration = await navigator.serviceWorker.ready;
        this.permission = Notification.permission;
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }

    return false;
  }

  async showNotification(title, options = {}) {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return false;
    }

    const defaultOptions = {
      icon: '/warriors-journal.png',
      badge: '/warriors-journal.png',
      tag: 'warrior-reminder',
      requireInteraction: false,
      silent: false
    };

    const notificationOptions = { ...defaultOptions, ...options };

    if (this.registration && this.registration.showNotification) {
      // Use service worker notification (persistent)
      return this.registration.showNotification(title, notificationOptions);
    } else {
      // Fallback to regular notification
      return new Notification(title, notificationOptions);
    }
  }

  scheduleDailyReminder(id, time, title, body) {
    // Clear existing reminder
    this.clearReminder(id);

    const scheduleNext = () => {
      const now = new Date();
      const [hours, minutes] = time.split(':');
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // If the time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const delay = scheduledTime.getTime() - now.getTime();

      const timeoutId = setTimeout(async () => {
        await this.showNotification(title, { body });
        // Schedule the next reminder for tomorrow
        scheduleNext();
      }, delay);

      this.reminders.set(id, timeoutId);
      
      // Store reminder info in localStorage for persistence
      const reminderData = {
        id,
        time,
        title,
        body,
        nextScheduled: scheduledTime.toISOString()
      };
      localStorage.setItem(`reminder_${id}`, JSON.stringify(reminderData));
    };

    scheduleNext();
  }

  scheduleIntervalReminder(id, intervalMinutes, title, body) {
    // Clear existing reminder
    this.clearReminder(id);

    const intervalMs = intervalMinutes * 60 * 1000;

    const scheduleNext = () => {
      const timeoutId = setTimeout(async () => {
        await this.showNotification(title, { body });
        // Schedule the next reminder
        scheduleNext();
      }, intervalMs);

      this.reminders.set(id, timeoutId);
    };

    scheduleNext();
  }

  clearReminder(id) {
    if (this.reminders.has(id)) {
      clearTimeout(this.reminders.get(id));
      this.reminders.delete(id);
      localStorage.removeItem(`reminder_${id}`);
    }
  }

  clearAllReminders() {
    this.reminders.forEach((timeoutId, id) => {
      clearTimeout(timeoutId);
      localStorage.removeItem(`reminder_${id}`);
    });
    this.reminders.clear();
  }

  // Restore reminders after app restart
  restoreReminders() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('reminder_'));

    keys.forEach(key => {
      try {
        const reminderData = JSON.parse(localStorage.getItem(key));
        const { id, time, title, body, type, enabled } = reminderData;

        // Store configuration
        this.reminderConfigs.set(id, { id, time, title, body, type, enabled });

        // Re-schedule the daily reminder if enabled
        if (enabled !== false) {
          this.scheduleDailyReminder(id, time, title, body);
        }
      } catch (error) {
        console.error('Error restoring reminder:', error);
        localStorage.removeItem(key);
      }
    });
  }

  // Enhanced reminder management methods
  createReminder(id, time, title, body, type = 'custom', enabled = true) {
    const reminderConfig = { id, time, title, body, type, enabled };
    this.reminderConfigs.set(id, reminderConfig);

    // Save to localStorage
    localStorage.setItem(`reminder_${id}`, JSON.stringify(reminderConfig));

    // Schedule if enabled
    if (enabled) {
      this.scheduleDailyReminder(id, time, title, body);
    }

    return reminderConfig;
  }

  updateReminder(id, updates) {
    const existingConfig = this.reminderConfigs.get(id);
    if (!existingConfig) return null;

    const updatedConfig = { ...existingConfig, ...updates };
    this.reminderConfigs.set(id, updatedConfig);

    // Update localStorage
    localStorage.setItem(`reminder_${id}`, JSON.stringify(updatedConfig));

    // Re-schedule if time changed or enabled status changed
    if (updates.time || updates.enabled !== undefined) {
      this.clearReminder(id);
      if (updatedConfig.enabled) {
        this.scheduleDailyReminder(id, updatedConfig.time, updatedConfig.title, updatedConfig.body);
      }
    }

    return updatedConfig;
  }

  deleteReminder(id) {
    this.clearReminder(id);
    this.reminderConfigs.delete(id);
    localStorage.removeItem(`reminder_${id}`);
  }

  getAllReminders() {
    return Array.from(this.reminderConfigs.values());
  }

  getReminder(id) {
    return this.reminderConfigs.get(id);
  }

  toggleReminder(id) {
    const config = this.reminderConfigs.get(id);
    if (!config) return null;

    const newEnabled = !config.enabled;
    return this.updateReminder(id, { enabled: newEnabled });
  }

  // Get notification permission status
  getPermissionStatus() {
    return this.permission;
  }

  // Check if notifications are supported
  isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Get notification options based on reminder type
  getNotificationOptions(type, customOptions = {}) {
    const baseOptions = {
      icon: '/warriors-journal.png',
      badge: '/warriors-journal.png',
      tag: `warrior-${type}`,
      requireInteraction: false,
      silent: false
    };

    const typeSpecificOptions = {
      medication: {
        ...baseOptions,
        tag: 'warrior-medication',
        requireInteraction: true,
        actions: [
          { action: 'taken', title: 'Mark as Taken' },
          { action: 'snooze', title: 'Remind Later' }
        ]
      },
      water: {
        ...baseOptions,
        tag: 'warrior-water',
        requireInteraction: false
      },
      'health-check': {
        ...baseOptions,
        tag: 'warrior-health-check',
        requireInteraction: false
      },
      exercise: {
        ...baseOptions,
        tag: 'warrior-exercise',
        requireInteraction: false
      },
      appointment: {
        ...baseOptions,
        tag: 'warrior-appointment',
        requireInteraction: true
      },
      custom: baseOptions
    };

    return { ...typeSpecificOptions[type] || baseOptions, ...customOptions };
  }

  // Predefined reminder templates
  getReminderTemplates() {
    return {
      medication: {
        title: 'Medication Reminder',
        body: 'Time to take your medication. Stay on track with your health!',
        type: 'medication'
      },
      water: {
        title: 'Hydration Reminder',
        body: 'Remember to drink water and stay hydrated!',
        type: 'water'
      },
      'health-check': {
        title: 'Daily Health Check',
        body: 'Time for your daily health journal entry. How are you feeling today?',
        type: 'health-check'
      },
      exercise: {
        title: 'Exercise Reminder',
        body: 'A little movement can make a big difference. Time for some exercise!',
        type: 'exercise'
      },
      appointment: {
        title: 'Appointment Reminder',
        body: 'You have an upcoming appointment. Don\'t forget!',
        type: 'appointment'
      }
    };
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;
