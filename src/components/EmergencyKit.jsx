import { useState, useEffect } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function EmergencyKit() {
  const { addCrisisLog, crisisActionPlan, updateCrisisActionPlan, emergencyContacts, addEmergencyContact, updateEmergencyContact } = useHealthData();
  
  const [localContacts, setLocalContacts] = useState([
    { name: 'Primary Doctor', phone: '', type: 'doctor' },
    { name: 'Emergency Contact', phone: '', type: 'family' },
    { name: 'Hospital', phone: '', type: 'hospital' }
  ]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Initialize with context data or default contacts
  useEffect(() => {
    if (emergencyContacts && emergencyContacts.length > 0) {
      setLocalContacts(emergencyContacts);
    } else {
      // Initialize default contacts in context if none exist
      const defaultContacts = [
        { id: 1, name: 'Primary Doctor', phone: '', type: 'doctor' },
        { id: 2, name: 'Emergency Contact', phone: '', type: 'family' },
        { id: 3, name: 'Hospital', phone: '', type: 'hospital' }
      ];
      defaultContacts.forEach(contact => addEmergencyContact(contact));
    }
  }, [emergencyContacts, addEmergencyContact]);

  const savePhone = (index) => {
    const updatedContacts = [...localContacts];
    updatedContacts[index].phone = phoneInput;
    setLocalContacts(updatedContacts);
    
    // Update in context
    if (updatedContacts[index].id) {
      updateEmergencyContact(updatedContacts[index].id, { phone: phoneInput });
    }
    
    setEditingIndex(null);
    setPhoneInput('');
  };

  const sendLocationToContacts = () => {
    if (localContacts.every(contact => !contact.phone)) {
      alert("Please add at least one emergency contact phone number first.");
      return;
    }

    setIsGettingLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = new Date().toLocaleString();
          const message = `🚨 CRISIS ALERT: I'm having a health crisis and need immediate help!
Time: ${timestamp}
My location: https://maps.google.com/?q=${latitude},${longitude}
This is an automated emergency alert from my health app.`;
          
          if (navigator.share) {
            navigator.share({
              title: '🚨 Crisis Alert',
              text: message
            }).then(() => {
              addCrisisLog({
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString(),
                severity: 9,
                duration: 'Instant',
                triggers: ['Emergency Button Press'],
                medicationsUsed: '',
                location: `${latitude}, ${longitude}`,
                circumstances: 'Crisis Alert Button pressed - Location shared with contacts',
              });
              alert('Crisis alert shared successfully!');
            }).catch(() => {
              fallbackSharing(message);
            });
          } else {
            fallbackSharing(message);
          }
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Location error:', error);
          setIsGettingLocation(false);
          
          const fallbackMessage = `🚨 CRISIS ALERT: I'm having a health crisis and need immediate help!
Time: ${new Date().toLocaleString()}
Location: Unable to determine location
This is an automated emergency alert from my health app.`;

          const proceed = confirm("Could not get location. Send alert without location?");
          if (proceed) {
            fallbackSharing(fallbackMessage);
          }
        }
      );
    } else {
      setIsGettingLocation(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fallbackSharing = (message) => {
    const contactsWithPhones = localContacts.filter(contact => contact.phone);
    
    if (contactsWithPhones.length > 0) {
      const platformChoice = confirm("Choose sharing method:\n\nOK = WhatsApp\nCancel = SMS");

      contactsWithPhones.forEach(contact => {
        if (platformChoice) {
          const cleanPhone = contact.phone.replace(/\D/g, '');
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
        } else {
          const encodedMessage = encodeURIComponent(message);
          const smsUrl = `sms:${contact.phone}?body=${encodedMessage}`;
          window.open(smsUrl, '_blank');
        }
      });

      addCrisisLog({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        severity: 9,
        duration: 'Instant',
        triggers: ['Emergency Button Press'],
        medicationsUsed: '',
        location: 'Location shared',
        circumstances: 'Crisis Alert Button pressed - Emergency contacts notified',
      });

      alert(`Emergency alert sent to ${contactsWithPhones.length} contact(s)!`);
    }
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
          Shares your location with emergency contacts via native sharing, WhatsApp, or SMS
        </p>
      </section>

      {/* Emergency Contacts */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Emergency Contacts</h3>
        
        <div className="space-y-3">
          {localContacts.map((contact, index) => (
            <div key={index}>
              {editingIndex === index ? (
                <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg">
                  <div className="flex flex-col gap-3">
                    <span className="font-semibold text-gray-800">{contact.name}</span>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="Enter phone number with country code (e.g., +1234567890)"
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => savePhone(index)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingIndex(null);
                          setPhoneInput('');
                        }}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => contact.phone ? window.location.href = `tel:${contact.phone}` : (setEditingIndex(index), setPhoneInput(contact.phone))}
                  className="w-full bg-white border border-gray-300 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{contact.name}</span>
                  <span className="text-blue-600 font-medium">
                    📞 {contact.phone || 'Add Number'}
                  </span>
                </button>
              )}
            </div>
          ))}
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
