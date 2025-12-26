// src/context/HealthDataContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
export const HealthDataContext = createContext();

// Create a custom hook for easy access to the context
export const useHealthData = () => {
  return useContext(HealthDataContext);
};

// Create the context provider component
export const HealthDataProvider = ({ children }) => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [crisisLogs, setCrisisLogs] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [crisisActionPlan, setCrisisActionPlan] = useState('');
  const [userName, setUserName] = useState('');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Load data from localStorage on initial mount
  useEffect(() => {
    const storedJournalEntries = localStorage.getItem('journalEntries');
    const storedCrisisLogs = localStorage.getItem('crisisLogs');
    const storedEmergencyContacts = localStorage.getItem('emergencyContacts');
    const storedCrisisActionPlan = localStorage.getItem('crisisActionPlan');
    const storedUserName = localStorage.getItem('userName');
    const storedOnboardingStatus = localStorage.getItem('hasCompletedOnboarding');

    // Load user data
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedOnboardingStatus === 'true') {
      setHasCompletedOnboarding(true);
    }

    // Load existing data...
    if (storedJournalEntries) {
      try {
        setJournalEntries(JSON.parse(storedJournalEntries));
      } catch (error) {
        console.error("Failed to parse journal entries from localStorage:", error);
        setJournalEntries([]);
      }
    }
    if (storedCrisisLogs) {
      try {
        setCrisisLogs(JSON.parse(storedCrisisLogs));
      } catch (error) {
        console.error("Failed to parse crisis logs from localStorage:", error);
        setCrisisLogs([]);
      }
    }
    // Load Emergency Kit data with defaults if nothing found or empty array
    if (storedEmergencyContacts) {
      try {
        const parsedContacts = JSON.parse(storedEmergencyContacts);
        if (parsedContacts.length > 0) {
          setEmergencyContacts(parsedContacts);
        } else {
          // If stored array is empty, initialize with defaults
          const defaultContacts = [
            { id: 1, name: 'Contact 1', phone: '' },
            { id: 2, name: 'Contact 2', phone: '' },
            { id: 3, name: 'Contact 3', phone: '' }
          ];
          setEmergencyContacts(defaultContacts);
        }
      } catch (error) {
        console.error("Failed to parse emergency contacts from localStorage:", error);
        // On parsing error, revert to defaults
        const defaultContacts = [
          { id: 1, name: 'Contact 1', phone: '' },
          { id: 2, name: 'Contact 2', phone: '' },
          { id: 3, name: 'Contact 3', phone: '' }
        ];
        setEmergencyContacts(defaultContacts);
      }
    } else {
      // If nothing in localStorage for contacts, initialize with defaults
      const defaultContacts = [
        { id: 1, name: 'Contact 1', phone: '' },
        { id: 2, name: 'Contact 2', phone: '' },
        { id: 3, name: 'Contact 3', phone: '' }
      ];
      setEmergencyContacts(defaultContacts);
    }

    if (storedCrisisActionPlan) {
      setCrisisActionPlan(storedCrisisActionPlan); // Stored as plain string
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save user name to localStorage whenever it changes
  useEffect(() => {
    if (userName) {
      localStorage.setItem('userName', userName);
    }
  }, [userName]);

  // Save onboarding status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hasCompletedOnboarding', hasCompletedOnboarding.toString());
  }, [hasCompletedOnboarding]);

  // Save journal entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Save crisis logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('crisisLogs', JSON.stringify(crisisLogs));
  }, [crisisLogs]);

  // Save emergency contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  // Save crisis action plan to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('crisisActionPlan', crisisActionPlan); // Save as plain string
  }, [crisisActionPlan]);

  // Function to add a new journal entry
  const addJournalEntry = (entry) => {
    setJournalEntries((prevEntries) => [...prevEntries, entry]);
  };

  // Function to add a new crisis log
  const addCrisisLog = (log) => {
    setCrisisLogs((prevLogs) => [...prevLogs, log]);
  };

  // Functions for Emergency Contacts
  const addEmergencyContact = (contact) => {
    const newContact = {
      id: contact.id || Date.now(),
      name: contact.name || `Contact ${emergencyContacts.length + 1}`,
      phone: contact.phone || ''
    };
    setEmergencyContacts((prevContacts) => [...prevContacts, newContact]);
  };

  const updateEmergencyContact = (id, updatedContact) => {
    setEmergencyContacts((prevContacts) =>
      prevContacts.map((contact) => 
        contact.id === id 
          ? { 
              ...contact, 
              name: updatedContact.name !== undefined ? updatedContact.name : contact.name,
              phone: updatedContact.phone !== undefined ? updatedContact.phone : contact.phone
            } 
          : contact
      )
    );
  };

  const deleteEmergencyContact = (id) => {
    setEmergencyContacts((prevContacts) => 
      prevContacts.filter((contact) => contact.id !== id)
    );
  };

  // Function to update crisis action plan
  const updateCrisisActionPlan = (plan) => {
    setCrisisActionPlan(plan);
  };

  // Quick action: Add water
  const addWaterIntake = () => {
    const today = new Date().toISOString().split("T")[0];
    const todaysEntryIndex = journalEntries.findIndex((entry) => entry.date === today);

    if (todaysEntryIndex !== -1) {
      // Update existing entry
      const updatedEntries = [...journalEntries];
      updatedEntries[todaysEntryIndex] = {
        ...updatedEntries[todaysEntryIndex],
        hydration: (updatedEntries[todaysEntryIndex].hydration || 0) + 1
      };
      setJournalEntries(updatedEntries);
    } else {
      // Create new entry for today if it doesn't exist
      const newEntry = {
        id: Date.now(),
        date: today,
        painLevel: 0, // Default meaningful values
        mood: 'Neutral',
        hydration: 1,
        sleepHours: 0,
        medications: '',
        symptoms: [],
        personalNotes: ''
      };
      setJournalEntries(prev => [...prev, newEntry]);
    }
  };

  // User personalization functions
  const updateUserName = (name) => {
    const trimmedName = name.trim();
    setUserName(trimmedName);
  };

  const completeOnboarding = (name) => {
    const trimmedName = name.trim();
    setUserName(trimmedName);
    setHasCompletedOnboarding(true);
  };

  const getDisplayName = () => {
    return userName || 'Warrior';
  };

  // Context value object
  const contextValue = {
    journalEntries,
    crisisLogs,
    emergencyContacts,
    crisisActionPlan,
    userName,
    hasCompletedOnboarding,
    addJournalEntry,
    addCrisisLog,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    updateCrisisActionPlan,
    updateUserName,
    completeOnboarding,
    getDisplayName,
    addWaterIntake,
  };

  return (
    <HealthDataContext.Provider value={contextValue}>
      {children}
    </HealthDataContext.Provider>
  );
};
