import { useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { CSVData, CSVRow } from '../types';

export function useCSV() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const abortRef = useRef<(() => void) | null>(null);

  const setDataFromRows = useCallback((rows: CSVRow[], fileName: string) => {
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    setCsvData({
      headers,
      rows,
      fileName,
      fileSize: 0,
      totalRows: rows.length,
    });
    setIsLoading(false);
    setProgress(100);
  }, []);

  const parseCSV = useCallback((file: File) => {
    if (abortRef.current) {
      abortRef.current();
    }

    if (!file.name.endsWith('.csv')) {
      setError('请上传 .csv 格式的文件');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('文件大小不能超过 100MB');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCsvData(null);
    setProgress(0);

    const rows: CSVRow[] = [];
    let headers: string[] = [];
    let aborted = false;

    abortRef.current = () => {
      aborted = true;
    };

    Papa.parse<CSVRow>(file, {
      header: true,
      worker: true,
      step(results) {
        if (aborted) return;
        rows.push(results.data);
        const pct = Math.min(
          Math.round((results.meta.cursor / file.size) * 100),
          100
        );
        setProgress(pct);
      },
      complete() {
        if (aborted) return;
        setDataFromRows(rows, file.name);
        abortRef.current = null;
      },
      error(err) {
        if (aborted) return;
        setError(err.message);
        setIsLoading(false);
        abortRef.current = null;
      },
    });
  }, []);

  const clearData = useCallback(() => {
    if (abortRef.current) abortRef.current();
    setCsvData(null);
    setError(null);
    setProgress(0);
  }, []);

  const loadTestCSV = useCallback(async (url: string, label: string) => {
    setIsLoading(true);
    setError(null);
    setCsvData(null);
    setProgress(0);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`无法加载测试数据 (${res.status})`);
      const text = await res.text();

      const result = Papa.parse<CSVRow>(text, { header: true });
      if (result.errors.length > 0) {
        console.warn('CSV parse warnings:', result.errors);
      }
      setDataFromRows(result.data, label);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
      setIsLoading(false);
    }
  }, [setDataFromRows]);

  return { csvData, isLoading, error, progress, parseCSV, clearData, loadTestCSV };
}
