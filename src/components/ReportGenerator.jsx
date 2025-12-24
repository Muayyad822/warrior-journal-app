import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileDown, Loader } from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import toast from 'react-hot-toast';

const ReportGenerator = () => {
  const { journalEntries, crisisLogs, getDisplayName } = useHealthData();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const displayName = getDisplayName();
      const date = new Date().toLocaleDateString();

      // Title
      doc.setFontSize(22);
      doc.setTextColor(41, 98, 255); // Blue color
      doc.text("Health Journey Report", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Patient: ${displayName}`, 20, 35);
      doc.text(`Date Generated: ${date}`, 20, 42);

      // Summary Section
      doc.setDrawColor(200);
      doc.line(20, 48, 190, 48);
      
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("Summary Overview", 20, 60);
      
      doc.setFontSize(12);
      doc.text(`Total Journal Entries: ${journalEntries.length}`, 20, 70);
      doc.text(`Total Crisis Episodes: ${crisisLogs.length}`, 20, 78);

      let yPos = 90;

      // Recent Crisis Logs
      if (crisisLogs.length > 0) {
        doc.setFontSize(16);
        doc.text("Recent Crisis Episodes", 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        const recentCrises = [...crisisLogs].sort((a, b) => b.id - a.id).slice(0, 5);
        
        recentCrises.forEach((log) => {
          doc.setTextColor(200, 0, 0); // Red for crisis
          doc.text(`• ${log.date} at ${log.time} - Severity: ${log.severity}/10`, 25, yPos);
          doc.setTextColor(80);
          yPos += 5;
          doc.text(`  Triggers: ${log.triggers.join(', ') || 'None recorded'}`, 25, yPos);
          yPos += 5;
          doc.text(`  Location: ${log.location || 'Not recorded'}`, 25, yPos);
          yPos += 8;
        });
      }

      yPos += 10;

      // Recent Journal Entries
      if (journalEntries.length > 0) {
        // Check if we need a new page
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text("Recent Daily Journals", 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        const recentJournals = [...journalEntries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
        
        recentJournals.forEach((entry) => {
           if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }

          doc.setTextColor(0, 100, 0); // Dark Green
          doc.text(`• ${entry.date} - Pain: ${entry.painLevel}/10, Mood: ${entry.mood}`, 25, yPos);
          yPos += 5;
          doc.setTextColor(80);
          if (entry.personalNotes) {
            const notes = doc.splitTextToSize(`Note: ${entry.personalNotes}`, 160);
            doc.text(notes, 25, yPos);
            yPos += (notes.length * 4) + 2;
          } else {
             yPos += 2;
          }
        });
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      }

      // Save
      doc.save(`Warrior_Health_Report_${date.replace(/\//g, '-')}.pdf`);
      toast.success("Details downloaded successfully!");

    } catch (error) {
      console.error("Report generation failed:", error);
      toast.error("Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateReport}
      disabled={isGenerating}
      className={`bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg text-center transition-colors flex flex-col items-center justify-center min-h-[120px] w-full ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {isGenerating ? <Loader className="text-3xl mb-3 animate-spin" /> : <FileDown className="text-3xl mb-3" />}
      <div className="font-semibold">{isGenerating ? 'Generating...' : 'Doctor Report'}</div>
    </button>
  );
};

export default ReportGenerator;
