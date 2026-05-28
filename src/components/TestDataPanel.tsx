interface TestDataPanelProps {
  onLoad: (url: string, label: string) => void;
}

const datasets = [
  {
    label: '测试数据 S（20行）',
    desc: '基础功能验证',
    url: '/test-csv/test_small.csv',
  },
  {
    label: '测试数据 M（5,000行）',
    desc: '中等规模性能',
    url: '/test-csv/test_medium.csv',
  },
  {
    label: '测试数据 L（100,000行）',
    desc: '大规模压力测试',
    url: '/test-csv/test_large.csv',
  },
];

export default function TestDataPanel({ onLoad }: TestDataPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-700 mb-3">快速加载测试数据</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {datasets.map(d => (
          <button
            key={d.url}
            onClick={() => onLoad(d.url, d.label)}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
          >
            <div className="text-sm font-medium text-gray-800">{d.label}</div>
            <div className="text-xs text-gray-400 mt-1">{d.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
