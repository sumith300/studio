export type Media = {
  url: string;
  type: 'audio' | 'video' | 'image';
};

export type DailyContent = {
  id: string;
  title: string;
  content: string;
  community: string;
  zone: string | null;
  category: string;
  type: 'quote' | 'shloka' | 'song' | 'panchanga';
  subtype: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  sequence: number;
  media: Media | null;
};
