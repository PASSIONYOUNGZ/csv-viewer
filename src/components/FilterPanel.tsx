import { useState } from 'react';
import { FilterCondition } from '../types';

interface FilterPanelProps {
  headers: string[];
  filters: FilterCondition[];
  onAdd: (field: string, value: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function FilterPanel({ headers, filters, onAdd, onRemove, onClear }: FilterPanelProps) {
  const [field, setField] = useState(headers[0] ?? '');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (field && value.trim()) {
      onAdd(field, value);
      setValue('');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {headers.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="输入筛选关键词..."
          className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          disabled={!value.trim()}
          className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          添加筛选
        </button>
        {filters.length > 0 && (
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            清除全部
          </button>
        )}
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <span
              key={f.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
            >
              <span className="font-medium">{f.field}:</span>
              <span>{f.value}</span>
              <button
                onClick={() => onRemove(f.id)}
                className="ml-1 text-blue-400 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
