"use client";

import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function SyncStatus() {
  const [isOnline, setIsOnline] = useState(true);
  
  // Use Dexie live query to count pending items in the offline queue
  const pendingCount = useLiveQuery(
    () => db.syncQueue.where('status').equals('pending').count(),
    []
  ) ?? 0;

  useEffect(() => {
    // Check initial status
    setIsOnline(typeof navigator !== 'undefined' && navigator.onLine);

    const processSyncQueue = async () => {
      if (!navigator.onLine) return;
      
      const pendingItems = await db.syncQueue.where('status').equals('pending').toArray();
      if (pendingItems.length === 0) return;

      // Mark all as syncing
      await Promise.all(pendingItems.map(item => 
        db.syncQueue.update(item.id!, { status: 'syncing' })
      ));

      // Simulate API sync with a slight delay per item
      for (const item of pendingItems) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulated network latency
        console.log(`Synced ${item.method} to ${item.url}`);
        // Delete after successful sync
        await db.syncQueue.delete(item.id!);
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      processSyncQueue();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check just in case we started online with pending items
    if (typeof navigator !== 'undefined' && navigator.onLine) {
        processSyncQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && pendingCount === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        Synced
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
        Offline Mode ({pendingCount} pending)
      </div>
    );
  }

  // Online but with pending items (syncing in progress)
  return (
    <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
      <svg className="animate-spin h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Syncing {pendingCount} items...
    </div>
  );
}
