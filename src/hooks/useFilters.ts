import { useState, useMemo, useCallback } from 'react';
import { CSVData, CSVRow, FilterCondition } from '../types';

export function useFilters(csvData: CSVData | null) {
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  const addFilter = useCallback((field: string, value: string) => {
    if (!value.trim()) return;
    setFilters(prev => [
      ...prev,
      { id: Date.now().toString(), field, value: value.trim() },
    ]);
  }, []);

  const removeFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const filteredRows = useMemo<CSVRow[]>(() => {
    if (!csvData) return [];
    if (filters.length === 0) return csvData.rows;

    return csvData.rows.filter(row =>
      filters.every(filter => {
        const cellValue = (row[filter.field] ?? '').toLowerCase();
        const filterValue = filter.value.toLowerCase();
        return cellValue.includes(filterValue);
      })
    );
  }, [csvData, filters]);

  return {
    filters,
    filteredRows,
    addFilter,
    removeFilter,
    clearFilters,
    hasFilters: filters.length > 0,
  };
}
