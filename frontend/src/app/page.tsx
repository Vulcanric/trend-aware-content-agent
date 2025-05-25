'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Select } from '@/components/Select';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ContentActions } from '@/components/ContentActions';
import { ContentHistory } from '@/components/ContentHistory';
import { getTrends, generateContent } from '@/lib/api';
import type { ContentFormat, Mood, SavedContent } from '@/types';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, SunIcon, MoonIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const CONTENT_FORMATS: { value: ContentFormat; label: string }[] = [
  { value: 'Blog Post', label: 'Blog Post' },
  { value: 'Tweet', label: 'Tweet' },
  { value: 'YouTube Video', label: 'YouTube Video' },
  { value: 'LinkedIn Post', label: 'LinkedIn Post' },
  { value: 'Newsletter', label: 'Newsletter' },
  { value: 'Podcast Script', label: 'Podcast Script'},
  { value: 'Instagram Post', label: 'Instagram Post' },
  { value: 'Facebook Post', label: 'Facebook Post' },
  { value: 'TikTok Script', label: 'TikTok Script' },
  { value: 'Instagram Reel Script', label: 'Instagram Reel Script' },
  { value: 'Other', label: 'Other' },
];

const MOODS: { value: Mood; label: string }[] = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Inspiring', label: 'Inspiring' },
  { value: 'Humorous', label: 'Humorous' },
  { value: 'Educational', label: 'Educational' },
  { value: 'Engaging', label: 'Engaging' },
  { value: 'Persuasive', label: 'Persuasive' },
  { value: 'Empowering', label: 'Empowering' },
  { value: 'Motivational', label: 'Motivational' },
  { value: 'Thoughtful', label: 'Thoughtful' },
  { value: 'Creative', label: 'Creative' },
  { value: 'Informative', label: 'Informative' },
  { value: 'Entertaining', label: 'Entertaining' },
  { value: 'Fun', label: 'Fun' },
  { value: 'None', label: 'None' },
];

