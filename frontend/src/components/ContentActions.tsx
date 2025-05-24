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
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  let DURATION = 2000; // Duration for displaying action state: 2s

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard!');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), DURATION);
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
        setIsShared(true);
        setTimeout(() => setIsShared(false), DURATION)
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
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), DURATION)
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
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-sm">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z"
            fill="currentColor"
          >
          </path>
        </svg>
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <ShareIcon className="w-5 h-5" />
        Share
      </button>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-yellow-500 border border-transparent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <BookmarkIcon className="w-5 h-5" />
        {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save'}
      </button>
    </div>
  );
} 