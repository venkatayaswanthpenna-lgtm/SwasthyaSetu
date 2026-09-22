"use client";

import { useState } from 'react';
import Link from 'next/link';

// Mock Data
const INITIAL_REFERRALS = [
  { id: "REF-9921", patient: "Ramesh Kumar", from: "Sub-Centre Rampur", to: "PHC Sitapur", service: "Tuberculosis (TB) Screening", date: "2024-10-24", status: "PENDING" },
  { id: "REF-9918", patient: "Sita Devi", from: "HWC Sitapur", to: "District Hospital", service: "Ultrasound", date: "2024-10-22", status: "SCHEDULED" },
];

export default function ReferralManagement() {
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New Referral State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newService, setNewService] = useState("");

  const handleAccept = (id: string) => {
    setReferrals(referrals.map(ref => 
      ref.id === id ? { ...ref, status: "SCHEDULED" } : ref
    ));
    alert(`Referral ${id} Accepted & Scheduled!`);
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    alert(`Searching capabilities for: ${searchQuery}... Found 2 nearby facilities.`);
  };

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = {
      id: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      patient: newPatient,
      from: "My Current Facility",
      to: newTo,
      service: newService,
      date: new Date().toISOString().split('T')[0],
      status: "PENDING"
    };
    setReferrals([newRef, ...referrals]);
    setIsModalOpen(false);
    setNewPatient("");
    setNewTo("");
    setNewService("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-800">SWASTHYASETU</h1>
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
            <Link href="/referrals" className="text-blue-600 font-semibold border-b-2 border-blue-600">Referrals</Link>
            <Link href="/alerts" className="text-gray-600 hover:text-gray-900 font-medium">Alerts</Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Logout</Link>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Referral Coordination</h2>
            <p className="text-gray-500 mt-1">Manage incoming and outgoing patient referrals.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow flex items-center gap-2">
            Create Referral
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Service Capability Search</h3>
            <p className="text-sm text-gray-500 mb-4">Find facilities capable of providing specific services.</p>
            <div className="flex gap-2">
              <select value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Service Needed...</option>
                <option value="Diagnostic - Ultrasound">Diagnostic - Ultrasound</option>
                <option value="Diagnostic - X-Ray">Diagnostic - X-Ray</option>
                <option value="Treatment - DOTS">Treatment - DOTS</option>
                <option value="Maternal - C-Section">Maternal - C-Section</option>
              </select>
              <button onClick={handleSearch} className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700">Search</button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-center">
             <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Incoming Pending Referrals</h4>
                  <p className="text-3xl font-bold text-orange-600">{referrals.filter(r => r.status === 'PENDING' && r.to !== 'My Current Facility').length}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Outgoing Pending Referrals</h4>
                  <p className="text-3xl font-bold text-blue-600">{referrals.filter(r => r.status === 'PENDING' && r.from === 'My Current Facility').length}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Active Referrals</h3>
            <div className="flex gap-2 text-sm">
                <button className="px-3 py-1 bg-white border rounded shadow-sm">All</button>
                <button className="px-3 py-1 bg-white border rounded shadow-sm text-orange-600 font-medium">Incoming</button>
                <button className="px-3 py-1 bg-white border rounded shadow-sm text-blue-600 font-medium">Outgoing</button>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To (Requested)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referrals.map(ref => (
                <tr key={ref.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{ref.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{ref.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ref.from}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ref.to}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ref.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ref.status === 'PENDING' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {ref.status === 'PENDING' ? (
                        <button onClick={() => handleAccept(ref.id)} className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded shadow-sm text-xs">Accept & Schedule</button>
                    ) : (
                        <button onClick={() => alert("Viewing Details for " + ref.id)} className="text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded border text-xs">View Details</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Create Referral Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Create Outgoing Referral</h2>
            <form onSubmit={handleCreateReferral} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <input required type="text" value={newPatient} onChange={e => setNewPatient(e.target.value)} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination Facility</label>
                <input required type="text" value={newTo} onChange={e => setNewTo(e.target.value)} placeholder="e.g. District Hospital" className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Required Service</label>
                <select required value={newService} onChange={e => setNewService(e.target.value)} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Service...</option>
                  <option value="Diagnostic - Ultrasound">Diagnostic - Ultrasound</option>
                  <option value="Diagnostic - X-Ray">Diagnostic - X-Ray</option>
                  <option value="Treatment - DOTS">Treatment - DOTS</option>
                  <option value="Maternal - C-Section">Maternal - C-Section</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100 text-gray-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit Referral</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
