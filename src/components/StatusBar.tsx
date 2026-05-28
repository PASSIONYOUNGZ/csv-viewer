interface StatusBarProps {
  totalRows: number;
  filteredRows: number;
  selectedRows: number;
  hasFilters: boolean;
}

export default function StatusBar({ totalRows, filteredRows, selectedRows, hasFilters }: StatusBarProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <span>总行数: <strong>{totalRows.toLocaleString()}</strong></span>
      {hasFilters && (
        <span>筛选结果: <strong>{filteredRows.toLocaleString()}</strong></span>
      )}
      <span>已选: <strong>{selectedRows.toLocaleString()}</strong></span>
    </div>
  );
}
