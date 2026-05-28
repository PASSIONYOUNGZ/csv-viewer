import { CSVRow } from '../types';

export function buildCSV(headers: string[], rows: CSVRow[]): string {
  const headerLine = headers.map(h => escapeField(h)).join(',');
  const dataLines = rows.map(row =>
    headers.map(h => escapeField(row[h] ?? '')).join(',')
  );
  return [headerLine, ...dataLines].join('\n');
}

function escapeField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCSV(content: string, filename: string) {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function computeHash(csvContent: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const worker = new Worker(
        new URL('./hashWorker.ts', import.meta.url),
        { type: 'module' }
      );
      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };
      worker.onerror = (e) => {
        reject(e.message);
        worker.terminate();
      };
      worker.postMessage(csvContent);
    } catch (err) {
      reject(err);
    }
  });
}
