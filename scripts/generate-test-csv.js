import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '..', 'public', 'test-csv');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const firstNames = ['张伟','王芳','李娜','刘洋','陈静','杨帆','赵磊','黄丽','周杰','吴敏',
  '郑涛','孙悦','钱龙','林雪','何平','郭峰','马燕','罗琳','梁辉','宋婷',
  '唐亮','韩冰','曹雨','邓杰','许晴','彭磊','苏梅','潘婷','田浩','董洁',
  '叶青','余波','夏雪','方凯','石磊','白露','龙飞','万芳','苗苗','姜涛'];
const domains = ['qq.com','163.com','gmail.com','outlook.com','company.cn'];
const cities = ['北京','上海','广州','深圳','杭州','成都','武汉','南京','重庆','西安'];
const departments = ['技术部','市场部','财务部','人事部','运营部','产品部','销售部'];
const positions = ['工程师','经理','主管','专员','总监','助理','分析师','顾问'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randDate() {
  const y = randInt(2018, 2025);
  const m = String(randInt(1, 12)).padStart(2, '0');
  const d = String(randInt(1, 28)).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function randPhone() {
  const prefixes = ['138','139','150','151','152','186','187','188'];
  const suffix = String(randInt(10000000, 99999999));
  return rand(prefixes) + suffix;
}

function generateRows(count) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const name = rand(firstNames);
    rows.push({
      姓名: name,
      邮箱: `${name.toLowerCase()}${randInt(100,999)}@${rand(domains)}`,
      手机: randPhone(),
      城市: rand(cities),
      部门: rand(departments),
      职位: rand(positions),
      入职日期: randDate(),
      薪资: String(randInt(6000, 50000)),
      评分: (Math.random() * 5).toFixed(1),
    });
  }
  return rows;
}

function toCSV(headers, rows) {
  const headerLine = headers.join(',');
  const dataLines = rows.map(row =>
    headers.map(h => {
      const val = String(row[h] ?? '');
      return val.includes(',') ? `"${val}"` : val;
    }).join(',')
  );
  return [headerLine, ...dataLines].join('\n');
}

const headers = ['姓名','邮箱','手机','城市','部门','职位','入职日期','薪资','评分'];

console.log('Generating test CSV files...');

// Small: 20 rows
const small = generateRows(20);
fs.writeFileSync(path.join(outputDir, 'test_small.csv'), toCSV(headers, small), 'utf-8');
console.log(`  test_small.csv - 20 rows`);

// Medium: 5000 rows
const medium = generateRows(5000);
fs.writeFileSync(path.join(outputDir, 'test_medium.csv'), toCSV(headers, medium), 'utf-8');
console.log(`  test_medium.csv - 5,000 rows`);

// Large: 100,000 rows
const large = generateRows(100000);
fs.writeFileSync(path.join(outputDir, 'test_large.csv'), toCSV(headers, large), 'utf-8');
console.log(`  test_large.csv - 100,000 rows`);

console.log('Done!');
