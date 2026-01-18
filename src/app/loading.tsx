import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <Skeleton className="h-12 w-1/2 mx-auto" />
        <Skeleton className="h-4 w-1/3 mx-auto mt-4" />
      </div>
      <div className="w-full">
        <div className="flex justify-center mb-6">
          <Skeleton className="h-10 w-full max-w-lg" />
        </div>
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
             <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
