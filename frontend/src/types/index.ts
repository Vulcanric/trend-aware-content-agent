export interface Trend {
  trends: string[];
}

export interface GenerateContentRequest {
  trend: string;
  format: ContentFormat;
  audience: string;
  mood?: Mood;
}

export interface GenerateContentResponse {
  content: string;
}

export type ContentFormat = 'Blog Post'
| 'Tweet'
| 'YouTube Video'
| 'LinkedIn Post'
| 'Newsletter'
| 'Podcast Script'
| 'Instagram Post'
| 'Facebook Post'
| 'TikTok Script'
| 'Instagram Reel Script'
| 'Other';

export type Mood = 'Professional'
| 'Informative'
| 'Engaging'
| 'Casual'
| 'Inspiring'
| 'Humorous'
| 'Educational'
| 'Persuasive'
| 'Empowering'
| 'Motivational'
| 'Thoughtful'
| 'Creative'
| 'Fun'
| 'Entertaining'
| 'None';

export interface SavedContent {
  id: string;
  content: string;
  trend: string;
  format: ContentFormat;
  audience: string;
  mood: Mood;
  createdAt: string;
}

export interface ContentHistory {
  items: SavedContent[];
} 