import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useHealthData } from '../context/HealthDataContext';

function EmergencyKit() {
  const { addCrisisLog, crisisActionPlan, updateCrisisActionPlan, emergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } = useHealthData();

  const [editingIndex, setEditingIndex] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Removed the useEffect for default contacts from here.
  // The HealthDataContext now handles initializing default contacts if localStorage is empty.

  const saveContact = (index) => {
    const contact = emergencyContacts[index];
    const updatedContact = {
      ...contact,
      name: nameInput || contact.name, // Keep existing name if input is empty
      phone: phoneInput
    };

    updateEmergencyContact(contact.id, updatedContact);

    setEditingIndex(null);
    setPhoneInput('');
    setNameInput('');
    toast.success('Contact saved!'); // Concise toast message
  };

  const addNewContact = () => {
    const newContact = {
      id: Date.now(),
      name: `Contact ${emergencyContacts.length + 1}`,
      phone: ''
    };
    addEmergencyContact(newContact);
    toast.success('New contact added!'); // Keep this toast for clarity
  };

  const removeContact = (contactId) => {
    if (emergencyContacts.length <= 1) {
      toast.error('You must have at least one emergency contact.');
      return;
    }

    toast((t) => (
      <div className="text-center">
        <p className="mb-3 font-semibold">Remove this contact?</p>
        <div className="flex gap-2 justify-center">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            onClick={() => {
              deleteEmergencyContact(contactId);
              toast.dismiss(t.id);
              toast.success('Contact removed.'); // Concise toast message
            }}
          >
            Remove
          </button>
          <button
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 }); // Keep duration long for confirmation
  };

  const sendLocationToContacts = () => {
    const contactsWithPhones = emergencyContacts.filter(contact => contact.phone && contact.phone.trim() !== '');

    if (contactsWithPhones.length === 0) {
      toast.error("Please add at least one emergency contact with a phone number.");
      return;
    }

    setIsGettingLocation(true);
    toast.loading('Getting your location...', { id: 'location' });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = new Date().toLocaleString();
          // Corrected Google Maps URL
          const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
          const message = `🚨 CRISIS ALERT: I'm having a health crisis and need immediate help!
Time: ${timestamp}
My location: ${locationLink}
This is an automated emergency alert from my health app.`;

          toast.dismiss('location');

          if (navigator.share) {
            navigator.share({
              title: '🚨 Crisis Alert',
              text: message
            }).then(() => {
              logCrisisAlert(contactsWithPhones.length, `${latitude}, ${longitude}`);
              toast.success('Crisis alert shared!'); // Concise toast message
            }).catch((error) => {
              console.warn('Native share failed or was cancelled:', error);
              fallbackSharing(message, contactsWithPhones);
            });
          } else {
            fallbackSharing(message, contactsWithPhones);
          }
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Location error:', error);
          toast.dismiss('location');
          setIsGettingLocation(false);

          const fallbackMessage = `🚨 CRISIS ALERT: I'm having a health crisis and need immediate help!
Time: ${new Date().toLocaleString()}
Location: Unable to determine location (Location access denied or not available)
This is an automated emergency alert from my health app.`;

          toast((t) => (
            <div className="text-center">
              <p className="mb-3">Could not get location. Send alert without location?</p>
              <div className="flex gap-2 justify-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  onClick={() => {
                    toast.dismiss(t.id);
                    fallbackSharing(fallbackMessage, contactsWithPhones);
                  }}
                >
                  Send Anyway
                </button>
                <button
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                  onClick={() => toast.dismiss(t.id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ), { duration: 10000 });
        }
      );
    } else {
      toast.dismiss('location');
      setIsGettingLocation(false);
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const fallbackSharing = (message, contacts) => {
    toast((t) => (
      <div className="text-center">
        <p className="mb-3 font-semibold">Choose sharing method:</p>
        <div className="flex gap-2 justify-center">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
            onClick={() => {
              toast.dismiss(t.id);
              shareViaWhatsApp(message, contacts);
            }}
          >
            WhatsApp
          </button>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
            onClick={() => {
              toast.dismiss(t.id);
              shareViaSMS(message, contacts);
            }}
          >
            SMS
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  const shareViaWhatsApp = (message, contacts) => {
    let sharedCount = 0;
    contacts.forEach(contact => {
      const cleanPhone = contact.phone.replace(/\D/g, ''); // Remove non-digits
      if (cleanPhone) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        sharedCount++;
      }
    });
    logCrisisAlert(sharedCount, 'Location shared via WhatsApp');
  };

  const shareViaSMS = (message, contacts) => {
    let sharedCount = 0;
    contacts.forEach(contact => {
      if (contact.phone) {
        const encodedMessage = encodeURIComponent(message);
        const smsUrl = `sms:${contact.phone}?body=${encodedMessage}`;
        window.open(smsUrl, '_blank');
        sharedCount++;
      }
    });
    logCrisisAlert(sharedCount, 'Location shared via SMS');
  };

  const logCrisisAlert = (contactCount, locationInfo) => {
    addCrisisLog({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      severity: 9, // Assuming high severity for an emergency alert
      duration: 'Immediate',
      triggers: ['Emergency Button Press'],
      medicationsUsed: '',
      location: locationInfo,
      circumstances: `Crisis Alert Button pressed - Alert sent to ${contactCount} contact(s).`,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Emergency Kit - Instant Help</h2>

      {/* Crisis Alert Button */}
      <section className="bg-red-700 text-white rounded-lg shadow-lg p-6 mb-8 text-center">
        <button
          onClick={sendLocationToContacts}
          disabled={isGettingLocation}
          className={`${
            isGettingLocation
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          } text-white font-bold py-4 px-8 rounded-full shadow-xl transition-colors focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-offset-2 flex items-center justify-center mx-auto space-x-3 text-xl`}
        >
          <span>{isGettingLocation ? 'Getting Location...' : '🆘 CRISIS ALERT - Send Location'}</span>
        </button>
        <p className="mt-4 text-sm opacity-80">
          Shares your location with emergency contacts via native sharing, WhatsApp, or SMS.
          Requires phone numbers with country codes (e.g., +1234567890).
        </p>
      </section>

      {/* Emergency Contacts */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Emergency Contacts</h3>
          <button
            onClick={addNewContact}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Add Contact
          </button>
        </div>

        <div className="space-y-3">
          {emergencyContacts && emergencyContacts.map((contact, index) => (
            <div key={contact.id}>
              {editingIndex === index ? (
                <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg">
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder={contact.name || "Contact Name"}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="e.g., +1234567890"
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus // Auto-focus on phone input when editing
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveContact(index)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingIndex(null);
                          setPhoneInput('');
                          setNameInput('');
                        }}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-white border border-gray-300 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors">
                  {/* Clickable area for dialing or editing */}
                  <button
                    onClick={() => {
                      // If phone exists, attempt to dial, otherwise go to edit mode
                      if (contact.phone) {
                        window.location.href = `tel:${contact.phone}`;
                      } else {
                        setEditingIndex(index);
                        setPhoneInput(contact.phone);
                        setNameInput(contact.name);
                      }
                    }}
                    className="flex-1 flex justify-between items-center text-left"
                  >
                    <span className="font-medium text-gray-800">{contact.name}</span>
                    <span className={`font-medium ${contact.phone ? 'text-blue-600' : 'text-gray-500 italic'}`}>
                      📞 {contact.phone || 'Add Number'}
                    </span>
                  </button>
                  <button
                    onClick={() => removeContact(contact.id)}
                    className="ml-3 text-red-500 hover:text-red-700 text-sm p-1 rounded-full hover:bg-red-50"
                    title="Remove Contact"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
          {emergencyContacts.length === 0 && (
            <p className="text-gray-500 italic text-center py-4">No contacts added. Use the "+ Add Contact" button.</p>
          )}
        </div>
      </section>

      {/* Crisis Action Plan */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Crisis Action Plan</h3>
        <textarea
          value={crisisActionPlan}
          onChange={(e) => updateCrisisActionPlan(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows="8"
          placeholder="1. Take prescribed pain medication
2. Drink water immediately
3. Apply heat to affected areas
4. Call doctor if pain > 8/10
5. Go to ER if no improvement in 2 hours"
        />
        <p className="text-sm text-gray-500 mt-2">Changes are saved automatically.</p>
      </section>
    </div>
  );
}

export default EmergencyKit;