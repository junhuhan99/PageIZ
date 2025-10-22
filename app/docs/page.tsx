'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold">
            PageIZ
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <Link href="/signup" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
            <Link href="/login" className="px-4 py-2 text-sm font-medium hover:underline">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-black/90"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 border-r border-black/10 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
          <nav className="p-8 space-y-8">
            <div>
              <h3 className="text-xs font-semibold uppercase text-black/40 mb-3">
                Getting Started
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('introduction')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'introduction' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Introduction
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('quick-start')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'quick-start' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Quick Start
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'features' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Features Overview
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase text-black/40 mb-3">
                Core Concepts
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('sites')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'sites' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Sites
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('pages')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'pages' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Pages
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('blocks')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'blocks' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Blocks
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('themes')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'themes' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Themes
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase text-black/40 mb-3">
                Block Types
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('text-blocks')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'text-blocks' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Text & Headings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('media-blocks')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'media-blocks' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Media Blocks
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('interactive-blocks')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'interactive-blocks' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Interactive Blocks
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('form-blocks')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'form-blocks' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Form Blocks
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase text-black/40 mb-3">
                Customization
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('styling')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'styling' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Styling
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('domains')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'domains' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Custom Domains
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('seo')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'seo' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    SEO Settings
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase text-black/40 mb-3">
                Advanced
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('analytics')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'analytics' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Analytics
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('api')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'api' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    API Reference
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('best-practices')}
                    className={`text-sm hover:text-black transition-colors ${
                      activeSection === 'best-practices' ? 'text-black font-semibold' : 'text-black/60'
                    }`}
                  >
                    Best Practices
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-8 py-12 max-w-4xl">
          <article className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section id="introduction" className="mb-24 scroll-mt-24">
              <h1 className="text-5xl font-bold mb-6">PageIZ Documentation</h1>
              <p className="text-xl text-black/60 mb-8">
                Welcome to PageIZ, the fastest way to create beautiful single-page websites.
                This comprehensive guide will walk you through everything you need to know to build,
                customize, and deploy your pages.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
                <p className="text-blue-900 font-medium mb-2">What is PageIZ?</p>
                <p className="text-blue-800">
                  PageIZ is a modern page builder that lets you create professional single-page websites
                  in just 5 minutes. No coding required. Perfect for portfolios, link-in-bio pages,
                  event pages, and more.
                </p>
              </div>
            </section>

            {/* Quick Start */}
            <section id="quick-start" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Quick Start</h2>
              <p className="text-lg text-black/60 mb-6">
                Get your first page live in less than 5 minutes with these simple steps:
              </p>

              <div className="space-y-6">
                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">Step 1: Create an Account</h3>
                  <p className="text-black/60 mb-4">
                    Sign up for a free PageIZ account. No credit card required to get started.
                  </p>
                  <div className="bg-black/5 rounded p-4 font-mono text-sm">
                    1. Go to pageiz.me/signup<br/>
                    2. Enter your email and password<br/>
                    3. Click "Sign Up"
                  </div>
                </div>

                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">Step 2: Create Your First Site</h3>
                  <p className="text-black/60 mb-4">
                    Once logged in, you'll be taken to your dashboard. Click "Create New Site" and
                    give your site a name.
                  </p>
                  <div className="bg-black/5 rounded p-4 font-mono text-sm">
                    Site Name: "My Portfolio"<br/>
                    Theme: White (or Black)<br/>
                    Click "Create"
                  </div>
                </div>

                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">Step 3: Add Your First Page</h3>
                  <p className="text-black/60 mb-4">
                    In the editor, click "Add Page" in the sidebar. Give it a title and URL slug.
                  </p>
                  <div className="bg-black/5 rounded p-4 font-mono text-sm">
                    Page Title: "Home"<br/>
                    URL Slug: "home"<br/>
                    Click "Create"
                  </div>
                </div>

                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">Step 4: Add Content Blocks</h3>
                  <p className="text-black/60 mb-4">
                    Click "Add Block" and choose from 27 different block types. Add headings, text,
                    images, videos, and more.
                  </p>
                  <div className="bg-black/5 rounded p-4 font-mono text-sm">
                    1. Click "Add Block"<br/>
                    2. Select block type (e.g., "Heading")<br/>
                    3. Enter your content<br/>
                    4. Click "Add"
                  </div>
                </div>

                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">Step 5: Publish Your Page</h3>
                  <p className="text-black/60 mb-4">
                    Once you're happy with your page, click "Publish" to make it live. You'll get a
                    free subdomain like yourname.pageiz.me.
                  </p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section id="features" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Features Overview</h2>
              <p className="text-lg text-black/60 mb-8">
                PageIZ comes packed with powerful features to help you create stunning pages:
              </p>

              <div className="grid gap-6">
                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">⚡ Lightning Fast Performance</h3>
                  <p className="text-black/60">
                    Built on Next.js 16 with React 19, PageIZ delivers blazing-fast page loads and
                    seamless user experiences. Your pages are optimized automatically for speed.
                  </p>
                </div>

                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">🎨 Beautiful Themes</h3>
                  <p className="text-black/60">
                    Choose from elegant black and white themes that look professional and modern.
                    Clean design that puts your content first.
                  </p>
                </div>

                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">🔧 27 Block Types</h3>
                  <p className="text-black/60">
                    From simple text and images to complex forms and embeds, PageIZ has every block
                    type you need to build your perfect page.
                  </p>
                </div>

                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">🌐 Custom Domains</h3>
                  <p className="text-black/60">
                    Use your own domain name with automatic SSL certificates. Professional domains
                    for your professional pages.
                  </p>
                </div>

                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">📊 Built-in Analytics</h3>
                  <p className="text-black/60">
                    Track page views, visitor engagement, and more with our integrated analytics
                    dashboard. Understand your audience better.
                  </p>
                </div>

                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">🚀 SEO Optimized</h3>
                  <p className="text-black/60">
                    Automatic meta tags, Open Graph images, and sitemap generation ensure your pages
                    rank well in search engines.
                  </p>
                </div>
              </div>
            </section>

            {/* Sites */}
            <section id="sites" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Understanding Sites</h2>
              <p className="text-lg text-black/60 mb-6">
                A site in PageIZ is the top-level container for your content. Each site can have multiple
                pages, its own theme, and custom domain.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Creating a New Site</h3>
              <p className="text-black/60 mb-4">
                From your dashboard, click "Create New Site". You'll need to provide:
              </p>
              <ul className="list-disc pl-6 mb-6 text-black/60">
                <li>Site name (e.g., "My Portfolio")</li>
                <li>Theme (Black or White)</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Site Settings</h3>
              <p className="text-black/60 mb-4">
                Each site has its own settings page where you can:
              </p>
              <ul className="list-disc pl-6 mb-6 text-black/60">
                <li>Change the site name</li>
                <li>Switch themes</li>
                <li>Add custom domains</li>
                <li>Configure SEO settings</li>
                <li>View analytics</li>
                <li>Manage team members (Pro plan)</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Site Limits</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 my-6">
                <p className="text-yellow-900 font-medium mb-2">Free Plan Limits</p>
                <p className="text-yellow-800">
                  Free accounts are limited to 1 site. Upgrade to Pro for unlimited sites.
                </p>
              </div>
            </section>

            {/* Pages */}
            <section id="pages" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Working with Pages</h2>
              <p className="text-lg text-black/60 mb-6">
                Pages are the individual web pages within your site. Each page has its own URL, content,
                and SEO settings.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Creating Pages</h3>
              <p className="text-black/60 mb-4">
                In the site editor, click "Add Page" in the sidebar. You'll need to provide:
              </p>
              <ul className="list-disc pl-6 mb-6 text-black/60">
                <li>Page title (shown in browser tab)</li>
                <li>URL slug (e.g., "about" becomes yoursite.com/about)</li>
                <li>Meta description (optional, for SEO)</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Page Structure</h3>
              <p className="text-black/60 mb-4">
                Each page consists of blocks stacked vertically. You can:
              </p>
              <ul className="list-disc pl-6 mb-6 text-black/60">
                <li>Add unlimited blocks to a page</li>
                <li>Reorder blocks by dragging</li>
                <li>Edit block content inline</li>
                <li>Delete blocks you don't need</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Page Settings</h3>
              <div className="border border-black/10 rounded p-4 mb-6">
                <p className="font-medium mb-2">SEO Settings</p>
                <ul className="list-disc pl-6 text-sm text-black/60">
                  <li>Page title (max 60 characters)</li>
                  <li>Meta description (max 160 characters)</li>
                  <li>Open Graph image</li>
                  <li>Canonical URL</li>
                </ul>
              </div>
            </section>

            {/* Blocks */}
            <section id="blocks" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Understanding Blocks</h2>
              <p className="text-lg text-black/60 mb-6">
                Blocks are the building blocks of your pages. PageIZ offers 27 different block types
                to help you create any kind of content.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Block Categories</h3>
              <div className="grid gap-4 mb-6">
                <div className="border border-black/10 rounded p-4">
                  <p className="font-semibold mb-2">Text Blocks</p>
                  <p className="text-sm text-black/60">Text, Heading, Quote, List, Code Block</p>
                </div>
                <div className="border border-black/10 rounded p-4">
                  <p className="font-semibold mb-2">Media Blocks</p>
                  <p className="text-sm text-black/60">Image, Video, Gallery, Embed</p>
                </div>
                <div className="border border-black/10 rounded p-4">
                  <p className="font-semibold mb-2">Interactive Blocks</p>
                  <p className="text-sm text-black/60">Button, Link, Social Links, Accordion, Tabs</p>
                </div>
                <div className="border border-black/10 rounded p-4">
                  <p className="font-semibold mb-2">Form Blocks</p>
                  <p className="text-sm text-black/60">Contact Form, Email Form, Newsletter</p>
                </div>
                <div className="border border-black/10 rounded p-4">
                  <p className="font-semibold mb-2">Layout Blocks</p>
                  <p className="text-sm text-black/60">Divider, Spacer, Card, Table</p>
                </div>
                <div className="border border-black/10 rounded p-4">
                  <p className="font-semibold mb-2">Advanced Blocks</p>
                  <p className="text-sm text-black/60">Map, Countdown, Testimonial, Pricing, FAQ</p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Adding Blocks</h3>
              <p className="text-black/60 mb-4">
                To add a block to your page:
              </p>
              <ol className="list-decimal pl-6 mb-6 text-black/60">
                <li>Click the "Add Block" button</li>
                <li>Choose a block type from the modal</li>
                <li>Fill in the block content</li>
                <li>Click "Add" to insert the block</li>
              </ol>

              <h3 className="text-2xl font-semibold mb-4">Editing Blocks</h3>
              <p className="text-black/60 mb-4">
                To edit an existing block, simply click on it in the editor. The block will become
                editable, and you can modify the content directly.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Reordering Blocks</h3>
              <p className="text-black/60 mb-4">
                Drag blocks up or down to change their order on the page. The order you see in the
                editor is the order visitors will see.
              </p>
            </section>

            {/* Themes */}
            <section id="themes" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Themes</h2>
              <p className="text-lg text-black/60 mb-6">
                PageIZ offers two beautiful themes: Black and White. Both are carefully designed to
                look professional and modern.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-3">White Theme</h3>
                  <p className="text-black/60 mb-4">
                    Clean and minimalist. Perfect for portfolios, resumes, and professional pages.
                  </p>
                  <ul className="list-disc pl-6 text-sm text-black/60">
                    <li>White background</li>
                    <li>Black text</li>
                    <li>Subtle gray accents</li>
                    <li>Light and airy feel</li>
                  </ul>
                </div>

                <div className="border border-black/10 rounded-lg p-6 bg-black text-white">
                  <h3 className="text-2xl font-semibold mb-3">Black Theme</h3>
                  <p className="text-white/60 mb-4">
                    Bold and dramatic. Great for creative portfolios and link-in-bio pages.
                  </p>
                  <ul className="list-disc pl-6 text-sm text-white/60">
                    <li>Black background</li>
                    <li>White text</li>
                    <li>High contrast</li>
                    <li>Modern and sleek</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Changing Themes</h3>
              <p className="text-black/60 mb-4">
                You can change your site's theme at any time from the site settings page. The change
                will apply to all pages in your site immediately.
              </p>
            </section>

            {/* Text Blocks */}
            <section id="text-blocks" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Text & Heading Blocks</h2>

              <h3 className="text-2xl font-semibold mb-4">Text Block</h3>
              <p className="text-black/60 mb-4">
                The most basic block type. Use it for paragraphs, descriptions, and body content.
              </p>
              <div className="bg-black/5 rounded p-4 mb-6">
                <p className="text-sm font-mono mb-2">Example:</p>
                <p className="text-black/60">
                  This is a text block. You can write as much or as little as you want. Text blocks
                  support basic formatting like bold and italic.
                </p>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Heading Block</h3>
              <p className="text-black/60 mb-4">
                Use headings to structure your content. Available in 6 sizes (H1-H6).
              </p>
              <div className="bg-black/5 rounded p-6 mb-6 space-y-2">
                <h1 className="text-4xl font-bold">H1: Main Page Title</h1>
                <h2 className="text-3xl font-bold">H2: Section Title</h2>
                <h3 className="text-2xl font-semibold">H3: Subsection</h3>
                <h4 className="text-xl font-semibold">H4: Minor Heading</h4>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Quote Block</h3>
              <p className="text-black/60 mb-4">
                Highlight important quotes or testimonials.
              </p>
              <div className="bg-black/5 rounded p-6 mb-6">
                <blockquote className="border-l-4 border-black pl-4 italic text-lg">
                  "PageIZ made it so easy to create my portfolio. I had it live in under 5 minutes!"
                  <footer className="text-sm text-black/60 mt-2">— Sarah Johnson</footer>
                </blockquote>
              </div>

              <h3 className="text-2xl font-semibold mb-4">List Block</h3>
              <p className="text-black/60 mb-4">
                Create ordered or unordered lists.
              </p>
              <div className="bg-black/5 rounded p-4 mb-6">
                <ul className="list-disc pl-6">
                  <li>First item</li>
                  <li>Second item</li>
                  <li>Third item</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Code Block</h3>
              <p className="text-black/60 mb-4">
                Display code snippets with syntax highlighting.
              </p>
              <div className="bg-black text-white rounded p-4 mb-6 font-mono text-sm">
                <code>
                  const greeting = "Hello, World!";<br/>
                  console.log(greeting);
                </code>
              </div>
            </section>

            {/* Media Blocks */}
            <section id="media-blocks" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Media Blocks</h2>

              <h3 className="text-2xl font-semibold mb-4">Image Block</h3>
              <p className="text-black/60 mb-4">
                Add images to your pages. Supports JPG, PNG, GIF, and WebP formats. Images are
                automatically optimized for fast loading.
              </p>
              <div className="bg-black/5 rounded p-4 mb-6">
                <p className="text-sm font-semibold mb-2">Features:</p>
                <ul className="list-disc pl-6 text-sm text-black/60">
                  <li>Automatic image optimization</li>
                  <li>Lazy loading for performance</li>
                  <li>Alt text for accessibility</li>
                  <li>Responsive sizing</li>
                  <li>Upload from computer or paste URL</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Video Block</h3>
              <p className="text-black/60 mb-4">
                Embed videos from YouTube, Vimeo, or upload your own.
              </p>
              <div className="bg-black/5 rounded p-4 mb-6">
                <p className="text-sm font-semibold mb-2">Supported Platforms:</p>
                <ul className="list-disc pl-6 text-sm text-black/60">
                  <li>YouTube</li>
                  <li>Vimeo</li>
                  <li>Direct video files (MP4, WebM)</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Gallery Block</h3>
              <p className="text-black/60 mb-4">
                Display multiple images in a beautiful grid layout.
              </p>
              <div className="bg-black/5 rounded p-4 mb-6">
                <p className="text-sm font-semibold mb-2">Layout Options:</p>
                <ul className="list-disc pl-6 text-sm text-black/60">
                  <li>2, 3, or 4 columns</li>
                  <li>Masonry layout</li>
                  <li>Lightbox on click</li>
                  <li>Captions for each image</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Embed Block</h3>
              <p className="text-black/60 mb-4">
                Embed content from third-party services like Twitter, Instagram, Spotify, and more.
              </p>
            </section>

            {/* Interactive Blocks */}
            <section id="interactive-blocks" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Interactive Blocks</h2>

              <h3 className="text-2xl font-semibold mb-4">Button Block</h3>
              <p className="text-black/60 mb-4">
                Add call-to-action buttons that link to other pages or external URLs.
              </p>
              <div className="bg-black/5 rounded p-6 mb-6">
                <button className="px-8 py-3 bg-black text-white rounded-lg hover:bg-black/90">
                  Example Button
                </button>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Link Block</h3>
              <p className="text-black/60 mb-4">
                Perfect for link-in-bio pages. Display a list of important links.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Social Links Block</h3>
              <p className="text-black/60 mb-4">
                Add icons linking to your social media profiles.
              </p>
              <div className="bg-black/5 rounded p-4 mb-6">
                <p className="text-sm font-semibold mb-2">Supported Platforms:</p>
                <ul className="list-disc pl-6 text-sm text-black/60">
                  <li>Twitter/X</li>
                  <li>Instagram</li>
                  <li>Facebook</li>
                  <li>LinkedIn</li>
                  <li>GitHub</li>
                  <li>YouTube</li>
                  <li>TikTok</li>
                  <li>And many more...</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Accordion Block</h3>
              <p className="text-black/60 mb-4">
                Create collapsible content sections. Great for FAQs.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Tabs Block</h3>
              <p className="text-black/60 mb-4">
                Organize content into tabbed sections.
              </p>
            </section>

            {/* Form Blocks */}
            <section id="form-blocks" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Form Blocks</h2>

              <h3 className="text-2xl font-semibold mb-4">Contact Form Block</h3>
              <p className="text-black/60 mb-4">
                Let visitors send you messages directly from your page.
              </p>
              <div className="bg-black/5 rounded p-4 mb-6">
                <p className="text-sm font-semibold mb-2">Default Fields:</p>
                <ul className="list-disc pl-6 text-sm text-black/60">
                  <li>Name</li>
                  <li>Email</li>
                  <li>Message</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Email Form Block</h3>
              <p className="text-black/60 mb-4">
                Simple email capture form. Collects just the email address.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Newsletter Block</h3>
              <p className="text-black/60 mb-4">
                Newsletter signup form with integrations for popular email marketing services.
              </p>
              <div className="bg-black/5 rounded p-4 mb-6">
                <p className="text-sm font-semibold mb-2">Integrations:</p>
                <ul className="list-disc pl-6 text-sm text-black/60">
                  <li>Mailchimp</li>
                  <li>ConvertKit</li>
                  <li>Substack</li>
                  <li>Buttondown</li>
                </ul>
              </div>
            </section>

            {/* Styling */}
            <section id="styling" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Styling Your Pages</h2>
              <p className="text-lg text-black/60 mb-6">
                PageIZ uses a carefully designed system to ensure your pages always look great.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Typography</h3>
              <p className="text-black/60 mb-4">
                We use system fonts for optimal performance and readability:
              </p>
              <ul className="list-disc pl-6 mb-6 text-black/60">
                <li>Headings: Bold and prominent</li>
                <li>Body text: Easy to read</li>
                <li>Code: Monospace font</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Colors</h3>
              <p className="text-black/60 mb-4">
                The color system is simple and effective:
              </p>
              <ul className="list-disc pl-6 mb-6 text-black/60">
                <li>Primary: Black or White (depending on theme)</li>
                <li>Text: High contrast for readability</li>
                <li>Accents: Subtle grays</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Spacing</h3>
              <p className="text-black/60 mb-4">
                Consistent spacing creates a harmonious layout. All blocks have standardized padding
                and margins.
              </p>
            </section>

            {/* Domains */}
            <section id="domains" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Custom Domains</h2>
              <p className="text-lg text-black/60 mb-6">
                Connect your own domain name to your PageIZ site for a professional look.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Subdomain (Free)</h3>
              <p className="text-black/60 mb-4">
                All sites get a free subdomain like yourname.pageiz.me. This is perfect for getting
                started quickly.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Custom Domain (Pro)</h3>
              <p className="text-black/60 mb-4">
                Pro users can connect their own domains. We'll handle SSL certificates automatically.
              </p>

              <h4 className="text-xl font-semibold mb-3">Setting Up a Custom Domain</h4>
              <ol className="list-decimal pl-6 mb-6 text-black/60 space-y-2">
                <li>Purchase a domain from a registrar (GoDaddy, Namecheap, etc.)</li>
                <li>Go to your site settings in PageIZ</li>
                <li>Click "Add Custom Domain"</li>
                <li>Enter your domain name</li>
                <li>Follow the DNS setup instructions</li>
                <li>Wait for DNS propagation (up to 48 hours)</li>
              </ol>

              <h4 className="text-xl font-semibold mb-3">DNS Configuration</h4>
              <div className="bg-black/5 rounded p-4 mb-6 font-mono text-sm">
                Type: A<br/>
                Name: @<br/>
                Value: 13.125.150.235<br/>
                <br/>
                Type: CNAME<br/>
                Name: www<br/>
                Value: pageiz.me
              </div>
            </section>

            {/* SEO */}
            <section id="seo" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">SEO Settings</h2>
              <p className="text-lg text-black/60 mb-6">
                PageIZ automatically optimizes your pages for search engines, but you can customize
                settings for better results.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Page Title</h3>
              <p className="text-black/60 mb-4">
                The title appears in search results and browser tabs. Keep it under 60 characters.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Meta Description</h3>
              <p className="text-black/60 mb-4">
                A brief description of your page (max 160 characters). This appears in search results.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Open Graph Image</h3>
              <p className="text-black/60 mb-4">
                The image that appears when your page is shared on social media. Recommended size:
                1200x630 pixels.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Automatic Features</h3>
              <ul className="list-disc pl-6 mb-6 text-black/60">
                <li>Sitemap generation</li>
                <li>robots.txt</li>
                <li>Structured data (JSON-LD)</li>
                <li>Canonical URLs</li>
                <li>Fast page loads (Core Web Vitals)</li>
              </ul>
            </section>

            {/* Analytics */}
            <section id="analytics" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Analytics</h2>
              <p className="text-lg text-black/60 mb-6">
                Track how visitors interact with your pages using PageIZ's built-in analytics.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Metrics Tracked</h3>
              <ul className="list-disc pl-6 mb-6 text-black/60">
                <li>Page views</li>
                <li>Unique visitors</li>
                <li>Referral sources</li>
                <li>Device types (desktop, mobile, tablet)</li>
                <li>Geographic location</li>
                <li>Time on page</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Accessing Analytics</h3>
              <p className="text-black/60 mb-4">
                Go to your site settings and click on the "Analytics" tab to view your stats.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
                <p className="text-blue-900 font-medium mb-2">Privacy First</p>
                <p className="text-blue-800">
                  Our analytics are privacy-focused and don't use cookies. We comply with GDPR
                  and other privacy regulations.
                </p>
              </div>
            </section>

            {/* API */}
            <section id="api" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">API Reference</h2>
              <p className="text-lg text-black/60 mb-6">
                PageIZ provides a REST API for programmatic access to your sites and pages.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Authentication</h3>
              <p className="text-black/60 mb-4">
                All API requests require a JWT token. Include it in the Authorization header:
              </p>
              <div className="bg-black text-white rounded p-4 mb-6 font-mono text-sm">
                Authorization: Bearer YOUR_JWT_TOKEN
              </div>

              <h3 className="text-2xl font-semibold mb-4">Endpoints</h3>

              <div className="space-y-6 mb-6">
                <div className="border border-black/10 rounded p-4">
                  <p className="font-mono text-sm mb-2">POST /api/auth/signup</p>
                  <p className="text-sm text-black/60">Create a new user account</p>
                </div>

                <div className="border border-black/10 rounded p-4">
                  <p className="font-mono text-sm mb-2">POST /api/auth/login</p>
                  <p className="text-sm text-black/60">Login and receive JWT token</p>
                </div>

                <div className="border border-black/10 rounded p-4">
                  <p className="font-mono text-sm mb-2">GET /api/sites</p>
                  <p className="text-sm text-black/60">Get all sites for authenticated user</p>
                </div>

                <div className="border border-black/10 rounded p-4">
                  <p className="font-mono text-sm mb-2">POST /api/sites</p>
                  <p className="text-sm text-black/60">Create a new site</p>
                </div>

                <div className="border border-black/10 rounded p-4">
                  <p className="font-mono text-sm mb-2">GET /api/pages?siteId=...</p>
                  <p className="text-sm text-black/60">Get pages for a site</p>
                </div>

                <div className="border border-black/10 rounded p-4">
                  <p className="font-mono text-sm mb-2">POST /api/pages</p>
                  <p className="text-sm text-black/60">Create a new page</p>
                </div>

                <div className="border border-black/10 rounded p-4">
                  <p className="font-mono text-sm mb-2">POST /api/blocks</p>
                  <p className="text-sm text-black/60">Create a new block</p>
                </div>

                <div className="border border-black/10 rounded p-4">
                  <p className="font-mono text-sm mb-2">PUT /api/blocks?id=...</p>
                  <p className="text-sm text-black/60">Update a block</p>
                </div>

                <div className="border border-black/10 rounded p-4">
                  <p className="font-mono text-sm mb-2">DELETE /api/blocks?id=...</p>
                  <p className="text-sm text-black/60">Delete a block</p>
                </div>

                <div className="border border-black/10 rounded p-4">
                  <p className="font-mono text-sm mb-2">POST /api/media/upload</p>
                  <p className="text-sm text-black/60">Upload media to S3</p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Example: Creating a Site</h3>
              <div className="bg-black text-white rounded p-4 mb-6 font-mono text-sm overflow-x-auto">
                {`curl -X POST https://pageiz.me/api/sites \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "My New Site", "theme": "white"}'`}
              </div>

              <h3 className="text-2xl font-semibold mb-4">Rate Limits</h3>
              <ul className="list-disc pl-6 mb-6 text-black/60">
                <li>Free: 100 requests per hour</li>
                <li>Pro: 1,000 requests per hour</li>
                <li>Business: 10,000 requests per hour</li>
              </ul>
            </section>

            {/* Best Practices */}
            <section id="best-practices" className="mb-24 scroll-mt-24">
              <h2 className="text-4xl font-bold mb-6">Best Practices</h2>
              <p className="text-lg text-black/60 mb-6">
                Follow these guidelines to create the best possible pages with PageIZ.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Content</h3>
              <ul className="list-disc pl-6 mb-6 text-black/60 space-y-2">
                <li>Keep your message clear and concise</li>
                <li>Use headings to structure content</li>
                <li>Break up long text with images and other blocks</li>
                <li>Write for your audience, not search engines</li>
                <li>Include a clear call-to-action</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Images</h3>
              <ul className="list-disc pl-6 mb-6 text-black/60 space-y-2">
                <li>Use high-quality images (but not too large)</li>
                <li>Always add alt text for accessibility</li>
                <li>Optimize images before uploading (max 2MB)</li>
                <li>Use WebP format when possible</li>
                <li>Consider aspect ratio for consistency</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">SEO</h3>
              <ul className="list-disc pl-6 mb-6 text-black/60 space-y-2">
                <li>Write unique page titles and descriptions</li>
                <li>Use descriptive URLs (slugs)</li>
                <li>Include keywords naturally in content</li>
                <li>Add Open Graph images for social sharing</li>
                <li>Keep page load times fast</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Performance</h3>
              <ul className="list-disc pl-6 mb-6 text-black/60 space-y-2">
                <li>Limit the number of blocks per page (20-30 max)</li>
                <li>Compress images before uploading</li>
                <li>Avoid autoplay videos</li>
                <li>Test on mobile devices</li>
                <li>Use lazy loading for images</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Accessibility</h3>
              <ul className="list-disc pl-6 mb-6 text-black/60 space-y-2">
                <li>Use proper heading hierarchy (H1, H2, H3)</li>
                <li>Add alt text to all images</li>
                <li>Ensure sufficient color contrast</li>
                <li>Make links descriptive</li>
                <li>Test with a screen reader</li>
              </ul>
            </section>

            {/* Support */}
            <section className="mb-24">
              <h2 className="text-4xl font-bold mb-6">Need Help?</h2>
              <p className="text-lg text-black/60 mb-6">
                We're here to help you succeed with PageIZ.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Email Support</h3>
                  <p className="text-black/60 mb-4">
                    Get help via email. We typically respond within 24 hours.
                  </p>
                  <a href="mailto:support@pageiz.me" className="text-sm underline">
                    support@pageiz.me
                  </a>
                </div>

                <div className="border border-black/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Community</h3>
                  <p className="text-black/60 mb-4">
                    Join our community to share ideas and get help from other users.
                  </p>
                  <Link href="/signup" className="text-sm underline">
                    Join Discord
                  </Link>
                </div>
              </div>

              <div className="mt-12 bg-black text-white rounded-lg p-12 text-center">
                <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
                <p className="text-white/80 mb-8">
                  Create your first page in less than 5 minutes.
                </p>
                <Link
                  href="/signup"
                  className="inline-block px-8 py-4 bg-white text-black rounded-lg hover:bg-white/90 font-medium"
                >
                  Sign Up Now
                </Link>
              </div>
            </section>
          </article>
        </main>
      </div>
    </div>
  );
}
