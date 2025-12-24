import React, { useState, useEffect } from 'react';
import notificationService from '../services/NotificationService';
import toast from 'react-hot-toast';
import { Pill, Droplets, FileText, Activity, Calendar, Bell, Check, Clock } from 'lucide-react';

function ReminderSettings() {
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [newReminder, setNewReminder] = useState({
    type: 'medication',
    time: '08:00',
    title: '',
    body: '',
    enabled: true
  });

  useEffect(() => {
    // Check notification permission status
    setPermissionStatus(notificationService.getPermissionStatus());

    // Load existing reminders
    const existingReminders = notificationService.getAllReminders();
    setReminders(existingReminders);

    // If no reminders exist, create some default ones
    if (existingReminders.length === 0) {
      createDefaultReminders();
    }

    // Check if notifications are enabled globally
    // This is handled by permission status now
  }, [permissionStatus]);

  const createDefaultReminders = () => {
    const templates = notificationService.getReminderTemplates();

    // Create default medication reminder
    notificationService.createReminder(
      'default_medication',
      '08:00',
      templates.medication.title,
      templates.medication.body,
      'medication',
      false // Disabled by default
    );

    // Create default water reminder
    notificationService.createReminder(
      'default_water',
      '10:00',
      templates.water.title,
      templates.water.body,
      'water',
      false // Disabled by default
    );

    // Create default health check reminder
    notificationService.createReminder(
      'default_health_check',
      '20:00',
      templates['health-check'].title,
      templates['health-check'].body,
      'health-check',
      false // Disabled by default
    );

    setReminders(notificationService.getAllReminders());
  };

  const requestNotificationPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermissionStatus(notificationService.getPermissionStatus());

    if (granted) {
      toast.success('Notifications enabled! You can now receive reminders.');
      setPermissionStatus('granted');
    } else {
      toast.error('Notification permission denied. Please enable notifications in your browser settings.');
      setPermissionStatus('denied');
    }
  };

  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.body.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const reminderId = `reminder_${Date.now()}`;
    const templates = notificationService.getReminderTemplates();
    const template = templates[newReminder.type];

    const reminderData = {
      ...newReminder,
      title: newReminder.title || template.title,
      body: newReminder.body || template.body
    };

    notificationService.createReminder(
      reminderId,
      reminderData.time,
      reminderData.title,
      reminderData.body,
      reminderData.type,
      reminderData.enabled
    );

    setReminders(notificationService.getAllReminders());
    setNewReminder({
      type: 'medication',
      time: '08:00',
      title: '',
      body: '',
      enabled: true
    });
    setShowAddForm(false);
    toast.success('Reminder added successfully!');
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setNewReminder({
      type: reminder.type,
      time: reminder.time,
      title: reminder.title,
      body: reminder.body,
      enabled: reminder.enabled
    });
    setShowAddForm(true);
  };

  const handleUpdateReminder = () => {
    if (!editingReminder) return;

    notificationService.updateReminder(editingReminder.id, {
      ...newReminder
    });

    setReminders(notificationService.getAllReminders());
    setEditingReminder(null);
    setNewReminder({
      type: 'medication',
      time: '08:00',
      title: '',
      body: '',
      enabled: true
    });
    setShowAddForm(false);
    toast.success('Reminder updated successfully!');
  };

  const handleDeleteReminder = (id) => {
    notificationService.deleteReminder(id);
    setReminders(notificationService.getAllReminders());
    toast.success('Reminder deleted successfully!');
  };

  const handleToggleReminder = (id) => {
    notificationService.toggleReminder(id);
    setReminders(notificationService.getAllReminders());
  };

  const getReminderIcon = (type) => {
    const icons = {
      medication: <Pill className="w-5 h-5" />,
      water: <Droplets className="w-5 h-5" />,
      'health-check': <FileText className="w-5 h-5" />,
      exercise: <Activity className="w-5 h-5" />,
      appointment: <Calendar className="w-5 h-5" />,
      custom: <Bell className="w-5 h-5" />
    };
    return icons[type] || icons.custom;
  };

  const getReminderTypeLabel = (type) => {
    const labels = {
      medication: 'Medication',
      water: 'Hydration',
      'health-check': 'Health Check',
      exercise: 'Exercise',
      appointment: 'Appointment',
      custom: 'Custom'
    };
    return labels[type] || labels.custom;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Reminder Management</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors self-start sm:self-auto"
          >
            {showAddForm ? 'Cancel' : '+ Add Reminder'}
          </button>
        </div>

        {/* Notification Permission Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Notification Settings</h3>
          {permissionStatus === 'granted' ? (
            <div className="flex items-center text-green-600">
              <Check className="w-5 h-5 mr-2" />
              Notifications are enabled
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-3">
                Enable notifications to receive reminders on your device.
              </p>
              <button
                onClick={requestNotificationPermission}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Enable Notifications
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Reminder Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Reminder Type</label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                >
                  <option value="medication"><Pill className="w-4 h-4 inline mr-1" /> Medication</option>
                  <option value="water"><Droplets className="w-4 h-4 inline mr-1" /> Hydration</option>
                  <option value="health-check"><FileText className="w-4 h-4 inline mr-1" /> Health Check</option>
                  <option value="exercise"><Activity className="w-4 h-4 inline mr-1" /> Exercise</option>
                  <option value="appointment"><Calendar className="w-4 h-4 inline mr-1" /> Appointment</option>
                  <option value="custom"><Bell className="w-4 h-4 inline mr-1" /> Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Title</label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                placeholder="Enter reminder title"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Message</label>
              <textarea
                value={newReminder.body}
                onChange={(e) => setNewReminder({...newReminder, body: e.target.value})}
                placeholder="Enter reminder message"
                rows="3"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newReminder.enabled}
                  onChange={(e) => setNewReminder({...newReminder, enabled: e.target.checked})}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Enable this reminder</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReminder(null);
                    setNewReminder({
                      type: 'medication',
                      time: '08:00',
                      title: '',
                      body: '',
                      enabled: true
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingReminder ? handleUpdateReminder : handleAddReminder}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {editingReminder ? 'Update' : 'Add'} Reminder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reminders List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Your Reminders</h3>
          {reminders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="text-4xl mb-4" />
              <p>No reminders set up yet. Add your first reminder above!</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                    <div className="text-2xl">{getReminderIcon(reminder.type)}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{reminder.title}</h4>
                      <p className="text-sm text-gray-600">{reminder.body}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {getReminderTypeLabel(reminder.type)}
                        </span>
                        <span className="text-sm text-gray-500"><Clock className="w-4 h-4 inline mr-1" /> {reminder.time}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          reminder.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {reminder.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:space-x-2">
                    <button
                      onClick={() => handleToggleReminder(reminder.id)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        reminder.enabled
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {reminder.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleEditReminder(reminder)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ReminderSettings;
