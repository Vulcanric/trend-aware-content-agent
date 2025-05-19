import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { SavedContent } from '@/types';

interface ContentHistoryProps {
  items: SavedContent[];
  onDelete: (id: string) => void;
  onSelect: (content: SavedContent) => void;
}

export function ContentHistory({ items, onDelete, onSelect }: ContentHistoryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this saved content?')) {
      onDelete(id);
      toast.success('Content deleted successfully');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <ClockIcon className="w-12 h-12 mb-2" />
        <p>No saved content yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            setSelectedId(item.id);
            onSelect(item);
          }}
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            selectedId === item.id
              ? 'bg-orange-50 border-orange-200'
              : 'bg-white hover:bg-gray-50 border-gray-200'
          } border`}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900">{item.trend}</h3>
              <p className="text-sm text-gray-500">{item.format}</p>
              <p className="text-sm text-gray-500">
                {formatDate(item.createdAt)}
              </p>
            </div>
            <button
              onClick={(e) => handleDelete(item.id, e)}
              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.content}</p>
        </div>
      ))}
    </div>
  );
} 