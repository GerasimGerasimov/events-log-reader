import TDAO from "./DAO";
import { IEvent } from "./EventsSourceToMap";

export default class EventsRepositoty {
  private dao: TDAO;
  
  constructor( dao: TDAO) {
    this.dao = dao;
  }

  public createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      type TEXT,
      tag TEXT,
      details TEXT)`
    return this.dao.run(sql)
  }

  public create(event: IEvent/*date: string, type: string, details: string*/) {
    const {date, type, tag, details} = {... event}
    const detailsJSON: string = JSON.stringify(details)
    return this.dao.run(
      'INSERT INTO events (date, type, tag, details) VALUES (?, ?, ?, ?)',
      [date, type, tag, detailsJSON]
    )
  }

  public async getByID(id: any): Promise<any> {
    return await this.dao.get(
      `SELECT * FROM events WHERE id = ?`,
      [id]
    )
  }

  public async getRowCount(): Promise<any> {
    return await this.dao.get(
      `SELECT COUNT(*) FROM events`
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