import React from 'react';

interface TableRendererProps {
  children: React.ReactNode;
}

export function TableRenderer({ children }: TableRendererProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            {children}
          </table>
        </div>
      </div>
    </div>
  );
}

export const tableComponents = {
  table: ({ children }: { children: React.ReactNode }) => (
    <TableRenderer>{children}</TableRenderer>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-gray-50">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="transition-colors hover:bg-gray-50/50">{children}</tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-6 py-4 text-sm text-gray-600 whitespace-normal">
      {children}
    </td>
  ),
};