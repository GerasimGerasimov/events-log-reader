import { IEvent } from "../../iDBEvent";
import TDAO from "./DAO";
import { EventScheme } from "./dbscheme";

export default class EventsRepositoty {
  private dao: TDAO;
  
  constructor( dao: TDAO) {
    this.dao = dao;
  }

  public createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS events (
      ${EventScheme})`
    return this.dao.run(sql)
  }

  public create(event: IEvent) {
    const {utime, date, type, trig, tag, details} = {... event}
    const detailsJSON: string = JSON.stringify(details)
    return this.dao.run(
      'INSERT INTO events (utime, date, type, trig, tag, details) VALUES (?, ?, ?, ?, ?, ?)',
      [utime, date, type, trig, tag, detailsJSON]
    )
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
    return await this.dao.get(
      `SELECT DISTINCT date(datetime(utime/1000, 'unixepoch','localtime')) AS dates
      FROM events
      ORDER BY utime`
    )
  }

  public async getRowsByDate(date: string): Promise<any> {
    return await this.dao.get(
      `SELECT *
      FROM events
      WHERE date(datetime(utime/1000, 'unixepoch','localtime')) = ${date}`
    )
  }
}


  /*
  public update(id: number, date: string, details: string) {
    return this.dao.run(
      'UPDATE events SET date = ?, details = ? WHERE id = ?',
      [date, details, id]
    )
  }
  */
 /*
  public delete(id: number) {
    return this.dao.run(
      'DELETE FROM events WHERE id = ?',
      [id]
    )
  }
  */