import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-black/10 px-8 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <h1 className="text-2xl font-semibold">PageIZ</h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-sm font-medium hover:underline"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-black/90"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-8 py-24 bg-gradient-to-b from-white to-black/5">
          <div className="max-w-3xl text-center space-y-8">
            <h2 className="text-6xl font-bold leading-tight tracking-tight">
              Build your page in 5 minutes
            </h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto leading-relaxed">
              Create beautiful single pages for your profile, links, events, or portfolio.
              Deploy instantly with SEO optimization and custom domains.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link
                href="/signup"
                className="px-8 py-4 text-lg font-medium bg-black text-white rounded-lg hover:bg-black/90 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <Link
                href="https://docs.pageiz.me"
                className="px-8 py-4 text-lg font-medium border-2 border-black/20 rounded-lg hover:bg-black/5 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-8 py-24 bg-white">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-4xl font-bold text-center mb-16">
              Everything you need to build amazing pages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 border border-black/10 rounded-xl hover:border-black/30 transition-all">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-semibold mb-3">Lightning Fast</h4>
                <p className="text-black/60 leading-relaxed">
                  Build and deploy your page in just 5 minutes. No coding required.
                </p>
              </div>

              <div className="p-8 border border-black/10 rounded-xl hover:border-black/30 transition-all">
                <div className="text-4xl mb-4">🎨</div>
                <h4 className="text-xl font-semibold mb-3">Beautiful Themes</h4>
                <p className="text-black/60 leading-relaxed">
                  Choose from elegant black and white themes that look professional.
                </p>
              </div>

              <div className="p-8 border border-black/10 rounded-xl hover:border-black/30 transition-all">
                <div className="text-4xl mb-4">🔧</div>
                <h4 className="text-xl font-semibold mb-3">Drag & Drop Editor</h4>
                <p className="text-black/60 leading-relaxed">
                  Intuitive editor with 27 different block types for ultimate flexibility.
                </p>
              </div>

              <div className="p-8 border border-black/10 rounded-xl hover:border-black/30 transition-all">
                <div className="text-4xl mb-4">🌐</div>
                <h4 className="text-xl font-semibold mb-3">Custom Domains</h4>
                <p className="text-black/60 leading-relaxed">
                  Use your own domain or get a free subdomain. SSL included automatically.
                </p>
              </div>

              <div className="p-8 border border-black/10 rounded-xl hover:border-black/30 transition-all">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="text-xl font-semibold mb-3">Analytics</h4>
                <p className="text-black/60 leading-relaxed">
                  Track your page views and visitor engagement with built-in analytics.
                </p>
              </div>

              <div className="p-8 border border-black/10 rounded-xl hover:border-black/30 transition-all">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="text-xl font-semibold mb-3">SEO Optimized</h4>
                <p className="text-black/60 leading-relaxed">
                  Meta tags, Open Graph, and sitemap generation for better search rankings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Block Types Section */}
        <section className="px-8 py-24 bg-black/5">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-4xl font-bold text-center mb-4">
              27 Powerful Block Types
            </h3>
            <p className="text-xl text-black/60 text-center mb-16">
              Mix and match blocks to create your perfect page
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Text', 'Heading', 'Link', 'Button', 'Image', 'Video',
                'Gallery', 'Divider', 'Spacer', 'Social Links', 'Email Form',
                'Newsletter', 'Code Block', 'Quote', 'List', 'Table',
                'Accordion', 'Tabs', 'Map', 'Countdown', 'Testimonial',
                'Pricing', 'FAQ', 'Contact Form', 'Embed', 'Icon', 'Card'
              ].map((block) => (
                <div
                  key={block}
                  className="px-4 py-3 bg-white border border-black/10 rounded-lg text-center hover:border-black/30 transition-all"
                >
                  <span className="font-medium text-sm">{block}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="px-8 py-24 bg-white">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-4xl font-bold text-center mb-16">
              Perfect for any use case
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="border-l-4 border-black pl-6">
                  <h4 className="text-2xl font-semibold mb-2">Personal Portfolio</h4>
                  <p className="text-black/60 leading-relaxed">
                    Showcase your work, skills, and achievements with a beautiful single-page portfolio.
                  </p>
                </div>
                <div className="border-l-4 border-black pl-6">
                  <h4 className="text-2xl font-semibold mb-2">Link in Bio</h4>
                  <p className="text-black/60 leading-relaxed">
                    Create a landing page with all your important links for social media.
                  </p>
                </div>
                <div className="border-l-4 border-black pl-6">
                  <h4 className="text-2xl font-semibold mb-2">Event Pages</h4>
                  <p className="text-black/60 leading-relaxed">
                    Promote your events with countdown timers, registration forms, and more.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-black pl-6">
                  <h4 className="text-2xl font-semibold mb-2">Product Launch</h4>
                  <p className="text-black/60 leading-relaxed">
                    Build hype for your product with a beautiful landing page and email capture.
                  </p>
                </div>
                <div className="border-l-4 border-black pl-6">
                  <h4 className="text-2xl font-semibold mb-2">Resume/CV</h4>
                  <p className="text-black/60 leading-relaxed">
                    Stand out with an interactive online resume that's easy to share.
                  </p>
                </div>
                <div className="border-l-4 border-black pl-6">
                  <h4 className="text-2xl font-semibold mb-2">Business Cards</h4>
                  <p className="text-black/60 leading-relaxed">
                    Replace paper cards with a digital page that's always up to date.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-8 py-24 bg-black/5">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-4xl font-bold text-center mb-4">
              Simple, transparent pricing
            </h3>
            <p className="text-xl text-black/60 text-center mb-16">
              Start for free, upgrade when you need more
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 bg-white border-2 border-black/10 rounded-xl">
                <h4 className="text-2xl font-bold mb-2">Free</h4>
                <p className="text-4xl font-bold mb-6">$0<span className="text-lg text-black/60">/month</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-black/60">1 site</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-black/60">Free subdomain</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-black/60">All block types</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-black/60">Basic analytics</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="block w-full py-3 text-center border-2 border-black rounded-lg hover:bg-black/5 font-medium transition-all"
                >
                  Get Started
                </Link>
              </div>

              <div className="p-8 bg-black text-white rounded-xl relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-white text-black text-sm font-semibold rounded-full">
                  Popular
                </div>
                <h4 className="text-2xl font-bold mb-2">Pro</h4>
                <p className="text-4xl font-bold mb-6">$9<span className="text-lg text-white/60">/month</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-white/80">Unlimited sites</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-white/80">Custom domains</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-white/80">All block types</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-white/80">Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-white/80">Remove branding</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="block w-full py-3 text-center bg-white text-black rounded-lg hover:bg-white/90 font-medium transition-all"
                >
                  Upgrade to Pro
                </Link>
              </div>

              <div className="p-8 bg-white border-2 border-black/10 rounded-xl">
                <h4 className="text-2xl font-bold mb-2">Business</h4>
                <p className="text-4xl font-bold mb-6">$29<span className="text-lg text-black/60">/month</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-black/60">Everything in Pro</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-black/60">Team collaboration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-black/60">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-black/60">API access</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="block w-full py-3 text-center border-2 border-black rounded-lg hover:bg-black/5 font-medium transition-all"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-24 bg-white">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-5xl font-bold mb-6">
              Ready to build your page?
            </h3>
            <p className="text-xl text-black/60 mb-8">
              Join thousands of creators who trust PageIZ for their online presence
            </p>
            <Link
              href="/signup"
              className="inline-block px-12 py-4 text-lg font-medium bg-black text-white rounded-lg hover:bg-black/90 transition-all shadow-lg hover:shadow-xl"
            >
              Start Building Now
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 px-8 py-12 bg-black/5">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">PageIZ</h3>
              <p className="text-sm text-black/60">
                Build beautiful single pages in minutes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/signup" className="text-black/60 hover:text-black">Features</Link></li>
                <li><Link href="/signup" className="text-black/60 hover:text-black">Pricing</Link></li>
                <li><Link href="https://docs.pageiz.me" className="text-black/60 hover:text-black">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/signup" className="text-black/60 hover:text-black">About</Link></li>
                <li><Link href="/signup" className="text-black/60 hover:text-black">Blog</Link></li>
                <li><Link href="/signup" className="text-black/60 hover:text-black">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/signup" className="text-black/60 hover:text-black">Privacy</Link></li>
                <li><Link href="/signup" className="text-black/60 hover:text-black">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-black/10 text-center text-sm text-black/40">
            © 2025 PageIZ. Built with Next.js and deployed on AWS.
          </div>
        </div>
      </footer>
    </div>
  );
}
