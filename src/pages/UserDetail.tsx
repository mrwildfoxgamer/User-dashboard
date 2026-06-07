import { memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUsers';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../hooks/useTheme';
import ErrorState from '../components/ErrorState';
import Footer from '../components/Footer';

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow = memo(function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0 dark:border-slate-700">
      <span className="mt-0.5 text-base w-5 shrink-0 text-center">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5 dark:text-slate-500">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-800 hover:text-blue-600 underline underline-offset-2 break-all dark:text-slate-200 dark:hover:text-blue-400"
          >
            {value}
          </a>
        ) : (
          <p className="text-slate-800 break-words dark:text-slate-200">{value}</p>
        )}
      </div>
    </div>
  );
});

const Section = memo(function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-100 px-6 py-3 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {title}
        </h2>
      </div>
      <div className="px-6 py-1">{children}</div>
    </div>
  );
});

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-1/3 rounded-lg bg-slate-100 dark:bg-slate-700" />
      <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4 dark:border-slate-700 dark:bg-slate-800">
        {[80, 60, 70, 90].map((w, i) => (
          <div key={i} className="h-4 rounded bg-slate-100 dark:bg-slate-700" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4 dark:border-slate-700 dark:bg-slate-800">
        {[65, 50, 75].map((w, i) => (
          <div key={i} className="h-4 rounded bg-slate-100 dark:bg-slate-700" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

const COLOURS = [
  ['bg-rose-100', 'text-rose-700', 'dark:bg-rose-900/40', 'dark:text-rose-300'],
  ['bg-sky-100', 'text-sky-700', 'dark:bg-sky-900/40', 'dark:text-sky-300'],
  ['bg-emerald-100', 'text-emerald-700', 'dark:bg-emerald-900/40', 'dark:text-emerald-300'],
  ['bg-violet-100', 'text-violet-700', 'dark:bg-violet-900/40', 'dark:text-violet-300'],
  ['bg-amber-100', 'text-amber-700', 'dark:bg-amber-900/40', 'dark:text-amber-300'],
  ['bg-pink-100', 'text-pink-700', 'dark:bg-pink-900/40', 'dark:text-pink-300'],
  ['bg-teal-100', 'text-teal-700', 'dark:bg-teal-900/40', 'dark:text-teal-300'],
  ['bg-indigo-100', 'text-indigo-700', 'dark:bg-indigo-900/40', 'dark:text-indigo-300'],
];

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numId = Number(id);
  const { data: user, loading, error, retry } = useUser(numId);
  const { isFavorite, toggle } = useFavorites();
  const { isDark, toggle: toggleTheme } = useTheme();
  const fav = isFavorite(numId);

  const colours = COLOURS[numId % COLOURS.length];
  const avatarCls = colours.join(' ');

  const initials =
    user?.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? '??';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm px-6 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
        <div className="mx-auto max-w-4xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition dark:text-slate-400 dark:hover:text-slate-100 shrink-0"
            >
              ← Back
            </button>
            <span className="text-slate-200 dark:text-slate-700">|</span>
            <Link to="/" className="text-sm text-slate-400 hover:text-slate-600 transition dark:text-slate-500 dark:hover:text-slate-300 shrink-0">
              Directory
            </Link>
            {user && (
              <>
                <span className="text-slate-200 dark:text-slate-700">/</span>
                <span className="text-sm font-medium text-slate-700 truncate dark:text-slate-200">
                  {user.name}
                </span>
              </>
            )}
          </div>

          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        {loading && <DetailSkeleton />}
        {error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && user && (
          <div className="space-y-6 animate-slide-up">
            {/* Hero card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-8 py-7 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${avatarCls}`}
                >
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {user.name}
                    </h1>
                    <button
                      onClick={() => toggle(numId)}
                      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                      className={`text-xl transition-all duration-150 hover:scale-125 active:scale-95 ${
                        fav ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300 dark:text-slate-600 dark:hover:text-amber-400'
                      }`}
                    >
                      ★
                    </button>
                  </div>
                  <p className="text-slate-400 mt-0.5 dark:text-slate-500">@{user.username}</p>
                </div>

                <div className="flex sm:flex-col gap-4 sm:gap-1 sm:text-right text-sm text-slate-500 shrink-0 dark:text-slate-400">
                  <span>ID #{user.id}</span>
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline dark:text-blue-400"
                  >
                    {user.website}
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Section title="Contact">
                <InfoRow icon="✉️" label="Email" value={user.email} href={`mailto:${user.email}`} />
                <InfoRow icon="📞" label="Phone" value={user.phone} />
                <InfoRow icon="🌐" label="Website" value={user.website} href={`https://${user.website}`} />
              </Section>

              <Section title="Company">
                <InfoRow icon="🏢" label="Name" value={user.company.name} />
                <InfoRow icon="💬" label="Catch phrase" value={user.company.catchPhrase} />
                <InfoRow icon="📊" label="Business" value={user.company.bs} />
              </Section>

              <div className="md:col-span-2">
                <Section title="Address">
                  <div className="grid sm:grid-cols-2">
                    <InfoRow icon="🏠" label="Street" value={`${user.address.street}, ${user.address.suite}`} />
                    <InfoRow icon="🏙️" label="City" value={user.address.city} />
                    <InfoRow icon="📮" label="Zip code" value={user.address.zipcode} />
                    <InfoRow
                      icon="🗺️"
                      label="Coordinates"
                      value={`${user.address.geo.lat}, ${user.address.geo.lng}`}
                      href={`https://www.google.com/maps?q=${user.address.geo.lat},${user.address.geo.lng}`}
                    />
                  </div>
                </Section>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
