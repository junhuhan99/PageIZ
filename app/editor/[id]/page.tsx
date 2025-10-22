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
  { value: 'text', label: '텍스트', icon: '📝', color: 'from-blue-500 to-cyan-500' },
  { value: 'heading', label: '제목', icon: '📰', color: 'from-purple-500 to-pink-500' },
  { value: 'link', label: '링크', icon: '🔗', color: 'from-green-500 to-emerald-500' },
  { value: 'button', label: '버튼', icon: '🔘', color: 'from-orange-500 to-red-500' },
  { value: 'image', label: '이미지', icon: '🖼️', color: 'from-pink-500 to-rose-500' },
  { value: 'video', label: '비디오', icon: '🎥', color: 'from-red-500 to-orange-500' },
  { value: 'gallery', label: '갤러리', icon: '🎨', color: 'from-indigo-500 to-blue-500' },
  { value: 'divider', label: '구분선', icon: '➖', color: 'from-gray-500 to-slate-500' },
  { value: 'spacer', label: '여백', icon: '⬜', color: 'from-gray-400 to-gray-600' },
  { value: 'social', label: '소셜 링크', icon: '🌐', color: 'from-cyan-500 to-blue-500' },
  { value: 'email', label: '이메일 폼', icon: '📧', color: 'from-blue-500 to-indigo-500' },
  { value: 'newsletter', label: '뉴스레터', icon: '📬', color: 'from-green-500 to-teal-500' },
  { value: 'code', label: '코드', icon: '💻', color: 'from-gray-700 to-gray-900' },
  { value: 'quote', label: '인용구', icon: '💬', color: 'from-yellow-500 to-orange-500' },
  { value: 'list', label: '리스트', icon: '📋', color: 'from-teal-500 to-cyan-500' },
  { value: 'table', label: '테이블', icon: '📊', color: 'from-purple-500 to-indigo-500' },
  { value: 'accordion', label: '아코디언', icon: '📂', color: 'from-amber-500 to-yellow-500' },
  { value: 'tabs', label: '탭', icon: '📑', color: 'from-lime-500 to-green-500' },
  { value: 'map', label: '지도', icon: '🗺️', color: 'from-emerald-500 to-teal-500' },
  { value: 'countdown', label: '카운트다운', icon: '⏰', color: 'from-rose-500 to-pink-500' },
  { value: 'testimonial', label: '후기', icon: '⭐', color: 'from-yellow-400 to-amber-500' },
  { value: 'pricing', label: '가격표', icon: '💰', color: 'from-green-600 to-emerald-600' },
  { value: 'faq', label: 'FAQ', icon: '❓', color: 'from-violet-500 to-purple-500' },
  { value: 'contact', label: '연락처', icon: '📞', color: 'from-sky-500 to-blue-600' },
  { value: 'embed', label: '임베드', icon: '📦', color: 'from-slate-500 to-gray-600' },
  { value: 'icon', label: '아이콘', icon: '🎯', color: 'from-fuchsia-500 to-pink-600' },
  { value: 'card', label: '카드', icon: '🃏', color: 'from-indigo-600 to-purple-600' },
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
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [domains, setDomains] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      if (!res.ok) throw new Error('Failed to fetch site');

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

  const handlePublish = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setPublishing(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ siteId }),
      });

      if (!res.ok) throw new Error('Failed to publish');

      const data = await res.json();
      alert(data.message || '사이트가 성공적으로 배포되었습니다!');
    } catch (error) {
      console.error('Publish error:', error);
      alert('배포 중 오류가 발생했습니다');
    } finally {
      setPublishing(false);
    }
  };

  const fetchDomains = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/domains?siteId=${siteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch domains');

      const data = await res.json();
      setDomains(data.domains);
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  };

  const handleAddDomain = async () => {
    const token = localStorage.getItem('token');
    if (!token || !newDomain.trim()) return;

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId,
          domain: newDomain,
          type: newDomain.includes('.pageiz.me') ? 'subdomain' : 'custom',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add domain');
      }

      alert('도메인이 추가되었습니다!');
      setNewDomain('');
      fetchDomains();
    } catch (error: any) {
      alert(error.message);
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

      if (!res.ok) throw new Error('Failed to upload file');

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

      if (!res.ok) throw new Error('Failed to create block');

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
      alert('블록이 추가되었습니다!');
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

      if (!res.ok) throw new Error('Failed to update block');

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
      alert('블록이 저장되었습니다!');
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

      if (!res.ok) throw new Error('Failed to delete block');

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
    const blockType = BLOCK_TYPES.find(t => t.value === type);

    return (
      <div className="space-y-4">
        {blockType && (
          <div className={`p-4 bg-gradient-to-r ${blockType.color} text-white rounded-lg`}>
            <div className="text-3xl mb-2">{blockType.icon}</div>
            <div className="text-lg font-bold">{blockType.label} 블록</div>
          </div>
        )}

        {(type === 'text' || type === 'quote') && (
          <div>
            <label className="block text-sm font-medium mb-2">내용</label>
            <textarea
              value={blockForm.content || ''}
              onChange={(e) => setBlockForm({ ...blockForm, type, content: e.target.value })}
              placeholder="내용을 입력하세요"
              rows={type === 'quote' ? 3 : 4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}

        {type === 'quote' && (
          <div>
            <label className="block text-sm font-medium mb-2">출처</label>
            <input
              type="text"
              value={blockForm.author || ''}
              onChange={(e) => setBlockForm({ ...blockForm, author: e.target.value })}
              placeholder="작성자 이름"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {type === 'heading' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">제목</label>
              <input
                type="text"
                value={blockForm.content || ''}
                onChange={(e) => setBlockForm({ ...blockForm, type, content: e.target.value })}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">크기</label>
              <div className="grid grid-cols-4 gap-2">
                {['h1', 'h2', 'h3', 'h4'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setBlockForm({ ...blockForm, size })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      blockForm.size === size || (!blockForm.size && size === 'h2')
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {(type === 'link' || type === 'button') && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">텍스트</label>
              <input
                type="text"
                value={blockForm.text || ''}
                onChange={(e) => setBlockForm({ ...blockForm, text: e.target.value })}
                placeholder="버튼/링크 텍스트"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <input
                type="url"
                value={blockForm.url || ''}
                onChange={(e) => setBlockForm({ ...blockForm, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {type === 'button' && (
              <div>
                <label className="block text-sm font-medium mb-2">버튼 색상</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'black', label: '검정', class: 'bg-black' },
                    { value: 'blue', label: '파랑', class: 'bg-blue-500' },
                    { value: 'green', label: '초록', class: 'bg-green-500' },
                    { value: 'red', label: '빨강', class: 'bg-red-500' },
                  ].map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setBlockForm({ ...blockForm, color: color.value })}
                      className={`${color.class} text-white px-3 py-2 rounded-lg font-medium ${
                        blockForm.color === color.value ? 'ring-4 ring-offset-2 ring-purple-500' : ''
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {type === 'image' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">이미지 업로드</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleFileUpload(file);
                    setBlockForm({ ...blockForm, type, url });
                  }
                }}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 transition-colors cursor-pointer"
              />
              {uploading && (
                <div className="mt-2 flex items-center gap-2 text-pink-600">
                  <div className="animate-spin">⏳</div>
                  <span>업로드 중...</span>
                </div>
              )}
              {blockForm.url && (
                <div className="mt-4">
                  <img src={blockForm.url} alt="Preview" className="max-w-full rounded-lg shadow-lg" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">대체 텍스트</label>
              <input
                type="text"
                value={blockForm.alt || ''}
                onChange={(e) => setBlockForm({ ...blockForm, alt: e.target.value })}
                placeholder="이미지 설명"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </>
        )}

        {type === 'video' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">YouTube/Vimeo URL</label>
              <input
                type="url"
                value={blockForm.url || ''}
                onChange={(e) => setBlockForm({ ...blockForm, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="text-center text-sm text-gray-500">또는</div>
            <div>
              <label className="block text-sm font-medium mb-2">비디오 파일 업로드</label>
              <input
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleFileUpload(file);
                    setBlockForm({ ...blockForm, url });
                  }
                }}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 transition-colors cursor-pointer"
              />
              {uploading && <p className="mt-2 text-sm text-red-600">업로드 중...</p>}
            </div>
          </>
        )}

        {type === 'gallery' && (
          <div>
            <label className="block text-sm font-medium mb-2">이미지들 (여러 개 선택)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                const urls: string[] = [];
                for (const file of files) {
                  const url = await handleFileUpload(file);
                  urls.push(url);
                }
                setBlockForm({ ...blockForm, images: urls });
              }}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors cursor-pointer"
            />
            {uploading && <p className="mt-2 text-sm text-indigo-600">업로드 중...</p>}
            {blockForm.images && blockForm.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {blockForm.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="w-full h-32 object-cover rounded" />
                ))}
              </div>
            )}
          </div>
        )}

        {type === 'social' && (
          <div className="space-y-3">
            {[
              { key: 'twitter', label: 'Twitter/X', icon: '𝕏', placeholder: 'https://twitter.com/username' },
              { key: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/username' },
              { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/username' },
              { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/username' },
              { key: 'github', label: 'GitHub', icon: '💻', placeholder: 'https://github.com/username' },
              { key: 'youtube', label: 'YouTube', icon: '📺', placeholder: 'https://youtube.com/@username' },
            ].map((social) => (
              <div key={social.key}>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <span>{social.icon}</span>
                  <span>{social.label}</span>
                </label>
                <input
                  type="url"
                  value={blockForm[social.key] || ''}
                  onChange={(e) => setBlockForm({ ...blockForm, [social.key]: e.target.value })}
                  placeholder={social.placeholder}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            ))}
          </div>
        )}

        {type === 'list' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">리스트 아이템 (줄바꿈으로 구분)</label>
              <textarea
                value={blockForm.items || ''}
                onChange={(e) => setBlockForm({ ...blockForm, items: e.target.value })}
                placeholder="아이템 1&#10;아이템 2&#10;아이템 3"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">스타일</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBlockForm({ ...blockForm, listType: 'bullet' })}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    blockForm.listType === 'bullet' || !blockForm.listType
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  • 불릿
                </button>
                <button
                  type="button"
                  onClick={() => setBlockForm({ ...blockForm, listType: 'numbered' })}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    blockForm.listType === 'numbered'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  1. 번호
                </button>
              </div>
            </div>
          </>
        )}

        {type === 'code' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">코드</label>
              <textarea
                value={blockForm.content || ''}
                onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
                placeholder="코드를 입력하세요"
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 font-mono text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">프로그래밍 언어</label>
              <input
                type="text"
                value={blockForm.language || ''}
                onChange={(e) => setBlockForm({ ...blockForm, language: e.target.value })}
                placeholder="javascript, python, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>
          </>
        )}

        {type === 'divider' && (
          <div>
            <label className="block text-sm font-medium mb-2">스타일</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'solid', label: '실선' },
                { value: 'dashed', label: '점선' },
                { value: 'dotted', label: '도트' },
              ].map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setBlockForm({ ...blockForm, style: style.value })}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    blockForm.style === style.value || (!blockForm.style && style.value === 'solid')
                      ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {type === 'spacer' && (
          <div>
            <label className="block text-sm font-medium mb-2">높이: {blockForm.height || 50}px</label>
            <input
              type="range"
              min="10"
              max="200"
              value={blockForm.height || 50}
              onChange={(e) => setBlockForm({ ...blockForm, height: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        )}

        {(type === 'email' || type === 'newsletter' || type === 'contact') && (
          <div>
            <label className="block text-sm font-medium mb-2">폼 제목</label>
            <input
              type="text"
              value={blockForm.title || ''}
              onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
              placeholder="구독하기 / 문의하기"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-sm font-medium mb-2 mt-3">버튼 텍스트</label>
            <input
              type="text"
              value={blockForm.buttonText || ''}
              onChange={(e) => setBlockForm({ ...blockForm, buttonText: e.target.value })}
              placeholder="제출 / 보내기"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {type === 'map' && (
          <div>
            <label className="block text-sm font-medium mb-2">Google Maps URL 또는 주소</label>
            <input
              type="text"
              value={blockForm.location || ''}
              onChange={(e) => setBlockForm({ ...blockForm, location: e.target.value })}
              placeholder="서울특별시 강남구..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        {type === 'countdown' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">이벤트 제목</label>
              <input
                type="text"
                value={blockForm.title || ''}
                onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
                placeholder="이벤트 이름"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">종료 날짜</label>
              <input
                type="datetime-local"
                value={blockForm.endDate || ''}
                onChange={(e) => setBlockForm({ ...blockForm, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </>
        )}

        {type === 'testimonial' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">후기 내용</label>
              <textarea
                value={blockForm.content || ''}
                onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
                placeholder="정말 좋은 서비스입니다!"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">작성자 이름</label>
              <input
                type="text"
                value={blockForm.author || ''}
                onChange={(e) => setBlockForm({ ...blockForm, author: e.target.value })}
                placeholder="홍길동"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">별점 (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={blockForm.rating || 5}
                onChange={(e) => setBlockForm({ ...blockForm, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </>
        )}

        {type === 'pricing' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">플랜 이름</label>
              <input
                type="text"
                value={blockForm.planName || ''}
                onChange={(e) => setBlockForm({ ...blockForm, planName: e.target.value })}
                placeholder="Basic / Pro / Enterprise"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">가격</label>
              <input
                type="text"
                value={blockForm.price || ''}
                onChange={(e) => setBlockForm({ ...blockForm, price: e.target.value })}
                placeholder="₩9,900/월"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">기능 목록 (줄바꿈으로 구분)</label>
              <textarea
                value={blockForm.features || ''}
                onChange={(e) => setBlockForm({ ...blockForm, features: e.target.value })}
                placeholder="기능 1&#10;기능 2&#10;기능 3"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </>
        )}

        {type === 'faq' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">질문</label>
              <input
                type="text"
                value={blockForm.question || ''}
                onChange={(e) => setBlockForm({ ...blockForm, question: e.target.value })}
                placeholder="자주 묻는 질문"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">답변</label>
              <textarea
                value={blockForm.answer || ''}
                onChange={(e) => setBlockForm({ ...blockForm, answer: e.target.value })}
                placeholder="답변 내용"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </>
        )}

        {type === 'embed' && (
          <div>
            <label className="block text-sm font-medium mb-2">임베드 코드 (iframe 등)</label>
            <textarea
              value={blockForm.code || ''}
              onChange={(e) => setBlockForm({ ...blockForm, code: e.target.value })}
              placeholder='<iframe src="..."></iframe>'
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 font-mono text-sm"
            />
          </div>
        )}

        {type === 'icon' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">아이콘 이모지</label>
              <input
                type="text"
                value={blockForm.icon || ''}
                onChange={(e) => setBlockForm({ ...blockForm, icon: e.target.value })}
                placeholder="🎯 📱 💡"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-4xl text-center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">설명</label>
              <input
                type="text"
                value={blockForm.text || ''}
                onChange={(e) => setBlockForm({ ...blockForm, text: e.target.value })}
                placeholder="아이콘 설명"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </>
        )}

        {type === 'card' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">카드 제목</label>
              <input
                type="text"
                value={blockForm.title || ''}
                onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
                placeholder="카드 제목"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">내용</label>
              <textarea
                value={blockForm.content || ''}
                onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
                placeholder="카드 내용"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">이미지 (선택사항)</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleFileUpload(file);
                    setBlockForm({ ...blockForm, image: url });
                  }
                }}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-600 transition-colors cursor-pointer"
              />
              {blockForm.image && (
                <img src={blockForm.image} alt="Card" className="mt-2 max-w-xs rounded" />
              )}
            </div>
          </>
        )}

        {(type === 'accordion' || type === 'tabs') && (
          <div>
            <label className="block text-sm font-medium mb-2">
              {type === 'accordion' ? '아코디언' : '탭'} 항목 (제목:내용 형식, 줄바꿈으로 구분)
            </label>
            <textarea
              value={blockForm.items || ''}
              onChange={(e) => setBlockForm({ ...blockForm, items: e.target.value })}
              placeholder="항목1:내용1&#10;항목2:내용2"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
            />
            <p className="mt-2 text-xs text-gray-500">
              예시: 질문1:답변1 (엔터) 질문2:답변2
            </p>
          </div>
        )}

        {type === 'table' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">테이블 헤더 (쉼표로 구분)</label>
              <input
                type="text"
                value={blockForm.headers || ''}
                onChange={(e) => setBlockForm({ ...blockForm, headers: e.target.value })}
                placeholder="이름,나이,직업"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">테이블 데이터 (줄바꿈으로 행 구분, 쉼표로 셀 구분)</label>
              <textarea
                value={blockForm.data || ''}
                onChange={(e) => setBlockForm({ ...blockForm, data: e.target.value })}
                placeholder="홍길동,30,개발자&#10;김철수,25,디자이너"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              />
            </div>
          </>
        )}

        {!['text', 'heading', 'link', 'button', 'image', 'video', 'gallery', 'divider', 'spacer', 'social', 'email', 'newsletter', 'contact', 'code', 'quote', 'list', 'table', 'accordion', 'tabs', 'map', 'countdown', 'testimonial', 'pricing', 'faq', 'embed', 'icon', 'card'].includes(type) && (
          <div>
            <label className="block text-sm font-medium mb-2">내용</label>
            <textarea
              value={blockForm.content || ''}
              onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
              placeholder="내용을 입력하세요"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}
      </div>
    );
  };

  const renderBlock = (block: Block) => {
    const isEditing = editingBlock?.id === block.id;
    const blockType = BLOCK_TYPES.find(t => t.value === block.type);

    if (isEditing) {
      return (
        <div className="p-6 border-4 border-purple-500 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-purple-600 flex items-center gap-2">
              <span className="text-2xl">{blockType?.icon}</span>
              <span>{blockType?.label} 편집 중</span>
            </span>
          </div>
          {renderBlockForm(block.type)}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setEditingBlock(null)}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all"
            >
              취소
            </button>
            <button
              onClick={() => handleUpdateBlock(block.id, blockForm)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              💾 저장하기
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all group bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{blockType?.icon}</span>
              <span className="text-xs font-bold text-gray-500 uppercase">{blockType?.label}</span>
            </div>
            <div className="text-base">
              {block.type === 'image' && block.payload.url && (
                <img src={block.payload.url} alt={block.payload.alt} className="max-w-md rounded-lg shadow-md" />
              )}
              {block.type === 'divider' && (
                <hr className={`border-gray-300 my-4 ${block.payload.style === 'dashed' ? 'border-dashed' : block.payload.style === 'dotted' ? 'border-dotted' : ''}`} />
              )}
              {block.type === 'spacer' && (
                <div style={{ height: `${block.payload.height || 50}px` }} className="bg-gradient-to-r from-gray-100 to-gray-200 rounded" />
              )}
              {!['image', 'divider', 'spacer'].includes(block.type) && (
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {block.payload.content || block.payload.text || block.payload.title || JSON.stringify(block.payload, null, 2)}
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
              className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              ✏️ 편집
            </button>
            <button
              onClick={() => handleDeleteBlock(block.id)}
              className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              🗑️ 삭제
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <div className="text-2xl font-bold text-gray-700">사이트를 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  if (showPreview && currentPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👁️</span>
              <span className="font-bold text-lg">미리보기 모드</span>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 py-2 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-md"
            >
              ← 편집으로 돌아가기
            </button>
          </div>
        </div>
        <div className={`min-h-screen ${site.theme === 'black' ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-white via-gray-50 to-white text-gray-900'}`}>
          <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
            {(currentPage.blocks || [])
              .sort((a, b) => a.order - b.order)
              .map((block) => (
                <div key={block.id} className="animate-fadeIn">
                  {/* 각 블록 타입별 렌더링 로직은 유지하되 스타일을 링크트리처럼 개선 */}
                  {block.type === 'heading' && (
                    <h2 className={`font-bold text-center ${
                      block.payload.size === 'h1' ? 'text-5xl' :
                      block.payload.size === 'h2' ? 'text-4xl' :
                      block.payload.size === 'h3' ? 'text-3xl' : 'text-2xl'
                    }`}>
                      {block.payload.content}
                    </h2>
                  )}
                  {block.type === 'text' && (
                    <p className="text-lg text-center opacity-80 leading-relaxed">{block.payload.content}</p>
                  )}
                  {block.type === 'button' && (
                    <a
                      href={block.payload.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full py-4 px-6 rounded-2xl font-bold text-center text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                        block.payload.color === 'blue' ? 'bg-blue-500 text-white' :
                        block.payload.color === 'green' ? 'bg-green-500 text-white' :
                        block.payload.color === 'red' ? 'bg-red-500 text-white' :
                        'bg-black text-white'
                      }`}
                    >
                      {block.payload.text}
                    </a>
                  )}
                  {block.type === 'link' && (
                    <a
                      href={block.payload.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 px-6 border-2 border-current rounded-2xl font-medium text-center hover:bg-current hover:bg-opacity-10 transition-all"
                    >
                      🔗 {block.payload.text}
                    </a>
                  )}
                  {block.type === 'image' && block.payload.url && (
                    <img src={block.payload.url} alt={block.payload.alt} className="w-full rounded-2xl shadow-lg" />
                  )}
                  {block.type === 'divider' && (
                    <hr className="border-t-2 border-current opacity-20 my-6" />
                  )}
                  {block.type === 'spacer' && (
                    <div style={{ height: `${block.payload.height}px` }} />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 화려한 헤더 */}
      <header className="border-b border-purple-200 sticky top-0 bg-white/80 backdrop-blur-lg z-40 shadow-md">
        <div className="mx-auto max-w-7xl px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                PageIZ
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-lg font-bold text-gray-700">{site.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  fetchDomains();
                  setShowDomainModal(true);
                }}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                🌐 도메인 연결
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                👁️ 미리보기
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="px-6 py-2 text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? '배포 중...' : '🚀 배포하기'}
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                대시보드
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <aside className="w-72 border-r border-purple-200 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto bg-white/50 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                📄 페이지
              </h2>
              <button
                onClick={() => setShowNewPageModal(true)}
                className="px-3 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                + 추가
              </button>
            </div>
            <div className="space-y-2">
              {(site.pages || []).map((page) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all font-medium ${
                    currentPage?.id === page.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'bg-white hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  <div className="font-bold">{page.title}</div>
                  <div className="text-xs opacity-75">/{page.slug}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 메인 */}
        <main className="flex-1 p-8">
          {currentPage ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {currentPage.title}
                  </h1>
                  <p className="text-gray-500 text-lg">/{currentPage.slug}</p>
                </div>
                <button
                  onClick={() => {
                    setShowNewBlockModal(true);
                    setBlockForm({});
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  ✨ 블록 추가
                </button>
              </div>

              {(!currentPage.blocks || currentPage.blocks.length === 0) ? (
                <div className="text-center py-24 border-4 border-dashed border-purple-300 rounded-2xl bg-white/50">
                  <div className="text-6xl mb-4">📦</div>
                  <h2 className="text-3xl font-bold text-gray-700 mb-2">
                    블록이 없습니다
                  </h2>
                  <p className="text-gray-500 mb-8 text-lg">
                    첫 번째 블록을 추가해서 페이지를 꾸며보세요!
                  </p>
                  <button
                    onClick={() => {
                      setShowNewBlockModal(true);
                      setBlockForm({});
                    }}
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all"
                  >
                    ✨ 블록 추가하기
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
              <div className="text-6xl mb-4">📄</div>
              <h2 className="text-3xl font-bold text-gray-700 mb-2">페이지가 없습니다</h2>
              <p className="text-gray-500 mb-8 text-lg">
                첫 번째 페이지를 만들어보세요
              </p>
              <button
                onClick={() => setShowNewPageModal(true)}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all"
              >
                페이지 만들기
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 도메인 연결 모달 */}
      {showDomainModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
              🌐 도메인 연결
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">새 도메인 추가</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="mydomain.com 또는 myname.pageiz.me"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    onClick={handleAddDomain}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    추가
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800">
                  <strong>무료 서브도메인:</strong> yourname.pageiz.me<br/>
                  <strong>커스텀 도메인:</strong> yourdomain.com
                </p>
              </div>

              {domains.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3">연결된 도메인</h3>
                  <div className="space-y-2">
                    {domains.map((domain) => (
                      <div key={domain.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{domain.domain}</span>
                          {domain.verified && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ 인증됨</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowDomainModal(false)}
              className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 블록 추가 모달 */}
      {showNewBlockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full my-8 shadow-2xl">
            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              ✨ 블록 추가
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700">
                  블록 타입 선택
                </label>
                <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
                  {BLOCK_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setBlockForm({ ...blockForm, type: type.value })}
                      className={`p-4 rounded-xl text-left transition-all transform hover:-translate-y-1 ${
                        blockForm.type === type.value
                          ? `bg-gradient-to-r ${type.color} text-white shadow-xl scale-105`
                          : 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="text-sm font-bold">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {blockForm.type && (
                <div className="border-t-4 border-purple-200 pt-6">
                  {renderBlockForm(blockForm.type)}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowNewBlockModal(false);
                  setBlockForm({});
                }}
                className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold transition-all"
              >
                취소
              </button>
              <button
                onClick={handleCreateBlock}
                disabled={!blockForm.type}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✨ 추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
