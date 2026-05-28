import { useState } from 'react';
import { useCSV } from './hooks/useCSV';
import { useFilters } from './hooks/useFilters';
import FileUpload from './components/FileUpload';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';
import ExportButton from './components/ExportButton';
import StatusBar from './components/StatusBar';

export default function App() {
  const { csvData, isLoading, error, progress, parseCSV, clearData } = useCSV();
  const { filters, filteredRows, addFilter, removeFilter, clearFilters, hasFilters } = useFilters(csvData);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const displayRows = hasFilters ? filteredRows : (csvData?.rows ?? []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">CSV Viewer</h1>
          <p className="text-sm text-gray-500">数据查看与筛选导出工具</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">正在解析 CSV 文件... {progress}%</p>
          </div>
        )}

        {!csvData && !isLoading && !error && (
          <FileUpload onUpload={parseCSV} isLoading={isLoading} />
        )}

        {csvData && !isLoading && (
          <>
            <FileUpload
              onUpload={parseCSV}
              isLoading={isLoading}
              fileName={csvData.fileName}
              onClear={() => { clearData(); setSelectedRows(new Set()); }}
            />

            <FilterPanel
              headers={csvData.headers}
              filters={filters}
              onAdd={addFilter}
              onRemove={removeFilter}
              onClear={clearFilters}
            />

            <div className="flex items-center justify-between">
              <StatusBar
                totalRows={csvData.totalRows}
                filteredRows={filteredRows.length}
                selectedRows={selectedRows.size}
                hasFilters={hasFilters}
              />
              <ExportButton
                headers={csvData.headers}
                selectedRows={selectedRows}
                allFilteredRows={displayRows}
              />
            </div>

            <DataTable
              headers={csvData.headers}
              rows={displayRows}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
            />
          </>
        )}

        <footer className="text-center text-xs text-gray-400 py-4">
          CSV Viewer - 支持 100MB 以内 CSV 文件
        </footer>
      </main>
    </div>
  );
}
