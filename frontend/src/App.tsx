import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SimulationPage } from './pages/SimulationPage';
import { api } from './services/api';
import { PatientProfile } from './types';
import { Info } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('simulation');
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await api.getPatients();
      setPatients(data);
      if (data.length > 0 && !selectedPatient) {
        setSelectedPatient(data[2]); // Default to Carlos or Diana for rich demo
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Statutory Healthcare Disclaimer Banner */}
      <div className="bg-teal-950/80 border-b border-teal-900/60 px-4 py-2 text-center text-xs text-teal-300 flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          <strong>VitalAI Medical Notice:</strong> Designed as an AI-assisted decision-support and early-warning platform. Not a substitute for professional clinical judgment.
        </span>
      </div>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadAlertCount={2}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'landing' && (
          <LandingPage
            onExploreDemo={() => setActiveTab('simulation')}
            onGoToPatient={() => setActiveTab('patient')}
            onGoToDoctor={() => setActiveTab('doctor')}
          />
        )}

        {activeTab === 'patient' && selectedPatient && (
          <PatientDashboard
            patient={selectedPatient}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'doctor' && (
          <DoctorDashboard
            patients={patients}
            onSelectPatient={(p) => {
              setSelectedPatient(p);
              setActiveTab('patient');
            }}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'simulation' && (
          <SimulationPage />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 VitalAI Healthcare Technologies. Built for proactive health monitoring and early warning detection.</p>
      </footer>
    </div>
  );
};
export default App;
