"use client";

import { useState } from 'react';
import Link from 'next/link';

const ROLES = [
  "ASHA", "AWW", "ANM", "CHO", "PHC STAFF", "DOCTOR", "ADMINISTRATOR"
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "failed" | null>(null);

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setStep(2);
  };

  const simulateVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationStatus("pending");
    
    // Simulate API Call
    setTimeout(() => {
      setVerificationStatus("verified");
      setTimeout(() => setStep(3), 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-2">Health Worker Registration</h1>
        <p className="text-gray-500 text-center mb-8">Join SwasthyaSetu to coordinate care in your community.</p>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Step 1: Select Your Role</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                  className="p-3 border rounded text-sm font-medium hover:bg-blue-50 hover:border-blue-500 transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Credential Verification */}
        {step === 2 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Step 2: Verify Credentials</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">{role}</span>
            </div>
            
            <form onSubmit={simulateVerification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Professional Identifier
                </label>
                <input required type="text" className="w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. HPR ID, ASHA Soft ID, NUID" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registered Mobile Number
                </label>
                <input required type="tel" className="w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="10-digit mobile number" />
              </div>

              {verificationStatus === "pending" && (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying with official registry...
                </div>
              )}

              {verificationStatus === "verified" && (
                <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded">
                  <p className="font-bold">✓ Verification Successful</p>
                  <p className="text-sm">Your professional identity has been verified.</p>
                </div>
              )}

              {!verificationStatus && (
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                  Submit for Verification
                </button>
              )}
            </form>
          </div>
        )}

        {/* Step 3: Account Setup */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Step 3: Account Setup</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                <input type="password" className="w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" className="w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <button onClick={() => alert("Registration Complete!")} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                Complete Registration
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center border-t pt-4">
          <Link href="/login" className="text-blue-600 hover:underline text-sm">
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
