import React, { useState, useEffect } from 'react';
import notificationService from '../services/NotificationService';
import toast from 'react-hot-toast';
import { Pill, Droplets, FileText, Activity, Calendar, Bell, Check, Clock, Trash2 } from 'lucide-react';

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
    <div className="w-full">
      <div className="p-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Reminder Management</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary py-2 px-4 text-sm shadow-lg shadow-primary-500/20 self-start sm:self-auto"
          >
            {showAddForm ? 'Cancel' : '+ Add Reminder'}
          </button>
        </div>

        {/* Notification Permission Section */}
        <div className="mb-8 p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-indigo-900 mb-2">Notification Settings</h3>
              <p className="text-sm text-indigo-700/80 mb-4 max-w-xl leading-relaxed">
                Note: As this is a web application, reminders work best when the app is open in a browser tab (even in the background) or installed as an app on your device.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {permissionStatus === 'granted' ? (
              <>
                <div className="flex items-center text-emerald-700 bg-emerald-100/50 px-3 py-2 rounded-lg border border-emerald-200 text-sm font-medium">
                  <Check className="w-4 h-4 mr-2" />
                  Notifications are active
                </div>
                <button
                  onClick={() => {
                    notificationService.testNotification();
                    toast.success('Test notification sent! Check your device notifications.');
                  }}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium underline decoration-2 underline-offset-2"
                >
                  Send Test Notification
                </button>
              </>
            ) : (
              <div className="w-full">
                <p className="text-slate-600 mb-3 text-sm">
                  Enable notifications to receive reminders on your device.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={requestNotificationPermission}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
                  >
                    Enable Notifications
                  </button>
                  {permissionStatus === 'denied' && (
                    <p className="text-rose-500 text-sm flex items-center bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
                      Permissions blocked. Please reset in browser settings.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Reminder Form */}
        {showAddForm && (
          <div className="mb-8 p-6 bg-white/40 border border-white/60 rounded-2xl shadow-sm backdrop-blur-md">
            <h3 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-200/50 pb-2">
              {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1.5 text-sm">Reminder Type</label>
                <div className="relative">
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}
                    className="glass-input w-full px-4 py-2.5 appearance-none"
                  >
                    <option value="medication">💊 Medication</option>
                    <option value="water">💧 Hydration</option>
                    <option value="health-check">📝 Health Check</option>
                    <option value="exercise">🏃 Exercise</option>
                    <option value="appointment">📅 Appointment</option>
                    <option value="custom">🔔 Custom</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1.5 text-sm">Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                  className="glass-input w-full px-4 py-2.5"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-slate-700 font-medium mb-1.5 text-sm">Title</label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                placeholder="Enter reminder title"
                className="glass-input w-full px-4 py-2.5"
              />
            </div>
            <div className="mb-6">
              <label className="block text-slate-700 font-medium mb-1.5 text-sm">Message</label>
              <textarea
                value={newReminder.body}
                onChange={(e) => setNewReminder({...newReminder, body: e.target.value})}
                placeholder="Enter reminder message"
                rows="2"
                className="glass-input w-full px-4 py-2.5"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newReminder.enabled}
                  onChange={(e) => setNewReminder({...newReminder, enabled: e.target.checked})}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-slate-700 font-medium">Enable this reminder</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
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
                  className="px-4 py-2 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingReminder ? handleUpdateReminder : handleAddReminder}
                  className="btn-primary px-6 py-2 shadow-md"
                >
                  {editingReminder ? 'Update' : 'Add'} Reminder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reminders List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-700 mb-4 px-1">Your Reminders</h3>
          {reminders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <div className="bg-white p-4 rounded-full inline-block mb-3 shadow-sm">
                 <Bell className="text-3xl text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No reminders set up yet.</p>
              <button 
                onClick={() => setShowAddForm(true)} 
                className="text-primary-600 font-bold text-sm mt-2 hover:underline"
              >
                Add your first reminder
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
               {reminders.map((reminder) => (
                <div key={reminder.id} className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${reminder.enabled ? 'bg-white/60 border-slate-200 shadow-sm hover:shadow-md' : 'bg-slate-50/50 border-slate-100 opacity-75 grayscale-[0.5]'}`}>
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Icon & Content */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${reminder.enabled ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                         {getReminderIcon(reminder.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className={`text-base font-bold truncate ${reminder.enabled ? 'text-slate-800' : 'text-slate-500'}`}>{reminder.title}</h4>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${reminder.enabled ? 'bg-slate-100 text-slate-500' : 'bg-slate-200/50 text-slate-400'}`}>
                             {getReminderTypeLabel(reminder.type)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1 mb-2">{reminder.body}</p>
                        
                        <div className="flex items-center text-xs font-medium text-slate-400">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          {reminder.time}
                        </div>
                      </div>
                    </div>

                    {/* Actions - Desktop & Mobile optimized */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <div className="sm:hidden text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleReminder(reminder.id)}
                          className={`p-2 rounded-lg transition-colors ${
                             reminder.enabled 
                             ? 'text-amber-600 hover:bg-amber-50' 
                             : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={reminder.enabled ? "Disable" : "Enable"}
                        >
                          {reminder.enabled ? <span className="text-xs font-bold px-2">Pause</span> : <Check className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleEditReminder(reminder)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <span className="text-xs font-bold sm:hidden px-2">Edit</span>
                          <span className="hidden sm:inline"><FileText className="w-5 h-5" /></span> {/* Reusing icon for visual simplicity or replace with dedicated Edit icon */}
                        </button>
                        <button
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <span className="text-xs font-bold sm:hidden px-2">Delete</span>
                           <span className="hidden sm:inline"><Trash2 className="w-5 h-5" /></span> {/* Need to import Trash2 in this file if not present */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReminderSettings;
