'use client';
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Quote, Music, BookOpenText, CalendarDays } from "lucide-react";
import ContentRenderer from "@/components/content-renderer";
import AudioPlayer from "@/components/audio-player";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { DailyContent } from '@/types';
import Loading from './loading';
import { seedDatabase } from '@/lib/seed-db';

export default function Home() {
  const firestore = useFirestore();
  const dailyContentRef = useMemoFirebase(() => firestore ? collection(firestore, 'daily_content') : null, [firestore]);
  const { data: allContent, isLoading } = useCollection<DailyContent>(dailyContentRef);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    if (!firestore) return;
    setIsSeeding(true);
    await seedDatabase(firestore);
    setIsSeeding(false);
    window.location.reload();
  };

  const getIcon = (type: DailyContent['type']) => {
    switch (type) {
      case 'quote':
        return <Quote className="h-5 w-5 text-primary" />;
      case 'song':
        return <Music className="h-5 w-5 text-primary" />;
      case 'shloka':
        return <BookOpenText className="h-5 w-5 text-primary" />;
      case 'panchanga':
        return <CalendarDays className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  const tabs = allContent
    ? [
        ...new Set(allContent.map(item => item.type)),
      ].map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        icon: getIcon(type),
        content: allContent.filter(item => item.type === type),
      }))
    : [];

  if (isLoading && !allContent) {
    return <Loading />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-background text-foreground font-body">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Daily Sangama</h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-2">
            Your daily dose of wisdom and culture, from the heart of tradition.
          </p>
        </div>

        {tabs.length > 0 ? (
          <Tabs defaultValue={tabs[0].value} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-12 bg-muted/50 backdrop-blur-sm">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="capitalize text-xs md:text-sm py-2 md:py-0">
                  <div className="flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {tab.content.map((item) => (
                    <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl font-headline text-primary">{item.title}</CardTitle>
                        <CardDescription>{new Date(item.created_at).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ContentRenderer content={item.content} />
                        {item.media?.type === 'audio' && item.media.url && (
                          <div className="mt-4">
                            <AudioPlayer src={item.media.url} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center">
            <p className="mb-4">Your database is empty. Click the button to populate it with sample content.</p>
            <Button onClick={handleSeedData} disabled={isSeeding}>
              {isSeeding ? 'Adding data...' : 'Add Sample Data to Firebase'}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
