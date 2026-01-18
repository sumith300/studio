import type { DailyContent } from '@/types';
import dummyData from './dummy-data.json';

export async function getDailyContent(): Promise<DailyContent[]> {
  // We'll use a promise to simulate async fetching, but just return the local dummy data.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(dummyData as DailyContent[]);
    }, 500); // Simulate a short network delay
  });
}
