import { memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUsers';
import { useFavorites } from '../hooks/useFavorites';
import ErrorState from '../components/ErrorState';

// ─── Sub-components (memo for perf) ──────────────────────────────────────────

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
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="mt-0.5 text-base w-5 shrink-0 text-center">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-800 hover:text-blue-600 underline underline-offset-2 break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-slate-800 break-words">{value}</p>
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
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-3 bg-slate-50">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h2>
      </div>
      <div className="px-6 py-1">{children}</div>
    </div>
  );
});

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-1/3 rounded-lg bg-slate-100" />
      <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4">
        {[80, 60, 70, 90].map((w, i) => (
          <div key={i} className={`h-4 rounded bg-slate-100`} style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4">
        {[65, 50, 75].map((w, i) => (
          <div key={i} className={`h-4 rounded bg-slate-100`} style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Avatar colours ───────────────────────────────────────────────────────────
const COLOURS = [
  ['bg-rose-100', 'text-rose-700'],
  ['bg-sky-100', 'text-sky-700'],
  ['bg-emerald-100', 'text-emerald-700'],
  ['bg-violet-100', 'text-violet-700'],
  ['bg-amber-100', 'text-amber-700'],
  ['bg-pink-100', 'text-pink-700'],
  ['bg-teal-100', 'text-teal-700'],
  ['bg-indigo-100', 'text-indigo-700'],
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numId = Number(id);
  const { data: user, loading, error, retry } = useUser(numId);
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(numId);

  const [bg, fg] = COLOURS[numId % COLOURS.length];

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '??';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav bar */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto max-w-4xl flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition"
          >
            ← Back
          </button>
          <span className="text-slate-200">|</span>
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-600 transition">
            Directory
          </Link>
          {user && (
            <>
              <span className="text-slate-200">/</span>
              <span className="text-sm font-medium text-slate-700 truncate">{user.name}</span>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {loading && <DetailSkeleton />}

        {error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && user && (
          <div className="space-y-6">
            {/* Hero card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-8 py-7">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Avatar */}
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${bg} ${fg}`}
                >
                  {initials}
                </div>

                {/* Name block */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
                    <button
                      onClick={() => toggle(numId)}
                      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                      className={`text-xl transition-transform hover:scale-110 ${
                        fav ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'
                      }`}
                    >
                      ★
                    </button>
                  </div>
                  <p className="text-slate-400 mt-0.5">@{user.username}</p>
                </div>

                {/* Quick stats row */}
                <div className="flex sm:flex-col gap-4 sm:gap-1 sm:text-right text-sm text-slate-500 shrink-0">
                  <span>ID #{user.id}</span>
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Two-column grid on md+ */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic info */}
              <Section title="Contact">
                <InfoRow icon="✉️" label="Email" value={user.email} href={`mailto:${user.email}`} />
                <InfoRow icon="📞" label="Phone" value={user.phone} />
                <InfoRow
                  icon="🌐"
                  label="Website"
                  value={user.website}
                  href={`https://${user.website}`}
                />
              </Section>

              {/* Company */}
              <Section title="Company">
                <InfoRow icon="🏢" label="Name" value={user.company.name} />
                <InfoRow icon="💬" label="Catch phrase" value={user.company.catchPhrase} />
                <InfoRow icon="📊" label="Business" value={user.company.bs} />
              </Section>

              {/* Address — full width */}
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
    </div>
  );
}
