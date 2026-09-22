"use client";

import { useState } from 'react';
import Link from 'next/link';
import { queueRequest } from '@/lib/db';

// Mock Data
const INITIAL_ESCALATIONS = [
  { id: 1, type: "DELAYED_CARE", patient: "Sita Devi", care_episode: "CE-2024-X9Y8", overdue_by: "5 days", from: "ASHA Sunita", status: "ACTIVE" },
  { id: 2, type: "MISSED_FOLLOWUP", patient: "Rahul Sharma", care_episode: "CE-2024-L3P1", overdue_by: "2 days", from: "PHC Sitapur", status: "ACTIVE" },
];

export default function ContinuityAlerts() {
  const [escalations, setEscalations] = useState(INITIAL_ESCALATIONS);

  const handleResolve = async (id: number) => {
    setEscalations(escalations.filter(esc => esc.id !== id));
    await queueRequest(`/api/alerts/${id}/resolve`, 'POST', {});
    alert(`Escalation ${id} marked as resolved! Action queued for sync.`);
  };

  const handleRunScan = () => {
    alert("Running background delay scan...");
    setTimeout(() => {
      alert("Scan complete! No new delays found.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-red-800">SWASTHYASETU ESCALATIONS</h1>
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
            <Link href="/referrals" className="text-gray-600 hover:text-gray-900 font-medium">Referrals</Link>
            <Link href="/alerts" className="text-red-600 font-semibold border-b-2 border-red-600">Alerts</Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Logout</Link>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Continuity Alerts</h2>
            <p className="text-gray-500 mt-1">Review and resolve delayed care episodes and missed follow-ups.</p>
          </div>
          <button onClick={handleRunScan} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-md shadow text-sm">
            Run Delay Scan Now
          </button>
        </div>

        {escalations.length > 0 ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Attention Required:</strong> You have {escalations.length} active escalations that require immediate intervention.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>All Good:</strong> No active escalations at the moment.
                </p>
              </div>
            </div>
          </div>
        )}

        {escalations.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Care Episode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overdue By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escalated From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {escalations.map(esc => (
                  <tr key={esc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">{esc.type.replace('_', ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{esc.patient}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                      <Link href={`/care-episode/${esc.care_episode}`}>{esc.care_episode}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-500">{esc.overdue_by}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{esc.from}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleResolve(esc.id)} className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded shadow-sm text-xs">Review & Resolve</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
