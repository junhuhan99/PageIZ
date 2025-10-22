'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Page {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
}

interface Block {
  id: string;
  type: string;
  order: number;
  payload: any;
}

interface Site {
  id: string;
  title: string;
  theme: string;
  pages: Page[];
}

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const siteId = params.id as string;

  const [site, setSite] = useState<Site | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showNewBlockModal, setShowNewBlockModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newBlockType, setNewBlockType] = useState('text');
  const [newBlockContent, setNewBlockContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchSite(token);
  }, [router, siteId]);

  const fetchSite = async (token: string) => {
    try {
      const res = await fetch(`/api/sites?id=${siteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch site');
      }

      const data = await res.json();
      const foundSite = data.sites.find((s: Site) => s.id === siteId);

      if (foundSite) {
        setSite(foundSite);
        if (foundSite.pages.length > 0) {
          setCurrentPage(foundSite.pages[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching site:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    const token = localStorage.getItem('token');
    if (!token || !newPageTitle.trim() || !newPageSlug.trim()) return;

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId,
          title: newPageTitle,
          slug: newPageSlug,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create page');
      }

      const data = await res.json();
      if (site) {
        setSite({ ...site, pages: [...site.pages, data.page] });
        setCurrentPage(data.page);
      }
      setShowNewPageModal(false);
      setNewPageTitle('');
      setNewPageSlug('');
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const handleCreateBlock = async () => {
    const token = localStorage.getItem('token');
    if (!token || !currentPage || !newBlockContent.trim()) return;

    try {
      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pageId: currentPage.id,
          type: newBlockType,
          payload: { content: newBlockContent },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create block');
      }

      const data = await res.json();
      const updatedPage = {
        ...currentPage,
        blocks: [...currentPage.blocks, data.block],
      };
      setCurrentPage(updatedPage);

      if (site) {
        setSite({
          ...site,
          pages: site.pages.map((p) =>
            p.id === currentPage.id ? updatedPage : p
          ),
        });
      }

      setShowNewBlockModal(false);
      setNewBlockContent('');
    } catch (error) {
      console.error('Error creating block:', error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    const token = localStorage.getItem('token');
    if (!token || !currentPage) return;

    try {
      const res = await fetch(`/api/blocks?id=${blockId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete block');
      }

      const updatedPage = {
        ...currentPage,
        blocks: currentPage.blocks.filter((b) => b.id !== blockId),
      };
      setCurrentPage(updatedPage);

      if (site) {
        setSite({
          ...site,
          pages: site.pages.map((p) =>
            p.id === currentPage.id ? updatedPage : p
          ),
        });
      }
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">사이트를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-2xl font-semibold">
              PageIZ
            </Link>
            <span className="text-black/40">/</span>
            <span className="text-lg font-medium">{site.title}</span>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium hover:underline"
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 - 페이지 목록 */}
        <aside className="w-64 border-r border-black/10 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">페이지</h2>
              <button
                onClick={() => setShowNewPageModal(true)}
                className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-black/90"
              >
                + 추가
              </button>
            </div>
            <div className="space-y-2">
              {site.pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    currentPage?.id === page.id
                      ? 'bg-black text-white'
                      : 'hover:bg-black/5'
                  }`}
                >
                  {page.title}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 메인 에디터 영역 */}
        <main className="flex-1 p-8">
          {currentPage ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-semibold mb-2">
                    {currentPage.title}
                  </h1>
                  <p className="text-black/60">/{currentPage.slug}</p>
                </div>
                <button
                  onClick={() => setShowNewBlockModal(true)}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90"
                >
                  블록 추가
                </button>
              </div>

              {currentPage.blocks.length === 0 ? (
                <div className="text-center py-24">
                  <h2 className="text-xl font-medium mb-2">
                    블록이 없습니다
                  </h2>
                  <p className="text-black/60 mb-8">
                    첫 번째 블록을 추가해보세요
                  </p>
                  <button
                    onClick={() => setShowNewBlockModal(true)}
                    className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90"
                  >
                    블록 추가
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentPage.blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div
                        key={block.id}
                        className="p-6 border border-black/10 rounded-lg hover:border-black/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-xs text-black/60 mb-2 uppercase">
                              {block.type}
                            </div>
                            <div className="text-lg">
                              {block.payload.content || JSON.stringify(block.payload)}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <h2 className="text-xl font-medium mb-2">페이지가 없습니다</h2>
              <p className="text-black/60 mb-8">
                첫 번째 페이지를 만들어보세요
              </p>
              <button
                onClick={() => setShowNewPageModal(true)}
                className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90"
              >
                페이지 만들기
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 새 페이지 모달 */}
      {showNewPageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">새 페이지 만들기</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  페이지 제목
                </label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="홈"
                  className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL 슬러그
                </label>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="home"
                  className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewPageModal(false)}
                className="flex-1 px-4 py-3 border border-black/20 rounded-lg hover:bg-black/5"
              >
                취소
              </button>
              <button
                onClick={handleCreatePage}
                disabled={!newPageTitle.trim() || !newPageSlug.trim()}
                className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-black/90 disabled:opacity-50"
              >
                만들기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 새 블록 모달 */}
      {showNewBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">블록 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  블록 타입
                </label>
                <select
                  value={newBlockType}
                  onChange={(e) => setNewBlockType(e.target.value)}
                  className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="text">텍스트</option>
                  <option value="heading">제목</option>
                  <option value="link">링크</option>
                  <option value="button">버튼</option>
                  <option value="image">이미지</option>
                  <option value="video">비디오</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  내용
                </label>
                <textarea
                  value={newBlockContent}
                  onChange={(e) => setNewBlockContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  rows={4}
                  className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewBlockModal(false)}
                className="flex-1 px-4 py-3 border border-black/20 rounded-lg hover:bg-black/5"
              >
                취소
              </button>
              <button
                onClick={handleCreateBlock}
                disabled={!newBlockContent.trim()}
                className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-black/90 disabled:opacity-50"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
