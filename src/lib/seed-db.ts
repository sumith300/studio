import { collection, writeBatch, doc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import dummyData from './dummy-data.json';
import type { DailyContent } from '@/types';
import { toast } from '@/hooks/use-toast';

// The data from JSON has an ID, which we want Firestore to generate.
// We'll pick everything except the ID.
type SeedContent = Omit<DailyContent, 'id'>;

export async function seedDatabase(firestore: Firestore) {
    if (!firestore) {
        console.error("Firestore instance is not available.");
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firestore is not ready, please try again.",
        });
        return;
    }
  const dailyContentCollection = collection(firestore, 'daily_content');
  const batch = writeBatch(firestore);

  (dummyData as DailyContent[]).forEach(({ id, ...item }) => {
    const docRef = doc(dailyContentCollection); // Firestore will auto-generate an ID
    batch.set(docRef, item as SeedContent);
  });

  try {
    await batch.commit();
    toast({
        title: "Success!",
        description: "Dummy data has been added to your Firestore database.",
    });
    console.log('Dummy data has been added to Firestore.');
  } catch (error) {
    console.error("Error seeding database: ", error);
    toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an error adding data to Firestore. Check the console for details.",
    });
  }
}
