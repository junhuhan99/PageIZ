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
  { value: 'code', label: '코드', icon: '💻' },
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
  { value: 'contact', label: '연락처', icon: '📞' },
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
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showDnsGuideModal, setShowDnsGuideModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
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
      const foundSite = data.sites?.find((s: Site) => s.id === siteId);

      if (foundSite) {
        setSite(foundSite);
        if (foundSite.pages && foundSite.pages.length > 0) {
          setCurrentPage(foundSite.pages[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch site:', error);
    } finally {
      setLoading(false);
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
      setDomains(data.domains || []);
    } catch (error) {
      console.error('Failed to fetch domains:', error);
    }
  };

  const handleAddDomain = async () => {
    const token = localStorage.getItem('token');
    if (!token || !newDomain) return;

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId,
          hostname: newDomain,
          type: newDomain.endsWith('.pageiz.me') ? 'subdomain' : 'custom',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || '도메인 추가에 실패했습니다');
        return;
      }

      setNewDomain('');
      fetchDomains();
      alert('도메인이 추가되었습니다!');
    } catch (error) {
      console.error('Failed to add domain:', error);
      alert('도메인 추가 중 오류가 발생했습니다');
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

  const handleSaveBlock = async () => {
    const token = localStorage.getItem('token');
    if (!token || !editingBlock || !currentPage) return;

    try {
      const res = await fetch('/api/blocks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingBlock.id,
          payload: blockForm,
        }),
      });

      if (!res.ok) throw new Error('Failed to update block');

      setEditingBlock(null);
      setBlockForm({});
      fetchSite(token);
      alert('블록이 저장되었습니다!');
    } catch (error) {
      console.error('Failed to save block:', error);
      alert('블록 저장 중 오류가 발생했습니다');
    }
  };

  const handleAddBlock = async (type: string) => {
    const token = localStorage.getItem('token');
    if (!token || !currentPage) return;

    try {
      const maxOrder = currentPage.blocks && currentPage.blocks.length > 0
        ? Math.max(...currentPage.blocks.map(b => b.order))
        : 0;

      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pageId: currentPage.id,
          type,
          order: maxOrder + 1,
          payload: {},
        }),
      });

      if (!res.ok) throw new Error('Failed to create block');

      setShowNewBlockModal(false);
      fetchSite(token);
    } catch (error) {
      console.error('Failed to add block:', error);
      alert('블록 추가 중 오류가 발생했습니다');
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!confirm('이 블록을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/blocks?id=${blockId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete block');

      fetchSite(token);
    } catch (error) {
      console.error('Failed to delete block:', error);
      alert('블록 삭제 중 오류가 발생했습니다');
    }
  };

  const handleShareSite = () => {
    if (!currentPage) return;
    const url = `https://pageiz.me/${currentPage.slug}`;

    if (navigator.share) {
      navigator.share({
        title: site?.title || '내 사이트',
        text: '제 사이트를 확인해보세요!',
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('사이트 주소가 클립보드에 복사되었습니다!');
    }
  };

  const renderBlockForm = (type: string) => {
    switch (type) {
      case 'text':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">텍스트 내용</label>
            <textarea
              value={blockForm.content || ''}
              onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              rows={4}
              placeholder="텍스트를 입력하세요"
            />
          </div>
        );

      case 'heading':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">제목 내용</label>
            <input
              type="text"
              value={blockForm.content || ''}
              onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="제목을 입력하세요"
            />
            <label className="block text-sm font-medium text-gray-700">크기</label>
            <select
              value={blockForm.level || 'h1'}
              onChange={(e) => setBlockForm({ ...blockForm, level: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="h1">H1 (가장 큰)</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4 (가장 작은)</option>
            </select>
          </div>
        );

      case 'link':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">링크 텍스트</label>
            <input
              type="text"
              value={blockForm.text || ''}
              onChange={(e) => setBlockForm({ ...blockForm, text: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="링크 텍스트"
            />
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={blockForm.url || ''}
              onChange={(e) => setBlockForm({ ...blockForm, url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
        );

      case 'button':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">버튼 텍스트</label>
            <input
              type="text"
              value={blockForm.text || ''}
              onChange={(e) => setBlockForm({ ...blockForm, text: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="버튼 텍스트"
            />
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={blockForm.url || ''}
              onChange={(e) => setBlockForm({ ...blockForm, url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="https://example.com"
            />
            <label className="block text-sm font-medium text-gray-700">버튼 색상</label>
            <select
              value={blockForm.color || 'black'}
              onChange={(e) => setBlockForm({ ...blockForm, color: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="black">검정</option>
              <option value="white">흰색</option>
              <option value="gray">회색</option>
            </select>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">이미지 업로드</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await handleFileUpload(file);
                  setBlockForm({ ...blockForm, url, alt: '' });
                }
              }}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors"
            />
            {blockForm.url && (
              <div className="mt-3">
                <img src={blockForm.url} alt="Preview" className="w-full max-h-64 object-contain rounded-lg border border-gray-200" />
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700">대체 텍스트</label>
            <input
              type="text"
              value={blockForm.alt || ''}
              onChange={(e) => setBlockForm({ ...blockForm, alt: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="이미지 설명"
            />
          </div>
        );

      case 'video':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">비디오 URL 또는 업로드</label>
            <input
              type="url"
              value={blockForm.url || ''}
              onChange={(e) => setBlockForm({ ...blockForm, url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="YouTube/Vimeo URL 또는 직접 링크"
            />
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
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors"
            />
          </div>
        );

      case 'divider':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">구분선 스타일</label>
            <select
              value={blockForm.style || 'solid'}
              onChange={(e) => setBlockForm({ ...blockForm, style: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="solid">실선</option>
              <option value="dashed">점선</option>
              <option value="dotted">점</option>
            </select>
          </div>
        );

      case 'spacer':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">여백 크기 (px)</label>
            <input
              type="number"
              value={blockForm.height || 50}
              onChange={(e) => setBlockForm({ ...blockForm, height: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              min="10"
              max="200"
            />
          </div>
        );

      case 'social':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">소셜 미디어</label>
            <select
              value={blockForm.platform || 'twitter'}
              onChange={(e) => setBlockForm({ ...blockForm, platform: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="twitter">Twitter/X</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
            </select>
            <label className="block text-sm font-medium text-gray-700">프로필 URL</label>
            <input
              type="url"
              value={blockForm.url || ''}
              onChange={(e) => setBlockForm({ ...blockForm, url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="https://twitter.com/username"
            />
          </div>
        );

      case 'code':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">코드</label>
            <textarea
              value={blockForm.code || ''}
              onChange={(e) => setBlockForm({ ...blockForm, code: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-black focus:border-transparent"
              rows={6}
              placeholder="코드를 입력하세요"
            />
            <label className="block text-sm font-medium text-gray-700">언어</label>
            <input
              type="text"
              value={blockForm.language || 'javascript'}
              onChange={(e) => setBlockForm({ ...blockForm, language: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="javascript, python, etc."
            />
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">인용문</label>
            <textarea
              value={blockForm.quote || ''}
              onChange={(e) => setBlockForm({ ...blockForm, quote: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              rows={3}
              placeholder="인용문을 입력하세요"
            />
            <label className="block text-sm font-medium text-gray-700">작성자</label>
            <input
              type="text"
              value={blockForm.author || ''}
              onChange={(e) => setBlockForm({ ...blockForm, author: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="작성자 이름"
            />
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-center py-8">
            이 블록 타입은 아직 편집 폼이 구현되지 않았습니다.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">사이트를 찾을 수 없습니다</p>
          <Link href="/dashboard" className="text-black underline hover:no-underline">
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const siteUrl = currentPage ? `https://pageiz.me/${currentPage.slug}` : '';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-2xl font-bold text-black hover:opacity-70 transition-opacity">
              PageIZ
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-900">{site.title}</h1>
          </div>

          {/* Site URL Display */}
          {currentPage && (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {siteUrl}
                </a>
              </div>
              <button
                onClick={handleShareSite}
                className="px-4 py-2 bg-white border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-all font-medium"
              >
                공유하기
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchDomains();
                setShowDomainModal(true);
              }}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              도메인 연결
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {showPreview ? '편집' : '미리보기'}
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishing ? '배포 중...' : '배포하기'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-white min-h-[calc(100vh-73px)] p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">페이지</h2>
              {site.pages && site.pages.length > 0 ? (
                <div className="space-y-1">
                  {site.pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => setCurrentPage(page)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentPage?.id === page.id
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page.slug}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">페이지가 없습니다</p>
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">사이트 테마</h2>
              <div className="space-y-2">
                <button
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    if (!token) return;
                    try {
                      await fetch('/api/sites', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ id: siteId, theme: 'white' }),
                      });
                      fetchSite(token);
                    } catch (error) {
                      console.error('Failed to update theme:', error);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm border-2 transition-all ${
                    site.theme === 'white'
                      ? 'border-black bg-white text-black font-medium'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  ⬜ 화이트 테마
                </button>
                <button
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    if (!token) return;
                    try {
                      await fetch('/api/sites', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ id: siteId, theme: 'black' }),
                      });
                      fetchSite(token);
                    } catch (error) {
                      console.error('Failed to update theme:', error);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm border-2 transition-all ${
                    site.theme === 'black'
                      ? 'border-black bg-black text-white font-medium'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  ⬛ 블랙 테마
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50">
          {currentPage ? (
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">블록 편집</h2>
                <button
                  onClick={() => setShowNewBlockModal(true)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  + 블록 추가
                </button>
              </div>

              {/* Blocks List */}
              <div className="space-y-4">
                {currentPage.blocks && currentPage.blocks.length > 0 ? (
                  currentPage.blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div
                        key={block.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-black transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {BLOCK_TYPES.find(t => t.value === block.type)?.icon || '📦'}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {BLOCK_TYPES.find(t => t.value === block.type)?.label || block.type}
                              </p>
                              <p className="text-xs text-gray-500">순서: {block.order}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingBlock(block);
                                setBlockForm(block.payload || {});
                              }}
                              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                              편집
                            </button>
                            <button
                              onClick={() => handleDeleteBlock(block.id)}
                              className="px-3 py-1.5 bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                              삭제
                            </button>
                          </div>
                        </div>

                        {/* Block Preview */}
                        <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-600 border border-gray-100">
                          {block.payload?.content && <p>{block.payload.content.substring(0, 100)}</p>}
                          {block.payload?.text && <p>{block.payload.text}</p>}
                          {block.payload?.url && <p className="text-blue-600 truncate">{block.payload.url}</p>}
                          {!block.payload?.content && !block.payload?.text && !block.payload?.url && (
                            <p className="text-gray-400">내용 없음</p>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <p className="text-gray-500 mb-4">아직 블록이 없습니다</p>
                    <button
                      onClick={() => setShowNewBlockModal(true)}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      첫 블록 추가하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto text-center py-12">
              <p className="text-gray-600 mb-4">페이지를 선택하세요</p>
            </div>
          )}
        </main>
      </div>

      {/* Add Block Modal */}
      {showNewBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">블록 타입 선택</h3>
              <button
                onClick={() => setShowNewBlockModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {BLOCK_TYPES.map((blockType) => (
                <button
                  key={blockType.value}
                  onClick={() => handleAddBlock(blockType.value)}
                  className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all text-center"
                >
                  <div className="text-3xl mb-2">{blockType.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{blockType.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Block Modal */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {BLOCK_TYPES.find(t => t.value === editingBlock.type)?.label} 편집
              </h3>
              <button
                onClick={() => {
                  setEditingBlock(null);
                  setBlockForm({});
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {renderBlockForm(editingBlock.type)}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveBlock}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  저장하기
                </button>
                <button
                  onClick={() => {
                    setEditingBlock(null);
                    setBlockForm({});
                  }}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Domain Modal */}
      {showDomainModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">도메인 연결</h3>
              <button
                onClick={() => setShowDomainModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 도메인 추가
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="example.com 또는 mysite.pageiz.me"
                  />
                  <button
                    onClick={handleAddDomain}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                  >
                    추가
                  </button>
                </div>
                <button
                  onClick={() => setShowDnsGuideModal(true)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  DNS 설정 가이드 보기
                </button>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">연결된 도메인</h4>
                {domains.length > 0 ? (
                  <div className="space-y-2">
                    {domains.map((domain) => (
                      <div
                        key={domain.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{domain.hostname}</p>
                          <p className="text-xs text-gray-500">
                            {domain.verified ? '✓ 인증됨' : '⏳ 인증 대기 중'}
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            const token = localStorage.getItem('token');
                            if (!token) return;
                            if (!confirm('이 도메인을 삭제하시겠습니까?')) return;

                            try {
                              await fetch(`/api/domains?id=${domain.id}`, {
                                method: 'DELETE',
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              });
                              fetchDomains();
                            } catch (error) {
                              console.error('Failed to delete domain:', error);
                            }
                          }}
                          className="px-3 py-1.5 bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                    연결된 도메인이 없습니다
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DNS Guide Modal */}
      {showDnsGuideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">DNS 설정 가이드</h3>
              <button
                onClick={() => setShowDnsGuideModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  커스텀 도메인을 연결하려면 도메인 제공업체(가비아, 후이즈, GoDaddy 등)에서 DNS 설정을 변경해야 합니다.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">1. A 레코드 설정</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-300">
                      <tr>
                        <th className="text-left py-2 font-semibold text-gray-700">타입</th>
                        <th className="text-left py-2 font-semibold text-gray-700">호스트</th>
                        <th className="text-left py-2 font-semibold text-gray-700">값</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 font-mono">A</td>
                        <td className="py-2 font-mono">@</td>
                        <td className="py-2 font-mono text-blue-600">13.125.150.235</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">A</td>
                        <td className="py-2 font-mono">www</td>
                        <td className="py-2 font-mono text-blue-600">13.125.150.235</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">2. 서브도메인 설정 (선택사항)</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    *.pageiz.me 서브도메인은 자동으로 연결되며 별도 설정이 필요 없습니다.
                  </p>
                  <p className="text-sm text-gray-600">
                    예: mysite.pageiz.me, shop.pageiz.me
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">3. 주요 도메인 제공업체별 가이드</h4>
                <div className="space-y-3">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">가비아 (Gabia)</h5>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                      <li>가비아 로그인 → My가비아 → 도메인 관리</li>
                      <li>해당 도메인 선택 → DNS 정보 → DNS 레코드 수정</li>
                      <li>위의 A 레코드 정보 입력 후 저장</li>
                    </ol>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Cloudflare</h5>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                      <li>Cloudflare 대시보드 로그인</li>
                      <li>도메인 선택 → DNS 메뉴</li>
                      <li>Add record 클릭 후 A 레코드 추가</li>
                      <li>Proxy status는 "DNS only"로 설정 권장</li>
                    </ol>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">후이즈 (Whois)</h5>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                      <li>후이즈 로그인 → 도메인 관리</li>
                      <li>도메인 선택 → 네임서버 설정 → 호스트 설정</li>
                      <li>A 레코드 추가 후 저장</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-900 mb-2">⚠️ 주의사항</h5>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>DNS 변경 사항이 전파되는 데 최대 24-48시간이 걸릴 수 있습니다</li>
                  <li>SSL 인증서는 도메인 연결 후 자동으로 발급됩니다</li>
                  <li>기존에 사용 중인 이메일 서비스가 있다면 MX 레코드를 유지하세요</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-2">✓ 확인 방법</h5>
                <p className="text-sm text-green-800 mb-2">
                  DNS 설정이 제대로 되었는지 확인하려면 터미널/명령 프롬프트에서:
                </p>
                <code className="block bg-white px-3 py-2 rounded text-sm font-mono border border-green-300">
                  nslookup yourdomain.com
                </code>
                <p className="text-sm text-green-800 mt-2">
                  결과에 13.125.150.235가 표시되면 정상적으로 설정된 것입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
