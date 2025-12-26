// NotificationService.js
class NotificationService {
  constructor() {
    this.permission = null;
    this.registration = null;
    this.reminders = new Map();
    this.reminderConfigs = new Map(); // Store reminder configurations
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    // Check if service worker and notifications are supported
    if ('Notification' in window) {
      this.permission = Notification.permission;
      
      if ('serviceWorker' in navigator) {
        try {
          // Wait for service worker to be ready, but don't block indefinitely
          this.registration = await navigator.serviceWorker.ready.catch(e => {
            console.warn('Service worker ready failed, falling back to non-SW notifications', e);
            return null;
          });
        } catch (error) {
          console.error('Service worker registration failed:', error);
        }
      }
    }
    this.initialized = true;
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(title, options = {}) {
    await this.init();
    
    if (this.permission !== 'granted') {
      // Don't auto-request permission largely to avoid blocking, 
      // but if called explicitly, it might be okay. 
      // Better to check permission before calling this.
      if (Notification.permission !== 'granted') {
          console.log('Notification permission not granted');
          return false;
      }
    }

    const defaultOptions = {
      icon: '/warriors-journal.png',
      badge: '/warriors-journal.png',
      tag: 'warrior-reminder',
      requireInteraction: false,
      silent: false
    };

    const notificationOptions = { ...defaultOptions, ...options };

    try {
      if (this.registration && this.registration.showNotification) {
        // Use service worker notification (persistent)
        await this.registration.showNotification(title, notificationOptions);
        return true;
      } else {
        // Fallback to regular notification
        const notification = new Notification(title, notificationOptions);
        return true;
      }
    } catch (error) {
      console.error('Error showing notification:', error);
      // Last ditch effort: classic Notification
      try {
         new Notification(title, notificationOptions);
         return true;
      } catch (e) {
         console.error('Fallback notification failed', e);
         return false;
      }
    }
  }

  async testNotification() {
    await this.requestPermission();
    return this.showNotification('Test Reminder', {
      body: 'Great! Notifications are working correctly.',
      tag: 'test-notification'
    });
  }

  scheduleDailyReminder(id, time, title, body) {
    // Clear existing reminder
    this.clearReminder(id);

    const scheduleNext = () => {
      const now = new Date();
      const [hours, minutes] = time.split(':');
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      // If the time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const delay = scheduledTime.getTime() - now.getTime();
      
      // Safety check for delay (max 32-bit int)
      if (delay > 2147483647) {
        // If delay is too long for setTimeout, check again in an hour
        const hourDelay = 3600000;
        const timeoutId = setTimeout(() => scheduleNext(), hourDelay);
        this.reminders.set(id, timeoutId);
        return;
      }

      const timeoutId = setTimeout(async () => {
        await this.showNotification(title, { body });
        // Schedule the next reminder for tomorrow
        scheduleNext();
      }, delay);

      this.reminders.set(id, timeoutId);
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
    }
  }

  clearAllReminders() {
    this.reminders.forEach((timeoutId, id) => {
      clearTimeout(timeoutId);
    });
    this.reminders.clear();
    // Do not clear localStorage configs here as this might be called on unmount
    // Only delete configs if explicitly asked
  }

  // Restore reminders after app restart
  async restoreReminders() {
    await this.init();
    const keys = Object.keys(localStorage).filter(key => key.startsWith('reminder_'));

    if (keys.length === 0) return;

    keys.forEach(key => {
      try {
        const reminderData = JSON.parse(localStorage.getItem(key));
        // Handle potential malformed data
        if (!reminderData || !reminderData.id) return;
        
        const { id, time, title, body, type, enabled } = reminderData;

        // Store configuration
        this.reminderConfigs.set(id, { id, time, title, body, type, enabled });

        // Re-schedule the daily reminder if enabled
        if (enabled !== false) {
          this.scheduleDailyReminder(id, time, title, body);
        }
      } catch (error) {
        console.error('Error restoring reminder:', error);
        // Don't delete merely on error to prevent data loss on bugs
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
    if (updates.time || updates.enabled !== undefined || updates.title || updates.body) {
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
    return 'Notification' in window;
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
