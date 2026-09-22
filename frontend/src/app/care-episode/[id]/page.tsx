"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CareEpisodeDetail() {
  const params = useParams();
  const id = params.id as string;

  const [steps, setSteps] = useState([
      { seq: 1, action: "CONSULTATION", status: "COMPLETED", date: "2024-10-20", facility: "Sub-Centre Rampur", worker: "ASHA Anita", notes: "Patient reported chronic cough and slight fever." },
      { seq: 2, action: "DIAGNOSTIC", status: "COMPLETED", date: "2024-10-22", facility: "PHC Sitapur", worker: "Lab Tech Sunita", notes: "Sputum test collected." },
      { seq: 3, action: "REFERRAL", status: "IN_PROGRESS", date: "2024-10-26", facility: "District Hospital", worker: "Pending", notes: "Referral for X-Ray based on sputum results." },
      { seq: 4, action: "TREATMENT", status: "PLANNED", date: "-", facility: "PHC Sitapur", worker: "Pending", notes: "Initiate DOTS if positive." },
      { seq: 5, action: "FOLLOW_UP", status: "PLANNED", date: "-", facility: "Sub-Centre Rampur", worker: "ASHA Anita", notes: "Check medication adherence." }
  ]);

  const EPISODE = {
    id: id || "CE-2024-A1B2",
    patient: "Ramesh Kumar",
    need: "Chronic Cough (> 2 weeks)",
    priority: "HIGH",
    status: "ACTIVE",
    pathway: "Tuberculosis (TB) Screening",
  };

  const completedCount = steps.filter(s => s.status === 'COMPLETED').length;
  const completionRate = `${Math.round((completedCount / steps.length) * 100)}%`;

  const handleUpdateStatus = (seq: number) => {
    setSteps(steps.map(step => {
      if (step.seq === seq) {
        return { ...step, status: "COMPLETED", date: new Date().toISOString().split('T')[0] };
      }
      if (step.seq === seq + 1 && step.status === "PLANNED") {
        return { ...step, status: "IN_PROGRESS" };
      }
      return step;
    }));
    alert("Status Updated to COMPLETED!");
  };

  const handleEscalateDelay = (seq: number) => {
    setSteps(steps.map(step => {
      if (step.seq === seq) {
        return { ...step, status: "ESCALATED" };
      }
      return step;
    }));
    alert("Delay Escalated to Medical Officer!");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <nav className="bg-white shadow-sm px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">&larr; Back to Dashboard</Link>
          <span className="text-gray-300">|</span>
          <h1 className="font-semibold text-gray-800">Care Episode: {EPISODE.id}</h1>
        </div>
      </nav>

      <main className="p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{EPISODE.patient}</h2>
            <p className="text-gray-600 mt-1">Need: <span className="font-semibold text-gray-800">{EPISODE.need}</span></p>
            <p className="text-gray-600">Pathway: <span className="font-semibold text-gray-800">{EPISODE.pathway}</span></p>
          </div>
          <div className="text-right">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold mr-2">PRIORITY: {EPISODE.priority}</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">STATUS: {EPISODE.status}</span>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Care Completion</p>
              <div className="w-48 bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: completionRate }}></div>
              </div>
              <p className="text-xs text-right mt-1 font-semibold text-blue-600">{completionRate}</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-6">Care Timeline</h3>
        <div className="relative border-l border-gray-200 ml-3 space-y-8">
          {steps.map((step) => {
            const isCompleted = step.status === "COMPLETED";
            const isInProgress = step.status === "IN_PROGRESS";
            const isEscalated = step.status === "ESCALATED";
            
            return (
              <div key={step.seq} className="mb-8 ml-6 relative">
                <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-9 ring-4 ring-white ${
                  isCompleted ? 'bg-green-500' : isEscalated ? 'bg-red-500' : isInProgress ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  {isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </span>
                
                <div className={`p-5 rounded-lg border shadow-sm ${
                  isEscalated ? 'bg-red-50 border-red-200' : isInProgress ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900">{step.action} - <span className={isEscalated ? 'text-red-600' : ''}>{step.status}</span></h4>
                    <span className="text-sm font-medium text-gray-500">{step.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-700">Facility:</span> {step.facility}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Assigned:</span> {step.worker}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded">{step.notes}</p>
                  
                  {isInProgress && (
                    <div className="mt-4 pt-4 border-t border-blue-100 flex gap-3">
                      <button onClick={() => handleUpdateStatus(step.seq)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded text-sm transition-colors">
                        Update Status
                      </button>
                      <button onClick={() => handleEscalateDelay(step.seq)} className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-1.5 px-4 rounded border border-red-200 text-sm transition-colors">
                        Escalate Delay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
