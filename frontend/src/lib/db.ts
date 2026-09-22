import Dexie, { type Table } from 'dexie';

export interface OfflineSyncQueue {
  id?: number;
  url: string;
  method: string;
  payload: any;
  status: 'pending' | 'syncing' | 'failed';
  retryCount: number;
  createdAt: string;
}

export interface CachedCareEpisode {
  id: string; // The CE-... ID
  data: any;
  lastUpdated: string;
}

export class SwasthyaSetuDB extends Dexie {
  syncQueue!: Table<OfflineSyncQueue, number>;
  cachedEpisodes!: Table<CachedCareEpisode, string>;

  constructor() {
    super('SwasthyaSetuDB');
    this.version(1).stores({
      syncQueue: '++id, status, createdAt',
      cachedEpisodes: 'id, lastUpdated'
    });
  }
}

export const db = new SwasthyaSetuDB();

// Mock function to add a request to the sync queue
export async function queueRequest(url: string, method: string, payload: any) {
  await db.syncQueue.add({
    url,
    method,
    payload,
    status: 'pending',
    retryCount: 0,
    createdAt: new Date().toISOString()
  });
}
