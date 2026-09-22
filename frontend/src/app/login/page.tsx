"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ROLES = [
  "ASHA", "AWW", "ANM", "CHO", "PHC STAFF", "DOCTOR", "ADMINISTRATOR", "PATIENT / FAMILY"
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow anyone with any details to log in for demo purposes
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">SWASTHYASETU</h1>
        <p className="text-gray-600 font-medium">Connect the Care Journey. Track What Matters. Complete the Care.</p>
      </div>

      <div className="bg-white shadow-xl rounded-xl p-8 max-w-4xl w-full">
        {!selectedRole ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Select Your Role</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="font-semibold text-gray-700">{role}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/" className="text-blue-600 hover:underline">
                &larr; Back to Home
              </Link>
            </div>
          </>
        ) : (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{selectedRole} Login</h2>
            
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedRole === "ASHA" ? "ASHA / ASHA Soft ID" : 
                   selectedRole === "ANM" ? "NUID" : 
                   "Primary Identifier"}
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Enter ID"
                />
              </div>

              {["ASHA", "ANM", "CHO"].includes(selectedRole) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedRole === "ANM" ? "State Nursing Council Registration No." : "Additional Identifier"}
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter additional ID"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registered Mobile Number
                </label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  VERIFY IDENTITY & LOGIN
                </button>
              </div>
            </form>
            
            <div className="mt-6 flex justify-between items-center text-sm">
              <button 
                onClick={() => setSelectedRole(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                &larr; Change Role
              </button>
              <Link href="/register" className="text-blue-600 hover:underline">
                Register as Health Worker
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
