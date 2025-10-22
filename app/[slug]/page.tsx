import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

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

  if (!page) {
    notFound();
  }

  const theme = page.site.theme || 'white';
  const bgColor = theme === 'black' ? 'bg-black' : 'bg-white';
  const textColor = theme === 'black' ? 'text-white' : 'text-black';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Page Meta */}
        {page.metaTitle && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{page.metaTitle}</h1>
            {page.metaDesc && (
              <p className={`text-lg ${theme === 'black' ? 'text-gray-400' : 'text-gray-600'}`}>
                {page.metaDesc}
              </p>
            )}
          </div>
        )}

        {/* Blocks */}
        <div className="space-y-6">
          {page.blocks.map((block) => (
            <div key={block.id}>
              {renderBlock(block, theme)}
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-300 text-center">
          <p className={`text-sm ${theme === 'black' ? 'text-gray-500' : 'text-gray-500'}`}>
            Made with{' '}
            <a
              href="https://pageiz.me"
              className="underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PageIZ
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

function renderBlock(block: any, theme: string) {
  const payload = block.payload || {};
  const isDark = theme === 'black';

  switch (block.type) {
    case 'text':
      return (
        <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
          <p className="whitespace-pre-wrap">{payload.content}</p>
        </div>
      );

    case 'heading':
      const HeadingTag = payload.level || 'h1';
      const headingClasses: { [key: string]: string } = {
        h1: 'text-4xl font-bold',
        h2: 'text-3xl font-bold',
        h3: 'text-2xl font-semibold',
        h4: 'text-xl font-semibold',
      };
      const headingClass = headingClasses[payload.level as string] || 'text-4xl font-bold';

      return (
        <div className={headingClass}>
          {payload.content}
        </div>
      );

    case 'link':
      return (
        <a
          href={payload.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline`}
        >
          {payload.text || payload.url}
        </a>
      );

    case 'button':
      const buttonColors: { [key: string]: string } = {
        black: 'bg-black text-white hover:bg-gray-800',
        white: 'bg-white text-black border-2 border-black hover:bg-gray-100',
        gray: 'bg-gray-500 text-white hover:bg-gray-600',
      };
      const buttonClass = buttonColors[payload.color as string] || buttonColors.black;

      return (
        <a
          href={payload.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${buttonClass}`}
        >
          {payload.text}
        </a>
      );

    case 'image':
      return (
        <div className="w-full">
          <img
            src={payload.url}
            alt={payload.alt || ''}
            className="w-full h-auto rounded-lg border border-gray-300"
          />
        </div>
      );

    case 'video':
      if (payload.url?.includes('youtube.com') || payload.url?.includes('youtu.be')) {
        const videoId = payload.url.includes('youtu.be')
          ? payload.url.split('youtu.be/')[1]
          : new URL(payload.url).searchParams.get('v');
        return (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        );
      } else if (payload.url?.includes('vimeo.com')) {
        const videoId = payload.url.split('vimeo.com/')[1];
        return (
          <div className="aspect-video w-full">
            <iframe
              src={`https://player.vimeo.com/video/${videoId}`}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        );
      } else {
        return (
          <video
            src={payload.url}
            controls
            className="w-full rounded-lg border border-gray-300"
          />
        );
      }

    case 'divider':
      const dividerStyles: { [key: string]: string } = {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
      };
      const dividerClass = dividerStyles[payload.style as string] || 'border-solid';

      return (
        <hr className={`border-t-2 ${dividerClass} ${isDark ? 'border-gray-700' : 'border-gray-300'}`} />
      );

    case 'spacer':
      return <div style={{ height: `${payload.height || 50}px` }} />;

    case 'social':
      return (
        <a
          href={payload.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
            isDark
              ? 'border-gray-700 hover:border-gray-500'
              : 'border-gray-300 hover:border-gray-500'
          } transition-colors`}
        >
          <span>{getSocialIcon(payload.platform)}</span>
          <span className="font-medium">{payload.platform}</span>
        </a>
      );

    case 'code':
      return (
        <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {payload.language || 'code'}
            </span>
          </div>
          <pre className="overflow-x-auto">
            <code className={`text-sm font-mono ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {payload.code}
            </code>
          </pre>
        </div>
      );

    case 'quote':
      return (
        <blockquote className={`border-l-4 pl-4 py-2 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <p className={`text-lg italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            "{payload.quote}"
          </p>
          {payload.author && (
            <footer className={`mt-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              — {payload.author}
            </footer>
          )}
        </blockquote>
      );

    default:
      return (
        <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-50'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Block type "{block.type}" is not yet supported
          </p>
        </div>
      );
  }
}

function getSocialIcon(platform: string) {
  const icons: { [key: string]: string } = {
    twitter: '𝕏',
    instagram: '📷',
    facebook: '👍',
    linkedin: '💼',
    youtube: '▶️',
    tiktok: '🎵',
  };
  return icons[platform] || '🔗';
}
