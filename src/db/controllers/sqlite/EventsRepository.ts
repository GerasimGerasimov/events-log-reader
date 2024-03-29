import { IEvent } from "../../iDBEvent";
import TDAO from "./DAO";
import { EventScheme } from "./dbscheme";

export default class EventsRepositoty {
  private dao: TDAO;
  
  constructor( dao: TDAO) {
    this.dao = dao;
  }

  public async getByID(id: any): Promise<any> {
    return await this.dao.get(
      `SELECT * FROM events WHERE id = ?`,
      [id]
    )
  }

  public async getRowCount(): Promise<number> {
    return await this.dao.get(
      `SELECT COUNT(*) FROM events`
    )
  }

  public async getMaxUTimeRow(): Promise<string> {
    return await this.dao.get(
      `SELECT *, max(utime) FROM events`
    )
  }

  public async getMinUTimeRow(): Promise<string> {
    return await this.dao.get(
      `SELECT *, min(utime) FROM events`
    )
  }

  public async getUniqDataList(): Promise<any> {
    return await this.dao.all(
      `SELECT DISTINCT date(datetime(utime/1000, 'unixepoch','localtime')) AS dates
      FROM events
      ORDER BY utime DESC`
    )
  }

  public async getRowsByDate(date: string): Promise<any> {
    return await this.dao.all(
      `SELECT *
      FROM events
      WHERE date(datetime(utime/1000, 'unixepoch','localtime')) = '${date}'`
    )
  }
}