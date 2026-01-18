'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle } from 'lucide-react';
import { CollectionReference, addDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import type { DailyContent } from '@/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['quote', 'shloka', 'song', 'panchanga']),
  sequence: z.coerce.number().min(1, 'Sequence is required'),
  is_visible: z.boolean().default(true),
  mediaUrl: z.string().url().optional().or(z.literal('')),
  mediaType: z.enum(['audio', 'video', 'image']).optional(),
});

type AddContentFormValues = z.infer<typeof formSchema>;

interface AddContentDialogProps {
  dailyContentRef: CollectionReference | null;
}

export default function AddContentDialog({ dailyContentRef }: AddContentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'quote',
      sequence: 1,
      is_visible: true,
      mediaUrl: '',
    },
  });

  async function onSubmit(values: AddContentFormValues) {
    if (!dailyContentRef) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Database connection not available.',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const newContent: Omit<DailyContent, 'id'> = {
        title: values.title,
        content: values.content,
        type: values.type,
        sequence: values.sequence,
        is_visible: values.is_visible,
        media: values.mediaUrl && values.mediaType ? { url: values.mediaUrl, type: values.mediaType } : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Defaulting these values as they are not in the form
        community: 'sangha-bengaluru-north',
        zone: null,
        category: 'routine',
        subtype: null,
      };

      await addDoc(dailyContentRef, newContent);
      
      toast({
        title: 'Success!',
        description: 'New content has been added.',
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding document: ', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was an error adding the content. Check the console for details.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Daily Content</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new piece of content to the database.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quote">Quote</SelectItem>
                        <SelectItem value="shloka">Shloka</SelectItem>
                        <SelectItem value="song">Song</SelectItem>
                        <SelectItem value="panchanga">Panchanga</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sequence</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter content..." {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="mediaUrl"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Media URL</FormLabel>
                        <FormControl>
                        <Input placeholder="https://example.com/audio.mp3" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mediaType"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Media Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>


            <FormField
              control={form.control}
              name="is_visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Visible
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Content'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
