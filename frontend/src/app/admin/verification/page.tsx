"use client";

import Link from 'next/link';

// Mock data
const PENDING_VERIFICATIONS = [
  { id: 1, name: "Anita Sharma", role: "ASHA", credential_type: "ASHA Soft ID", facility: "Sub-Centre Rampur", date: "2023-10-24" },
  { id: 2, name: "Rajesh Kumar", role: "CHO", credential_type: "HPR ID", facility: "HWC Sitapur", date: "2023-10-25" },
];

export default function AdminVerificationDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">SWASTHYASETU ADMIN</h1>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">Logout</Link>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Worker Verification Dashboard</h2>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credential Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {PENDING_VERIFICATIONS.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {req.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.credential_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.facility}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded">View</button>
                    <button className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded">Verify</button>
                    <button className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded">Reject</button>
                  </td>
                </tr>
              ))}
              {PENDING_VERIFICATIONS.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No pending verifications.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
