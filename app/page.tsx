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

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-24">
        <div className="max-w-3xl text-center space-y-8">
          <h2 className="text-5xl font-semibold leading-tight">
            Build your page in 5 minutes
          </h2>
          <p className="text-lg text-black/60 max-w-2xl mx-auto">
            Create beautiful single pages for your profile, links, events, or portfolio.
            Deploy instantly with SEO optimization and custom domains.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/signup"
              className="px-8 py-3 text-base font-medium bg-black text-white rounded-lg hover:bg-black/90"
            >
              Get Started
            </Link>
            <Link
              href="/docs"
              className="px-8 py-3 text-base font-medium border border-black/20 rounded-lg hover:bg-black/5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-black/10 px-8 py-6">
        <div className="mx-auto max-w-6xl text-center text-sm text-black/40">
          2025 PageIZ. Built with Next.js.
        </div>
      </footer>
    </div>
  );
}
