import { Link } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';

export default function Home() {
  const { data: users, loading, error } = useUsers();

  if (loading) return <p className="p-8 text-center">Loading users…</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
        {users?.map((user) => (
          <li key={user.id}>
            <Link
              to={`/users/${user.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
