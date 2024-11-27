'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<'audio' | 'video'>('video');
  const [quality, setQuality] = useState('highest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = () => {
    if (!url) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    setError('');
    setLoading(true);

    const downloadUrl = `/api/download?url=${encodeURIComponent(
      url
    )}&format=${format}&quality=${quality}`;

    window.location.href = downloadUrl;
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-primary mb-4">YouTube Downloader</h1>
        <input
          type="text"
          placeholder="Enter YouTube URL"
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-secondary"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium">Format:</label>
          <select
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            value={format}
            onChange={(e) => setFormat(e.target.value as 'audio' | 'video')}
          >
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium">Quality:</label>
          <select
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <button
          className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-secondary hover:bg-primary'
          }`}
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Download'}
        </button>
      </div>
    </main>
  );
}
