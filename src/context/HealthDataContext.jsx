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

  // Load data from localStorage on initial mount
  useEffect(() => {
    const storedJournalEntries = localStorage.getItem('journalEntries');
    const storedCrisisLogs = localStorage.getItem('crisisLogs');
    const storedEmergencyContacts = localStorage.getItem('emergencyContacts'); // New
    const storedCrisisActionPlan = localStorage.getItem('crisisActionPlan');   // New

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

  // Save journal entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Save crisis logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('crisisLogs', JSON.stringify(crisisLogs));
  }, [crisisLogs]);

  // Save emergency contacts to localStorage whenever they change (New)
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  // Save crisis action plan to localStorage whenever it changes (New)
  useEffect(() => {
    localStorage.setItem('crisisActionPlan', crisisActionPlan); // Save as plain string
  }, [crisisActionPlan]);

  // Function to add a new journal entry
  const addJournalEntry = (entry) => {
    setJournalEntries((prevEntries) => [entry, ...prevEntries]);
  };

  // Function to add a new crisis log
  const addCrisisLog = (log) => {
    setCrisisLogs((prevLogs) => [log, ...prevLogs]);
  };

  // Functions for Emergency Contacts (New)
  const addEmergencyContact = (contact) => {
    setEmergencyContacts((prevContacts) => [...prevContacts, { id: Date.now(), ...contact }]);
  };

  const updateEmergencyContact = (id, updatedContact) => {
    setEmergencyContacts((prevContacts) =>
      prevContacts.map((contact) => (contact.id === id ? { ...contact, ...updatedContact } : contact))
    );
  };

  const deleteEmergencyContact = (id) => {
    setEmergencyContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
  };

  // Function to update Crisis Action Plan (New)
  const updateCrisisActionPlan = (plan) => {
    setCrisisActionPlan(plan);
  };

  // The value that will be provided to consumers of this context
  const contextValue = {
    journalEntries,
    addJournalEntry,
    crisisLogs,
    addCrisisLog,
    emergencyContacts,          // New
    addEmergencyContact,        // New
    updateEmergencyContact,     // New
    deleteEmergencyContact,     // New
    crisisActionPlan,           // New
    updateCrisisActionPlan,     // New
  };

  return (
    <HealthDataContext.Provider value={contextValue}>
      {children}
    </HealthDataContext.Provider>
  );
};