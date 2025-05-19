import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ClipboardDocumentIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import type { ContentFormat, Mood, SavedContent } from '@/types';

interface ContentActionsProps {
  content: string;
  trend: string;
  format: string;
  audience: string;
  mood: string;
  onSave: (savedContent: SavedContent) => void;
}

export function ContentActions({ content, trend, format, audience, mood, onSave }: ContentActionsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard!');
    } catch {
      toast.error('Failed to copy content');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Generated ${format} about ${trend}`,
          text: content,
        });
        toast.success('Content shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share content');
        }
      }
    } else {
      toast.error('Sharing is not supported on this browser');
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      const savedContent: SavedContent = {
        id: crypto.randomUUID(),
        content,
        trend,
        format: format as ContentFormat,
        audience,
        mood: mood as Mood,
        createdAt: new Date().toISOString(),
      };
      onSave(savedContent);
      toast.success('Content saved successfully!');
    } catch {
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
      >
        <ClipboardDocumentIcon className="w-5 h-5" />
        Copy
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
      >
        <ShareIcon className="w-5 h-5" />
        Share
      </button>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <BookmarkIcon className="w-5 h-5" />
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
} 