export default function Home() {
  const [trends, setTrends] = useState<string[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<string>('');
  const [customTrend, setCustomTrend] = useState<string>('');
  const [format, setFormat] = useState<ContentFormat>('Blog Post');
  const [audience, setAudience] = useState<string>('');
  const [mood, setMood] = useState<Mood>('Professional');
  const [content, setContent] = useState<string>('');
  const [isFetchingTrends, setIsFetchingTrends] = useState(false)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [showTrendSidebar, setShowTrendSidebar] = useState(true);
  const [showContentSidebar, setShowContentSidebar] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchTrends = async () => {
    setIsFetchingTrends(true);
    try {
      const data = await getTrends();
      setTrends(data.trends);
      if (data.trends.length > 0) {
        setSelectedTrend(data.trends[0]);
      }
    } catch {
      toast.error('Failed to fetch trends');
    } finally {
      setIsFetchingTrends(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  // Load saved content from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedContent');
    if (saved) {
      try {
        setSavedContent(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved content:', error);
      }
    }
  }, []);

  // Save content to localStorage
  useEffect(() => {
    localStorage.setItem('savedContent', JSON.stringify(savedContent));
  }, [savedContent]);

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle sidebar animation
  useEffect(() => {
    if (showContentSidebar) {
      setSidebarVisible(true);
      // Trigger open transition after mount
      setTimeout(() => setSidebarOpen(true), 10);
    } else {
      setSidebarOpen(false);
      const timeout = setTimeout(() => setSidebarVisible(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [showContentSidebar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrend && !customTrend) {
      toast.error('Please select or enter a trend');
      return;
    }
    if (!audience) {
      toast.error('Please specify your target audience');
      return;
    }

    setContent('')
    setIsGeneratingContent(true);
    try {
      const response = await generateContent({
        trend: customTrend || selectedTrend,
        format,
        audience,
        mood,
      });

      setIsGeneratingContent(false)
      // Animate content display
      response.content.split('\n').forEach((line) => {
        setTimeout(
          () => setContent(prev => prev + `${line}\n`),
          1000
        );
      });
      toast.success('Content generated successfully!');
    } catch {
      toast.error('Failed to generate content');
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleSaveContent = (content: SavedContent) => {
    setSavedContent((prev) => [content, ...prev]);
  };

  const handleDeleteContent = (id: string) => {
    setSavedContent((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelectContent = (content: SavedContent) => {
    setContent(content.content);
    setCustomTrend(content.trend);
    setFormat(content.format);
    setAudience(content.audience);
    setMood(content.mood);
    setShowHistory(false);
    setShowContentSidebar(true);
  };

  return (
    <>
    <header className="h-15 border-b border-gray-300 dark:border-gray-200 relative">
        {/* Dark mode toggle - moved to top-right corner */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="fixed top-4 right-4 z-100 p-2 rounded-md bg-gray-50/50 hover:bg-gray-100/80 focus:bg-gray-300 shadow-lg transition-colors duration-300"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <SunIcon className="size-5 text-orange-500" />
          ) : (
            <MoonIcon className="size-5 text-gray-900 dark:text-gray-300" />
          )}
        </button>
    </header>
    <main className="h-[90%] p-0 flex dark:bg-gray-900 dark:text-white overflow-x-hidden bg-gradient-to-b from-[#E1E3E6] to-white">
      {/* History toggle - moved to top-right corner */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="fixed top-4 left-16 z-100 p-2 rounded-md bg-gray-50/50 hover:bg-gray-100/80 focus:bg-gray-300 shadow-lg transition-colors duration-300"
        aria-label="Toggle history"
      >
        <ClockIcon className="size-5 dark:text-white text-gray-700" />
      </button>

      <div className="w-full flex gap-0 h-full min-h-0">
        {/* Sidebar (Left) */}
        <aside
          className={`w-full md:w-75 h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow md:sticky md:top-0 md:left-0 md:rounded-none
            md:rounded-r-xl border-r border-gray-500 dark:border-gray-700 fixed z-50
            ${showTrendSidebar ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'}`
          }
        >
          {/* Trends Sidebar toggle button */}
          <button
            className="absolute top-1/2 -translate-y-1/2 -right-6 z-[100] flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-300 shadow-lg rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
            onClick={() => setShowTrendSidebar(!showTrendSidebar)}
            aria-label="Toggle trends sidebar"
          >
            <span className='sr-only'>Show current trends</span>
            <ChevronRightIcon className={`w-6 h-6 text-gray-700 dark:text-gray-300 ${showTrendSidebar && 'rotate-180'}`} />
          </button>
          <div className="pl-2 py-5 bg-gray-500 dark:bg-gray-700 flex items-center gap-2 sticky top-0 z-10">
            <h2 className="text-xl font-extrabold shrink-0 flex items-center gap-2">
              <span>🔥</span>
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Trending Topics</span>
            </h2>
          </div>
          <div className="p-4 h-3/4">
            <ul className="h-full space-y-1 overflow-y-scroll">
              {trends.map((trend) => (
                <li key={trend}>
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-base
                      ${selectedTrend === trend ? 'text-gray-900 font-semibold' : 'hover:bg-gray-300 text-gray-700'}`}
                    onClick={() => {
                      setSelectedTrend(trend);
                      setCustomTrend(trend);
                    }}
                  >
                    {trend}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className='p-4'>
            <button
              className='flex items-center justify-center gap-2 p-3 font-medium rounded-lg w-full bg-gradient-to-r from-orange-500 to-yellow-500
              hover:from-yellow-500 hover:to-orange-500 disabled:cursor-not-allowed cursor-pointer transition-all duration-300'
              onClick={async () => await fetchTrends()}
              disabled={isFetchingTrends}
            >
              {isFetchingTrends ? (
                <>
                <span className='border-2 border-t-transparent border-black dark:border-white size-4 rounded-full animate-spin' />
                Refreshing...
                </>
              ) : (
                <>
                <ArrowPathIcon className='size-5'/>
                Refresh
                </>
              )}
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col px-3 justify-center relative" style={{ minHeight: '100vh' }}>
          {/* <div className="text-center mb-4 mt-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-2 mb-2">
              <span className="relative inline-block">
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-15 h-14 bg-gradient-to-t from-orange-500/100 to-yellow-300/0 rounded-full blur-sm animate-pulse duration-1000"></span>
                <span className="inline-block align-middle">🔥</span>
              </span>
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent relative z-10">
                  Trend-Aware Content Generator
              </span>
            </h1>
            <p className="text-lg text-gray-400 dark:text-gray-400">
              Generate engaging content based on trending topics
            </p>
          </div> */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur p-6 rounded-xl shadow-2xl">
            <div>
              <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">OR Enter Custom Topic</label>
              <input
                type="text"
                value={customTrend}
                onChange={(e) => {
                  setCustomTrend(e.target.value);
                  setSelectedTrend('');
                }}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 text-lg text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700"
                placeholder="Enter your custom trend"
              />
            </div>
            <Select
              value={format}
              onChange={setFormat}
              options={CONTENT_FORMATS}
              label="Content Format"
            />
            <div>
              <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 text-lg text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700"
                placeholder="e.g., startup founders, tech enthusiasts"
              />
            </div>
            <Select
              value={mood}
              onChange={setMood}
              options={MOODS}
              label="Content Tone"
            />
            <button
              type="submit"
              disabled={isGeneratingContent}
              className="w-full flex justify-center items-center py-3 px-4 gap-3 border border-transparent rounded-lg shadow-sm text-lg font-medium
              bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGeneratingContent ? (
                <span className='text-2xl animate-pulse duration-500'>✨</span>
              ) : (
                <>
                <span className='text-xl'>✨</span>
                Generate Content
                </>
              )}
              {/* {isGeneratingContent ? 'Generating...' : '✨ Generate Content'} */}
            </button>
          </form>
          {/* Display generated content for mobile devices */}
          {
            (isGeneratingContent || content) && (
              <>
              <br />
              <div className='w-full flex md:hidden gap-1'>
                <span className='text-2xl'>✨</span>
                <div className='prose max-w-full pt-1 text-lg dark:prose-invert flex flex-col'>
                  {
                    isGeneratingContent ? (
                      <span className='animate-pulse'>Hold up! I&apos;m crunching on the latest data to give you the best content.</span>
                    ) : content && (
                      <>
                      <div className="w-[90%] whitespace-pre-wrap overflow-x-scroll bg-gray-100/10 dark:bg-gray-800/10 backdrop-blur text-gray-700 text-base dark:text-gray-300"><Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown></div>
                      <ContentActions
                          content={content}
                          trend={customTrend || selectedTrend}
                          format={format}
                          audience={audience}
                          mood={mood}
                          onSave={handleSaveContent}
                      />
                      </>
                    )
                  }
                </div>
              </div>
              </>
            )            
          }
        </div>

        {/* Sidebar (Right) for Generated Content */}
        <aside
          className={`hidden md:flex flex-col md:flex-row md:w-1/4 bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow md:h-full md:sticky md:top-0 md:right-0 border-l border-gray-500
            transition-transform duration-500 ease-in-out relative z-50
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-[95%]'}`}
        >
          {/* Show content sidebar button - attached to sidebar */}
          <button
            className="absolute top-1/2 -translate-y-1/2 -left-6 z-[100] flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-300 shadow-lg rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
            onClick={() => setShowContentSidebar(!showContentSidebar)}
            aria-label="Toggle generated content sidebar"
          >
            <span className="sr-only">Show Generated Content</span>
            <ChevronLeftIcon className={`w-6 h-6 text-gray-700 dark:text-gray-300 ${showContentSidebar && 'rotate-180'}`} />
          </button>

          {sidebarVisible && (
            <div className="flex flex-col h-full w-full">
              <div className="flex items-center justify-between pl-5 py-5 bg-gray-500 dark:bg-gray-700 mb-2 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <h2 className="text-xl font-extrabold shrink-0 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Generated Content</h2>
                </div>
              </div>
              {/* <br /> */}
              <div className="prose max-w-none text-lg dark:prose-invert h-full p-4 flex flex-col items-center relative">
                {isGeneratingContent ? (
                  <div className="text-center text-gray-500 dark:text-gray-500 font-small absolute top-1/2 flex flex-col animate-pulse">
                    <span>Hold up!</span>AI is crunching on the latest data to give you the best content.
                  </div>
                ) : content ? (
                  <>
                    <div className="w-full h-[70%] whitespace-pre-wrap overflow-y-scroll bg-gray-100/10 dark:bg-gray-800/10 backdrop-blur rounded-lg p-4 text-gray-700 text-base dark:text-gray-300"><Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown></div>
                    <ContentActions
                      content={content}
                      trend={customTrend || selectedTrend}
                      format={format}
                      audience={audience}
                      mood={mood}
                      onSave={handleSaveContent}
                    />
                  </>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500 absolute top-1/2">No content to display</div>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* History Sidebar */}
        {showHistory && (
          <aside className="fixed right-0 w-full md:w-1/4 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur shadow-lg p-4 overflow-y-auto z-50 border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between pl-2 py-4 bg-gray-100 dark:bg-gray-700 mb-4 rounded-lg sticky top-0">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-extrabold shrink-0 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">Content History</h2>
              </div>
              <button
                className="ml-2 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-20"
                onClick={() => setShowHistory(false)}
                aria-label="Close history"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <ContentHistory
              items={savedContent}
              onDelete={handleDeleteContent}
              onSelect={handleSelectContent}
            />
          </aside>
        )}
      </div>
    </main>
    </>
  );
}
