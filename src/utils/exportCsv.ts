import type { User } from '../types';

export function exportUsersToCsv(users: User[], filename = 'users.csv'): void {
  const headers = ['ID', 'Name', 'Username', 'Email', 'Phone', 'City', 'Company', 'Website'];
  const rows = users.map((u) => [
    u.id,
    u.name,
    u.username,
    u.email,
    u.phone,
    u.address.city,
    u.company.name,
    u.website,
  ]);

  const escape = (val: string | number) => {
    const str = String(val);
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
