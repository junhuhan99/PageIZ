'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Site {
  id: string;
  title: string;
  theme: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewSiteModal, setShowNewSiteModal] = useState(false);
  const [newSiteTitle, setNewSiteTitle] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchSites(token);
  }, [router]);

  const fetchSites = async (token: string) => {
    try {
      const res = await fetch('/api/sites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch sites');
      }

      const data = await res.json();
      setSites(data.sites);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSite = async () => {
    const token = localStorage.getItem('token');
    if (!token || !newSiteTitle.trim()) return;

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newSiteTitle }),
      });

      if (!res.ok) {
        throw new Error('Failed to create site');
      }

      const data = await res.json();
      setSites([data.site, ...sites]);
      setShowNewSiteModal(false);
      setNewSiteTitle('');
    } catch (error) {
      console.error('Error creating site:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold">
            PageIZ
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Your Sites</h1>
          <button
            onClick={() => setShowNewSiteModal(true)}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90"
          >
            Create New Site
          </button>
        </div>

        {sites.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-xl font-medium mb-2">No sites yet</h2>
            <p className="text-black/60 mb-8">Create your first site to get started</p>
            <button
              onClick={() => setShowNewSiteModal(true)}
              className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90"
            >
              Create New Site
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <div
                key={site.id}
                className="p-6 border border-black/10 rounded-lg hover:border-black/30 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-2">{site.title}</h3>
                <div className="flex items-center gap-2 text-sm text-black/60 mb-4">
                  <span className="capitalize">{site.theme}</span>
                  <span>•</span>
                  <span className="capitalize">{site.status}</span>
                </div>
                <Link
                  href={`/editor/${site.id}`}
                  className="inline-block px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-black/90"
                >
                  Edit Site
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {showNewSiteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Create New Site</h2>
            <input
              type="text"
              value={newSiteTitle}
              onChange={(e) => setNewSiteTitle(e.target.value)}
              placeholder="Site title"
              className="w-full px-4 py-3 border border-black/20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewSiteModal(false)}
                className="flex-1 px-4 py-3 border border-black/20 rounded-lg hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSite}
                disabled={!newSiteTitle.trim()}
                className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-black/90 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
