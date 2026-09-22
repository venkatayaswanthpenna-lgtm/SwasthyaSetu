"use client";

import { useState } from 'react';
import Link from 'next/link';
import { SyncStatus } from '@/components/SyncStatus';
import { queueRequest } from '@/lib/db';

// Mock Data
const INITIAL_EPISODES = [
  { id: "CE-2024-A1B2", patient: "Ramesh Kumar", need: "Chronic Cough", status: "ACTIVE", priority: "HIGH", nextStep: "Diagnostic (TB)", dueDate: "2024-10-30" },
  { id: "CE-2024-X9Y8", patient: "Sita Devi", need: "Antenatal Care", status: "DELAYED", priority: "NORMAL", nextStep: "Follow-up", dueDate: "2024-10-25" },
];

export default function Dashboard() {
  const [episodes, setEpisodes] = useState(INITIAL_EPISODES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState("");
  const [newNeed, setNewNeed] = useState("");

  const handleAddEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEp = {
      id: `CE-2024-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      patient: newPatient,
      need: newNeed,
      status: "ACTIVE",
      priority: "NORMAL",
      nextStep: "Consultation",
      dueDate: new Date().toISOString().split('T')[0]
    };
    
    // Optimistic UI update
    setEpisodes([...episodes, newEp]);
    
    // Add to offline sync queue
    await queueRequest('/api/care-episodes', 'POST', newEp);

    setIsModalOpen(false);
    setNewPatient("");
    setNewNeed("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-800">SWASTHYASETU</h1>
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-blue-600 font-semibold border-b-2 border-blue-600">Dashboard</Link>
            <Link href="/referrals" className="text-gray-600 hover:text-gray-900 font-medium">Referrals</Link>
            <Link href="/alerts" className="text-gray-600 hover:text-gray-900 font-medium">Alerts</Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <SyncStatus />
          <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">ASHA: Verified</span>
          <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Logout</Link>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Frontline Dashboard</h2>
            <p className="text-gray-500 mt-1">Manage your patients and care episodes.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow flex items-center gap-2">
            <span>+</span> New Care Episode
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Active Care Episodes</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{episodes.filter(e => e.status === 'ACTIVE').length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
            <h3 className="text-gray-500 text-sm font-medium">Delayed Care</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{episodes.filter(e => e.status === 'DELAYED').length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-100">
            <h3 className="text-gray-500 text-sm font-medium">Pending Follow-ups</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
            <h3 className="text-gray-500 text-sm font-medium">Completed This Month</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">8</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800">My Patients' Care Episodes</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Episode ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Need</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Step</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {episodes.map(ep => (
                <tr key={ep.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                    <Link href={`/care-episode/${ep.id}`}>{ep.id}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{ep.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ep.need}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ep.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ep.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ep.nextStep}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ep.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/care-episode/${ep.id}`} className="text-indigo-600 hover:text-indigo-900">Track &rarr;</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">New Care Episode</h2>
            <form onSubmit={handleAddEpisode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <input required type="text" value={newPatient} onChange={e => setNewPatient(e.target.value)} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Need</label>
                <input required type="text" value={newNeed} onChange={e => setNewNeed(e.target.value)} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100 text-gray-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
