import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import type { DailyContent } from '@/types';
import dummyData from './dummy-data.json';

export async function getDailyContent(): Promise<DailyContent[]> {
  // In a real app, you'd fetch from Firestore.
  // For this environment, we will use a timeout to simulate network latency
  // and return the dummy data.
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode: using dummy data.");
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(dummyData as DailyContent[]);
        }, 1000);
      });
    }

    const contentCollection = collection(db, 'daily_content');
    const q = query(contentCollection, where('is_visible', '==', true), orderBy('sequence', 'asc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        console.log("No documents found in Firestore, returning dummy data as fallback.");
        return dummyData as DailyContent[];
    }

    const content = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Firestore timestamps need to be converted
        created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at,
        updated_at: data.updated_at?.toDate ? data.updated_at.toDate().toISOString() : data.updated_at,
      };
    }) as DailyContent[];

    return content;
  } catch (error) {
    console.error("Error fetching data from Firestore: ", error);
    // Fallback to dummy data in case of error
    return dummyData as DailyContent[];
  }
}
