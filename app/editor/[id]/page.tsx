'use client';

import { useEffect, useState, useRef } from 'react';
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

const BLOCK_TYPES = [
  { value: 'text', label: '텍스트', icon: '📝' },
  { value: 'heading', label: '제목', icon: '📰' },
  { value: 'link', label: '링크', icon: '🔗' },
  { value: 'button', label: '버튼', icon: '🔘' },
  { value: 'image', label: '이미지', icon: '🖼️' },
  { value: 'video', label: '비디오', icon: '🎥' },
  { value: 'gallery', label: '갤러리', icon: '🎨' },
  { value: 'divider', label: '구분선', icon: '➖' },
  { value: 'spacer', label: '여백', icon: '⬜' },
  { value: 'social', label: '소셜 링크', icon: '🌐' },
  { value: 'email', label: '이메일 폼', icon: '📧' },
  { value: 'newsletter', label: '뉴스레터', icon: '📬' },
  { value: 'code', label: '코드 블록', icon: '💻' },
  { value: 'quote', label: '인용구', icon: '💬' },
  { value: 'list', label: '리스트', icon: '📋' },
  { value: 'table', label: '테이블', icon: '📊' },
  { value: 'accordion', label: '아코디언', icon: '📂' },
  { value: 'tabs', label: '탭', icon: '📑' },
  { value: 'map', label: '지도', icon: '🗺️' },
  { value: 'countdown', label: '카운트다운', icon: '⏰' },
  { value: 'testimonial', label: '후기', icon: '⭐' },
  { value: 'pricing', label: '가격표', icon: '💰' },
  { value: 'faq', label: 'FAQ', icon: '❓' },
  { value: 'contact', label: '연락처 폼', icon: '📞' },
  { value: 'embed', label: '임베드', icon: '📦' },
  { value: 'icon', label: '아이콘', icon: '🎯' },
  { value: 'card', label: '카드', icon: '🃏' },
];

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const siteId = params.id as string;

  const [site, setSite] = useState<Site | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showNewBlockModal, setShowNewBlockModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Block form state
  const [blockForm, setBlockForm] = useState<any>({});

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
        if (foundSite.pages && foundSite.pages.length > 0) {
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
        setSite({ ...site, pages: [...(site.pages || []), data.page] });
        setCurrentPage(data.page);
      }
      setShowNewPageModal(false);
      setNewPageTitle('');
      setNewPageSlug('');
    } catch (error) {
      console.error('Error creating page:', error);
      alert('페이지 생성 실패');
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await res.json();
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  const handleCreateBlock = async () => {
    const token = localStorage.getItem('token');
    if (!token || !currentPage) return;

    try {
      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pageId: currentPage.id,
          type: blockForm.type || 'text',
          payload: blockForm,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create block');
      }

      const data = await res.json();
      const updatedPage = {
        ...currentPage,
        blocks: [...(currentPage.blocks || []), data.block],
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
      setBlockForm({});
    } catch (error) {
      console.error('Error creating block:', error);
      alert('블록 생성 실패');
    }
  };

  const handleUpdateBlock = async (blockId: string, payload: any) => {
    const token = localStorage.getItem('token');
    if (!token || !currentPage) return;

    try {
      const res = await fetch(`/api/blocks?id=${blockId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payload }),
      });

      if (!res.ok) {
        throw new Error('Failed to update block');
      }

      const data = await res.json();
      const updatedPage = {
        ...currentPage,
        blocks: (currentPage.blocks || []).map((b) =>
          b.id === blockId ? data.block : b
        ),
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

      setEditingBlock(null);
      alert('블록이 저장되었습니다');
    } catch (error) {
      console.error('Error updating block:', error);
      alert('블록 저장 실패');
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('이 블록을 삭제하시겠습니까?')) return;

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
        blocks: (currentPage.blocks || []).filter((b) => b.id !== blockId),
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
      alert('블록 삭제 실패');
    }
  };

  const renderBlockForm = (type: string) => {
    switch (type) {
      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">내용</label>
            <textarea
              value={blockForm.content || ''}
              onChange={(e) => setBlockForm({ ...blockForm, type, content: e.target.value })}
              placeholder="텍스트를 입력하세요"
              rows={4}
              className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        );

      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">제목</label>
              <input
                type="text"
                value={blockForm.content || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, content: e.target.value })}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">크기</label>
              <select
                value={blockForm.size || 'h2'}
                onChange={(e) => setBlockForm({ ...blockForm, type, size: e.target.value })}
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="h1">H1 - 가장 큰</option>
                <option value="h2">H2 - 큰</option>
                <option value="h3">H3 - 중간</option>
                <option value="h4">H4 - 작은</option>
              </select>
            </div>
          </div>
        );

      case 'link':
      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">텍스트</label>
              <input
                type="text"
                value={blockForm.text || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, text: e.target.value })}
                placeholder="버튼/링크 텍스트"
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <input
                type="url"
                value={blockForm.url || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">이미지</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleFileUpload(file);
                    setBlockForm({ ...blockForm, type, url });
                  }
                }}
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              {uploading && <p className="text-sm text-black/60">업로드 중...</p>}
              {blockForm.url && (
                <img src={blockForm.url} alt="Preview" className="mt-2 max-w-xs rounded" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">대체 텍스트 (Alt)</label>
              <input
                type="text"
                value={blockForm.alt || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, alt: e.target.value })}
                placeholder="이미지 설명"
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">비디오 URL</label>
              <input
                type="url"
                value={blockForm.url || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, url: e.target.value })}
                placeholder="YouTube 또는 Vimeo URL"
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-black/60 mt-1">
                YouTube, Vimeo 링크 또는 직접 파일 업로드
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">또는 파일 업로드</label>
              <input
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleFileUpload(file);
                    setBlockForm({ ...blockForm, type, url });
                  }
                }}
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              {uploading && <p className="text-sm text-black/60">업로드 중...</p>}
            </div>
          </div>
        );

      case 'divider':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">스타일</label>
            <select
              value={blockForm.style || 'solid'}
              onChange={(e) => setBlockForm({ ...blockForm, type, style: e.target.value })}
              className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="solid">실선</option>
              <option value="dashed">점선</option>
              <option value="dotted">도트</option>
            </select>
          </div>
        );

      case 'spacer':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">높이 (px)</label>
            <input
              type="number"
              value={blockForm.height || 50}
              onChange={(e) => setBlockForm({ ...blockForm, type, height: parseInt(e.target.value) })}
              min="10"
              max="500"
              className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        );

      case 'social':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Twitter/X</label>
              <input
                type="url"
                value={blockForm.twitter || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, twitter: e.target.value })}
                placeholder="https://twitter.com/username"
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <input
                type="url"
                value={blockForm.instagram || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, instagram: e.target.value })}
                placeholder="https://instagram.com/username"
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                type="url"
                value={blockForm.github || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, github: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                value={blockForm.linkedin || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">인용문</label>
              <textarea
                value={blockForm.content || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, content: e.target.value })}
                placeholder="인용할 내용을 입력하세요"
                rows={3}
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">출처</label>
              <input
                type="text"
                value={blockForm.author || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, author: e.target.value })}
                placeholder="작성자 또는 출처"
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">코드</label>
              <textarea
                value={blockForm.content || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, content: e.target.value })}
                placeholder="코드를 입력하세요"
                rows={6}
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">언어</label>
              <input
                type="text"
                value={blockForm.language || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, language: e.target.value })}
                placeholder="javascript, python, etc."
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-sm font-medium mb-2">내용</label>
            <textarea
              value={blockForm.content || ''}
              onChange={(e) => setBlockForm({ ...blockForm, type, content: e.target.value })}
              placeholder="내용을 입력하세요"
              rows={4}
              className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        );
    }
  };

  const renderBlock = (block: Block) => {
    const isEditing = editingBlock?.id === block.id;

    if (isEditing) {
      return (
        <div className="p-6 border-2 border-blue-500 rounded-lg bg-blue-50/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-semibold text-blue-600">
              {BLOCK_TYPES.find((t) => t.value === block.type)?.label} 편집 중
            </span>
          </div>
          {renderBlockForm(block.type)}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setEditingBlock(null)}
              className="flex-1 px-4 py-2 border border-black/20 rounded-lg hover:bg-black/5"
            >
              취소
            </button>
            <button
              onClick={() => handleUpdateBlock(block.id, blockForm)}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90"
            >
              저장
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 border border-black/10 rounded-lg hover:border-black/30 transition-colors group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-xs text-black/60 mb-2 uppercase">
              {BLOCK_TYPES.find((t) => t.value === block.type)?.icon}{' '}
              {BLOCK_TYPES.find((t) => t.value === block.type)?.label}
            </div>
            <div className="text-lg">
              {block.type === 'image' && block.payload.url && (
                <img src={block.payload.url} alt={block.payload.alt} className="max-w-md rounded" />
              )}
              {block.type === 'divider' && (
                <hr className={`border-black/20 ${block.payload.style === 'dashed' ? 'border-dashed' : block.payload.style === 'dotted' ? 'border-dotted' : ''}`} />
              )}
              {block.type === 'spacer' && (
                <div style={{ height: `${block.payload.height || 50}px` }} className="bg-black/5" />
              )}
              {!['image', 'divider', 'spacer'].includes(block.type) && (
                <pre className="whitespace-pre-wrap font-sans">
                  {block.payload.content || block.payload.text || JSON.stringify(block.payload, null, 2)}
                </pre>
              )}
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                setEditingBlock(block);
                setBlockForm(block.payload);
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
            >
              편집
            </button>
            <button
              onClick={() => handleDeleteBlock(block.id)}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    );
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

  if (showPreview && currentPage) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-black text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="font-medium">미리보기 모드</span>
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100"
            >
              편집으로 돌아가기
            </button>
          </div>
        </div>
        <div className={`${site.theme === 'black' ? 'bg-black text-white' : 'bg-white text-black'}`}>
          <div className="max-w-4xl mx-auto px-8 py-12 space-y-8">
            {(currentPage.blocks || [])
              .sort((a, b) => a.order - b.order)
              .map((block) => (
                <div key={block.id}>
                  {block.type === 'heading' && (
                    <div>
                      {block.payload.size === 'h1' && (
                        <h1 className="text-5xl font-bold">{block.payload.content}</h1>
                      )}
                      {block.payload.size === 'h2' && (
                        <h2 className="text-4xl font-bold">{block.payload.content}</h2>
                      )}
                      {block.payload.size === 'h3' && (
                        <h3 className="text-3xl font-semibold">{block.payload.content}</h3>
                      )}
                      {block.payload.size === 'h4' && (
                        <h4 className="text-2xl font-semibold">{block.payload.content}</h4>
                      )}
                    </div>
                  )}
                  {block.type === 'text' && <p className="text-lg leading-relaxed">{block.payload.content}</p>}
                  {block.type === 'image' && block.payload.url && (
                    <img src={block.payload.url} alt={block.payload.alt} className="w-full rounded-lg" />
                  )}
                  {block.type === 'button' && (
                    <a
                      href={block.payload.url}
                      className="inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-black/90"
                    >
                      {block.payload.text}
                    </a>
                  )}
                  {block.type === 'link' && (
                    <a href={block.payload.url} className="text-blue-600 hover:underline">
                      {block.payload.text}
                    </a>
                  )}
                  {block.type === 'divider' && <hr className="border-t border-current opacity-20" />}
                  {block.type === 'spacer' && <div style={{ height: `${block.payload.height}px` }} />}
                  {block.type === 'quote' && (
                    <blockquote className="border-l-4 border-current pl-6 italic text-xl opacity-80">
                      {block.payload.content}
                      {block.payload.author && (
                        <footer className="text-sm mt-2 opacity-60">— {block.payload.author}</footer>
                      )}
                    </blockquote>
                  )}
                  {block.type === 'code' && (
                    <pre className="bg-black text-white p-6 rounded-lg overflow-x-auto">
                      <code>{block.payload.content}</code>
                    </pre>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black/10 sticky top-0 bg-white z-40">
        <div className="mx-auto max-w-7xl px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-2xl font-semibold">
              PageIZ
            </Link>
            <span className="text-black/40">/</span>
            <span className="text-lg font-medium">{site.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 text-sm font-medium border border-black/20 rounded-lg hover:bg-black/5"
            >
              미리보기
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">
              배포하기
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium hover:underline"
            >
              대시보드
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-72 border-r border-black/10 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">페이지</h2>
              <button
                onClick={() => setShowNewPageModal(true)}
                className="px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-black/90"
              >
                + 추가
              </button>
            </div>
            <div className="space-y-2">
              {(site.pages || []).map((page) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                    currentPage?.id === page.id
                      ? 'bg-black text-white'
                      : 'hover:bg-black/5'
                  }`}
                >
                  <div className="font-medium">{page.title}</div>
                  <div className="text-xs opacity-60">/{page.slug}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>

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
                  onClick={() => {
                    setShowNewBlockModal(true);
                    setBlockForm({});
                  }}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90 shadow-lg"
                >
                  + 블록 추가
                </button>
              </div>

              {(!currentPage.blocks || currentPage.blocks.length === 0) ? (
                <div className="text-center py-24 border-2 border-dashed border-black/10 rounded-lg">
                  <h2 className="text-2xl font-medium mb-2">
                    블록이 없습니다
                  </h2>
                  <p className="text-black/60 mb-8">
                    첫 번째 블록을 추가해보세요
                  </p>
                  <button
                    onClick={() => {
                      setShowNewBlockModal(true);
                      setBlockForm({});
                    }}
                    className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90"
                  >
                    블록 추가
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(currentPage.blocks || [])
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div key={block.id}>{renderBlock(block)}</div>
                    ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <h2 className="text-2xl font-medium mb-2">페이지가 없습니다</h2>
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
            <h2 className="text-2xl font-semibold mb-6">새 페이지 만들기</h2>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full my-8">
            <h2 className="text-2xl font-semibold mb-6">블록 추가</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  블록 타입 선택
                </label>
                <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {BLOCK_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setBlockForm({ ...blockForm, type: type.value })}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        blockForm.type === type.value
                          ? 'border-black bg-black text-white'
                          : 'border-black/10 hover:border-black/30'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {blockForm.type && (
                <div className="border-t pt-6">
                  {renderBlockForm(blockForm.type)}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNewBlockModal(false);
                  setBlockForm({});
                }}
                className="flex-1 px-4 py-3 border border-black/20 rounded-lg hover:bg-black/5"
              >
                취소
              </button>
              <button
                onClick={handleCreateBlock}
                disabled={!blockForm.type}
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
