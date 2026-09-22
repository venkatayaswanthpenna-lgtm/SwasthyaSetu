"use client";

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function OfflineSyncPage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' && navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const pendingItems = useLiveQuery(() => db.syncQueue.toArray(), []) || [];
  const historyItems = useLiveQuery(() => db.syncHistory.orderBy('syncedAt').reverse().toArray(), []) || [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-gray-800">SWASTHYASETU</h1>
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
            <Link href="/referrals" className="text-gray-600 hover:text-gray-900 font-medium">Referrals</Link>
            <Link href="/alerts" className="text-gray-600 hover:text-gray-900 font-medium">Alerts</Link>
            <Link href="/offline-sync" className="text-blue-600 font-semibold border-b-2 border-blue-600">Offline Sync</Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Logout</Link>
        </div>
      </nav>

      <main className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Offline Sync Hub</h2>
            <p className="text-gray-500 mt-1">Manage your local data and sync history.</p>
          </div>
          <div>
            {!isOnline ? (
              <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold shadow-sm border border-yellow-300">
                You are currently OFFLINE
              </span>
            ) : (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold shadow-sm border border-green-300">
                You are currently ONLINE
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pending Queue */}
          <div className="bg-white rounded-lg shadow-sm border border-yellow-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-yellow-200 bg-yellow-50 flex justify-between items-center">
              <h3 className="font-semibold text-yellow-800">Pending Uploads ({pendingItems.length})</h3>
              {!isOnline && pendingItems.length > 0 && (
                <span className="text-xs text-yellow-700">Waiting for connection...</span>
              )}
            </div>
            
            {pendingItems.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No pending items in the queue.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {pendingItems.map((item) => {
                  let actionDesc = item.method + " " + item.url;
                  if (item.url.includes('/api/care-episodes')) actionDesc = "Create New Care Episode";
                  if (item.url.includes('/steps/')) actionDesc = "Update Care Episode Step";
                  if (item.url.includes('/api/referrals')) actionDesc = "Create Referral";
                  if (item.url.includes('/accept')) actionDesc = "Accept Referral";
                  if (item.url.includes('/api/alerts')) actionDesc = "Resolve Alert / Escalate";

                  return (
                    <li key={item.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800 text-sm">{actionDesc}</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {item.status === 'syncing' ? 'Syncing...' : 'Pending'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Added: {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Sync History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Sync History</h3>
              <button 
                onClick={() => db.syncHistory.clear()} 
                className="text-xs text-red-600 hover:text-red-800 bg-white border border-red-200 px-2 py-1 rounded shadow-sm"
              >
                Clear History
              </button>
            </div>
            
            {historyItems.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No sync history recorded yet.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {historyItems.map((item) => (
                  <li key={item.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800 text-sm">{item.action}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Success
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Synced at: {new Date(item.syncedAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
