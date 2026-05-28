export interface CSVRow {
  [key: string]: string;
}

export interface CSVData {
  headers: string[];
  rows: CSVRow[];
  fileName: string;
  fileSize: number;
  totalRows: number;
}

export interface FilterCondition {
  id: string;
  field: string;
  value: string;
}
