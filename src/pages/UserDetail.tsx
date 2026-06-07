import { useParams, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUsers';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: user, loading, error } = useUser(Number(id));

  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (error || !user) return <p className="p-8 text-center text-red-500">{error ?? 'User not found'}</p>;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <Link to="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
        ← Back to Users
      </Link>

      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
      <p className="text-gray-500 mb-6">@{user.username}</p>

      <section className="grid gap-4">
        <Detail label="Email" value={user.email} />
        <Detail label="Phone" value={user.phone} />
        <Detail label="Website" value={user.website} />
        <Detail
          label="Address"
          value={`${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}`}
        />
        <Detail label="Company" value={user.company.name} />
        <Detail label="Catch Phrase" value={`"${user.company.catchPhrase}"`} />
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-lg px-5 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}
