export interface iDB {
  getUniqDataList(): Promise<any>;
  getRowsByDate(date: string): Promise<any>;
}