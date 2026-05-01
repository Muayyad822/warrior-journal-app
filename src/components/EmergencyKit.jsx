import { useState } from 'react';
import toast from 'react-hot-toast';
import { useHealthData } from '../context/HealthDataContext';
import { AlertTriangle, Phone, Pencil, X } from 'lucide-react';

function EmergencyKit() {
  const { addCrisisLog, crisisActionPlan, updateCrisisActionPlan, emergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } = useHealthData();

  const [editingIndex, setEditingIndex] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const saveContact = (index) => {
    const contact = emergencyContacts[index];
    
    // Validate name is not empty
    const finalName = nameInput.trim();
    if (!finalName) {
      toast.error('Contact name cannot be empty');
      return;
    }

    const updatedContact = {
      name: finalName,
      phone: phoneInput.trim()
    };

    updateEmergencyContact(contact.id, updatedContact);

    setEditingIndex(null);
    setPhoneInput('');
    setNameInput('');
    toast.success('Contact saved!');
  };

  const addNewContact = () => {
    const newContact = {
      id: Date.now(),
      name: `Contact ${emergencyContacts.length + 1}`,
      phone: ''
    };
    
    addEmergencyContact(newContact);
    
    // Automatically put new contact in edit mode
    const newIndex = emergencyContacts.length; // This will be the index of the new contact
    setTimeout(() => {
      setEditingIndex(newIndex);
      setNameInput(newContact.name);
      setPhoneInput('');
    }, 100); // Small delay to ensure state update
    
    toast.success('New contact added! Please customize the name and phone number.');
  };

  const startEditingContact = (index) => {
    const contact = emergencyContacts[index];
    setEditingIndex(index);
    setNameInput(contact.name);
    setPhoneInput(contact.phone);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setPhoneInput('');
    setNameInput('');
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
              toast.success('Contact removed.');
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
    ), { duration: 10000 });
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
          const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
          const message = `🚨 CRISIS ALERT: I'm having a health crisis and need immediate help!
Time: ${timestamp}
My location: ${locationLink}
This is an automated emergency alert from my health app.`;

          toast.dismiss('location');
          setIsGettingLocation(false);

          fallbackSharing(message, contactsWithPhones);
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
      const cleanPhone = contact.phone.replace(/\D/g, '');
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
      severity: 9,
      duration: 'Immediate',
      triggers: ['Emergency Button Press'],
      medicationsUsed: '',
      location: locationInfo,
      circumstances: `Crisis Alert Button pressed - Alert sent to ${contactCount} contact(s).`,
    });
    toast.success(`Emergency alert initiated to ${contactCount} contact(s)!`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight">Emergency Kit</h2>
        <p className="text-lg text-slate-500 mt-2 font-medium">Instant help and crisis management tools</p>
      </div>

      {/* Crisis Alert Button */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white rounded-3xl shadow-[0_8px_30px_rgb(177,45,83,0.2)] p-8 sm:p-10 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-white/10 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <button
            onClick={sendLocationToContacts}
            disabled={isGettingLocation}
            className={`${
              isGettingLocation
                ? 'bg-primary-400/80 cursor-not-allowed'
                : 'bg-white text-primary-700 hover:bg-primary-50 hover:-translate-y-1 active:translate-y-0'
            } font-bold py-5 px-10 rounded-2xl shadow-[0_8px_20px_rgb(0,0,0,0.15)] hover:shadow-[0_12px_25px_rgb(0,0,0,0.2)] transition-all flex items-center justify-center space-x-3 text-xl`}
          >
            <span>{isGettingLocation ? 'Getting Location...' : <><AlertTriangle className="w-7 h-7 mr-2 inline-block text-secondary-500" /> CRISIS ALERT - Send Location</>}</span>
          </button>
          <p className="mt-6 text-sm text-primary-50 max-w-lg mx-auto font-medium leading-relaxed">
            Sends your location to your emergency contacts via WhatsApp or SMS. <br />
            Requires phone numbers with country codes (e.g., +2341234567890).
          </p>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="glass-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center tracking-tight">
            <Phone className="w-5 h-5 mr-2.5 text-primary-500" />
            Emergency Contacts
          </h3>
          <button
            onClick={addNewContact}
            className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-5 py-2 rounded-2xl text-sm font-semibold transition-colors shadow-sm"
          >
            + Add Contact
          </button>
        </div>

        <div className="space-y-3">
          {emergencyContacts && emergencyContacts.map((contact, index) => (
            <div key={`${contact.id || 'contact'}-${index}`}>
              {editingIndex === index ? (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Contact Name (e.g., Mom, Dr. Smith, Work Emergency)"
                      className="glass-input px-4 py-3 text-sm w-full"
                    />
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="Add country codes (e.g., +234...)"
                      className="glass-input px-4 py-3 text-sm w-full"
                      autoFocus
                    />
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => saveContact(index)}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                      >
                        Save Contact
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-white border border-slate-200 p-5 rounded-2xl flex justify-between items-center hover:shadow-md hover:border-primary-200 transition-all group">
                  <button
                    onClick={() => {
                      if (contact.phone) {
                        window.location.href = `tel:${contact.phone}`;
                      } else {
                        startEditingContact(index);
                      }
                    }}
                    className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center text-left"
                  >
                    <span className="font-bold text-slate-800 text-lg sm:text-base tracking-tight">{contact.name}</span>
                    <span className={`font-semibold mt-1 sm:mt-0 flex items-center ${contact.phone ? 'text-primary-600' : 'text-slate-400 italic'}`}>
                      <Phone className="w-4 h-4 mr-1.5" /> {contact.phone || 'Add Number'}
                    </span>
                  </button>
                  <div className="flex items-center gap-1.5 ml-4">
                    <button
                      onClick={() => startEditingContact(index)}
                      className="text-slate-400 hover:text-primary-600 p-2.5 rounded-xl hover:bg-primary-50 transition-colors"
                      title="Edit Contact"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeContact(contact.id)}
                      className="text-slate-400 hover:text-secondary-600 p-2.5 rounded-xl hover:bg-secondary-50 transition-colors"
                      title="Remove Contact"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
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
      <section className="glass-card p-6 sm:p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">Crisis Action Plan</h3>
        <textarea
          value={crisisActionPlan}
          onChange={(e) => updateCrisisActionPlan(e.target.value)}
          className="glass-input w-full p-4 text-slate-700 leading-relaxed resize-y min-h-[200px]"
          placeholder="1. Take prescribed pain medication&#10;2. Drink water immediately&#10;3. Apply heat to affected areas&#10;4. Call doctor if pain > 8/10&#10;5. Go to ER if no improvement in 2 hours"
        />
        <p className="text-sm font-medium text-slate-500 mt-3 flex items-center">
          <span className="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
          Changes are saved automatically
        </p>
      </section>
    </div>
  );
}

export default EmergencyKit;
