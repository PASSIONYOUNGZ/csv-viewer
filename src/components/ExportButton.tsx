import { useState } from 'react';
import { CSVRow } from '../types';
import { buildCSV, downloadCSV, computeHash } from '../utils/export';

interface ExportButtonProps {
  headers: string[];
  selectedRows: Set<number>;
  allFilteredRows: CSVRow[];
  disabled?: boolean;
}

export default function ExportButton({ headers, selectedRows, allFilteredRows, disabled }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (selectedRows.size === 0) return;
    setExporting(true);

    const rowsToExport = allFilteredRows.filter((_, i) => selectedRows.has(i));
    const csvContent = buildCSV(headers, rowsToExport);

    try {
      const hash = await computeHash(csvContent);
      const filename = `${hash}.csv`;
      downloadCSV(csvContent, filename);
    } catch {
      const fallback = `export_${Date.now()}.csv`;
      downloadCSV(csvContent, fallback);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || selectedRows.size === 0 || exporting}
      className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
    >
      {exporting ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          计算中...
        </>
      ) : (
        <>导出选中 ({selectedRows.size}) 行</>
      )}
    </button>
  );
}
