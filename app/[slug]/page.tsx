import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function PublishedPage({ params }: PageProps) {
  const { slug } = params;

  // Find the page by slug
  const page = await prisma.page.findFirst({
    where: { slug },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
      site: true,
    },
  });

  if (!page || !page.blocks) {
    notFound();
  }

  const theme = page.site.theme || 'white';

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: theme === 'black'
          ? 'linear-gradient(to bottom right, #1a1a1a, #2d2d2d)'
          : 'linear-gradient(to bottom right, #f8f9fa, #e9ecef)'
      }}
    >
      {/* Profile Section */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        {page.metaTitle && (
          <h1 className={`text-3xl font-bold mb-3 ${theme === 'black' ? 'text-white' : 'text-gray-900'}`}>
            {page.metaTitle}
          </h1>
        )}
        {page.metaDesc && (
          <p className={`text-base ${theme === 'black' ? 'text-gray-400' : 'text-gray-600'}`}>
            {page.metaDesc}
          </p>
        )}
      </div>

      {/* Blocks Container */}
      <div className="max-w-2xl mx-auto space-y-4">
        {page.blocks.map((block) => (
          <div key={block.id}>
            {renderBlock(block, theme)}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center">
        <a
          href="https://pageiz.me"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
            theme === 'black'
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-black/10 text-gray-900 hover:bg-black/20'
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>⚡</span>
          <span>Made with PageIZ</span>
        </a>
      </footer>
    </div>
  );
}

function renderBlock(block: any, theme: string) {
  const payload = block.payload || {};
  const isDark = theme === 'black';

  // Linktree-style card wrapper
  const cardClass = `w-full p-6 rounded-2xl transition-all duration-200 ${
    isDark
      ? 'bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20'
      : 'bg-white hover:shadow-lg backdrop-blur-sm border border-gray-200'
  }`;

  switch (block.type) {
    case 'text':
      return (
        <div className={cardClass}>
          <p className={`text-base leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {payload.content}
          </p>
        </div>
      );

    case 'heading':
      const headingSizes: { [key: string]: string } = {
        h1: 'text-3xl',
        h2: 'text-2xl',
        h3: 'text-xl',
        h4: 'text-lg',
      };
      const size = headingSizes[payload.level as string] || 'text-3xl';

      return (
        <div className={cardClass}>
          <h2 className={`${size} font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {payload.content}
          </h2>
        </div>
      );

    case 'link':
      return (
        <a
          href={payload.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block ${cardClass} hover:scale-[1.02] cursor-pointer`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {payload.text || payload.url}
            </span>
            <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      );

    case 'button':
      const buttonColors: { [key: string]: string } = {
        black: 'bg-black text-white hover:bg-gray-800',
        white: 'bg-white text-black hover:bg-gray-100',
        gray: 'bg-gray-600 text-white hover:bg-gray-700',
      };
      const buttonColor = buttonColors[payload.color as string] || buttonColors.black;

      return (
        <a
          href={payload.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full py-4 px-6 rounded-2xl text-center text-lg font-bold transition-all hover:scale-[1.02] ${buttonColor} shadow-lg`}
        >
          {payload.text}
        </a>
      );

    case 'image':
      return (
        <div className={cardClass}>
          <img
            src={payload.url}
            alt={payload.alt || ''}
            className="w-full h-auto rounded-xl"
          />
        </div>
      );

    case 'video':
      if (payload.url?.includes('youtube.com') || payload.url?.includes('youtu.be')) {
        let videoId = '';
        if (payload.url.includes('youtu.be')) {
          videoId = payload.url.split('youtu.be/')[1]?.split('?')[0] || '';
        } else {
          const urlParams = new URLSearchParams(payload.url.split('?')[1]);
          videoId = urlParams.get('v') || '';
        }

        return (
          <div className={cardClass}>
            <div className="aspect-video w-full rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        );
      } else if (payload.url?.includes('vimeo.com')) {
        const videoId = payload.url.split('vimeo.com/')[1]?.split('?')[0] || '';
        return (
          <div className={cardClass}>
            <div className="aspect-video w-full rounded-xl overflow-hidden">
              <iframe
                src={`https://player.vimeo.com/video/${videoId}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        );
      } else {
        return (
          <div className={cardClass}>
            <video
              src={payload.url}
              controls
              className="w-full rounded-xl"
            />
          </div>
        );
      }

    case 'divider':
      const dividerStyles: { [key: string]: string } = {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
      };
      const dividerStyle = dividerStyles[payload.style as string] || 'border-solid';

      return (
        <hr className={`my-4 border-2 ${dividerStyle} ${isDark ? 'border-white/20' : 'border-gray-300'}`} />
      );

    case 'spacer':
      return <div style={{ height: `${payload.height || 50}px` }} />;

    case 'social':
      const socialIcons: { [key: string]: string } = {
        twitter: '𝕏',
        instagram: '📷',
        facebook: '👍',
        linkedin: '💼',
        youtube: '▶️',
        tiktok: '🎵',
      };
      const icon = socialIcons[payload.platform] || '🔗';

      return (
        <a
          href={payload.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block ${cardClass} hover:scale-[1.02] cursor-pointer`}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{icon}</span>
            <div className="flex-1">
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {payload.platform.charAt(0).toUpperCase() + payload.platform.slice(1)}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Follow me
              </p>
            </div>
            <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      );

    case 'code':
      return (
        <div className={cardClass}>
          <div className="mb-2 flex items-center justify-between">
            <span className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {payload.language || 'code'}
            </span>
          </div>
          <pre className={`overflow-x-auto p-4 rounded-lg ${isDark ? 'bg-black/40' : 'bg-gray-100'}`}>
            <code className={`text-sm font-mono ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {payload.code}
            </code>
          </pre>
        </div>
      );

    case 'quote':
      return (
        <div className={cardClass}>
          <div className="border-l-4 border-current pl-4 py-2">
            <p className={`text-lg italic leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              "{payload.quote}"
            </p>
            {payload.author && (
              <footer className={`mt-3 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                — {payload.author}
              </footer>
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className={cardClass}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {block.type} block (not fully implemented yet)
          </p>
        </div>
      );
  }
}
