import { useState, useMemo } from 'react';
import { CSVRow } from '../types';

interface DataTableProps {
  headers: string[];
  rows: CSVRow[];
  selectedRows: Set<number>;
  onSelectionChange: (selected: Set<number>) => void;
}

const PAGE_SIZE = 50;

export default function DataTable({ headers, rows, selectedRows, onSelectionChange }: DataTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  const pageRows = useMemo(
    () => rows.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE),
    [rows, safePage]
  );

  const globalRowIndex = (rowIndex: number) => safePage * PAGE_SIZE + rowIndex;

  const toggleRow = (globalIdx: number) => {
    const next = new Set(selectedRows);
    if (next.has(globalIdx)) {
      next.delete(globalIdx);
    } else {
      next.add(globalIdx);
    }
    onSelectionChange(next);
  };

  const toggleAll = () => {
    const pageGlobalIndices = pageRows.map((_, i) => globalRowIndex(i));
    const allSelected = pageGlobalIndices.every(i => selectedRows.has(i));
    const next = new Set(selectedRows);
    if (allSelected) {
      pageGlobalIndices.forEach(i => next.delete(i));
    } else {
      pageGlobalIndices.forEach(i => next.add(i));
    }
    onSelectionChange(next);
  };

  const allSelected = pageRows.length > 0 && pageRows.every((_, i) => selectedRows.has(globalRowIndex(i)));

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-auto max-h-[600px]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="w-12 px-2 py-2 text-gray-500 font-medium text-xs">#</th>
              {headers.map(h => (
                <th key={h} className="px-3 py-2 text-left text-gray-600 font-medium text-xs whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 2} className="text-center py-12 text-gray-400">
                  无匹配数据
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => {
                const globalIdx = globalRowIndex(i);
                return (
                  <tr
                    key={globalIdx}
                    onClick={() => toggleRow(globalIdx)}
                    className={`border-t border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      selectedRows.has(globalIdx) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(globalIdx)}
                        onChange={() => toggleRow(globalIdx)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-2 py-2 text-gray-400 text-xs">{globalIdx + 1}</td>
                    {headers.map(h => (
                      <td key={h} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">
                        {row[h] ?? ''}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            共 {rows.length} 行，第 {safePage + 1}/{totalPages} 页
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
