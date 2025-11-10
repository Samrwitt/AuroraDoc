// app/page.tsx
import Link from "next/link";

const AUTH_ORIGIN =
  process.env.NEXT_PUBLIC_AUTH_ORIGIN ?? "http://localhost:8080";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          {/* AuroraDoc logo-ish */}
          <div className="h-8 w-8 rounded-lg bg-indigo-600" />
          <span className="font-semibold text-slate-800 text-lg">AuroraDoc</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <Link href="/changelog" className="hover:text-slate-900">Changelog</Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`${AUTH_ORIGIN}/auth/google/start`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <GoogleIcon className="h-4 w-4" />
            Sign in
          </a>
          <a
            href={`${AUTH_ORIGIN}/auth/github/start`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black"
          >
            <GitHubIcon className="h-4 w-4" />
            Link GitHub
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-10 md:pt-24 md:pb-16">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Create, collaborate, and compile to LaTeX-perfect PDFs.
            </h1>
            <p className="mt-4 text-slate-600 text-lg">
              Real-time editing like Google Docs. Under the hood: CRDTs, offline sync,
              and LaTeX-grade output when you export.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700"
              >
                Go to Docs
              </Link>
              <a
                href={`${AUTH_ORIGIN}/auth/google/start`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-800 hover:bg-slate-50"
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </a>
              <a
                href={`${AUTH_ORIGIN}/auth/github/start`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-5 py-3 font-medium text-white hover:bg-black"
              >
                <GitHubIcon className="h-5 w-5" />
                Link GitHub
              </a>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              By continuing you agree to the Terms and acknowledge the Privacy Policy.
            </p>
          </div>

          {/* Right side: promo cards */}
          <div className="grid grid-cols-2 gap-4">
            <PromoCard
              title="Start from blank"
              desc="Open a new doc with one click."
            />
            <PromoCard
              title="Import .tex"
              desc="Edit collaboratively, export as LaTeX PDF."
            />
            <PromoCard
              title="Smart outline"
              desc="Generate or refine headings locally."
            />
            <PromoCard
              title="Semantic search"
              desc="Find paragraphs by meaning, not keywords."
            />
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            title="New document"
            href="/documents/new"
            kbd="N"
          />
          <QuickAction
            title="Open recent"
            href="/projects"
            kbd="R"
          />
          <QuickAction
            title="Templates"
            href="/templates"
            kbd="T"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-sm text-slate-500 px-6">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <span>© {new Date().getFullYear()} AuroraDoc</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            <Link href="/status" className="hover:text-slate-700">Status</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* --- Small presentational components --- */

function PromoCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-10 w-10 rounded-lg bg-indigo-100 mb-3" />
      <h3 className="font-medium text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-1">{desc}</p>
    </div>
  );
}

function QuickAction({
  title,
  href,
  kbd,
}: {
  title: string;
  href: string;
  kbd: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:bg-slate-50"
    >
      <span className="font-medium text-slate-800">{title}</span>
      <kbd className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-xs text-slate-600">
        {kbd}
      </kbd>
    </Link>
  );
}

/* --- Inline icons (no extra deps) --- */

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.3 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.6 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.3 29.3 4 24 4 16.1 4 9.2 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.1 0 9.8-1.9 13.3-5.1l-6.1-5c-2.2 1.5-5 2.3-7.9 2.3-5.1 0-9.5-3.4-11.1-8.1l-6.5 5C9.2 39.6 16.1 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.5 4.6-5.9 8-11.3 8-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.3 29.3 4 24 4c-8 0-14.8 4.6-17.7 11.3l6.6 4.8C14.5 15.6 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.3 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"/>
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12.4c0 5.3 3.4 9.8 8.2 11.3.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.5-1.5-1.9-1.5-1.9-1.2-.8.1-.8.1-.8 1.3.1 1.9 1.4 1.9 1.4 1.2 2 3.1 1.4 3.9 1.1.1-.9.5-1.4.8-1.8-2.7-.3-5.6-1.4-5.6-6.2 0-1.4.5-2.6 1.3-3.5-.1-.3-.6-1.7.1-3.6 0 0 1-.3 3.5 1.3a12 12 0 0 1 6.4 0c2.4-1.6 3.5-1.3 3.5-1.3.7 1.9.3 3.3.1 3.6.9.9 1.3 2.1 1.3 3.5 0 4.8-2.9 5.9-5.6 6.2.5.4.9 1.2.9 2.5v3.7c0 .3.2.7.8.6 4.8-1.5 8.2-6 8.2-11.3A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}
