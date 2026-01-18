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
import { getDailyContent } from "@/lib/data";
import { Quote, Music, BookOpenText, CalendarDays } from "lucide-react";
import ContentRenderer from "@/components/content-renderer";
import AudioPlayer from "@/components/audio-player";

export default async function Home() {
  const allContent = await getDailyContent();

  const thoughts = allContent
    .filter((item) => item.type === "quote")
    .sort((a, b) => a.sequence - b.sequence);
  const songs = allContent
    .filter((item) => item.type === "song")
    .sort((a, b) => a.sequence - b.sequence);
  const slokas = allContent
    .filter((item) => item.type === "shloka")
    .sort((a, b) => a.sequence - b.sequence);
  // Panchanga is a placeholder

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          Daily Sangama
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Your daily dose of wisdom and culture.
        </p>
      </header>

      <Tabs defaultValue="thought" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-10">
          <TabsTrigger value="thought">
            <Quote className="mr-2" /> Thought
          </TabsTrigger>
          <TabsTrigger value="song">
            <Music className="mr-2" /> Song
          </TabsTrigger>
          <TabsTrigger value="sloka">
            <BookOpenText className="mr-2" /> Sloka
          </TabsTrigger>
          <TabsTrigger value="panchanga">
            <CalendarDays className="mr-2" /> Panchanga
          </TabsTrigger>
        </TabsList>

        <TabsContent value="thought" className="mt-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {thoughts.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="font-headline">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContentRenderer content={item.content} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="song" className="mt-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {songs.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="font-headline">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {item.media && item.media.type === "audio" && (
                    <div className="mb-6">
                      <AudioPlayer src={item.media.url} />
                    </div>
                  )}
                  <ContentRenderer content={item.content} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sloka" className="mt-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {slokas.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="font-headline">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContentRenderer content={item.content} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="panchanga" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Panchanga</CardTitle>
              <CardDescription>
                Today's Panchanga details will be available here soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Content for Panchanga is currently being updated. Please check
                back later.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
