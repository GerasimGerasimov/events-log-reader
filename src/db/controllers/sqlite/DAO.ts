import sqlite3 = require('sqlite3')

export default class TDAO {
  private db: sqlite3.Database;
  private connected: boolean = false;
  
  constructor(dbFilePath: string) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('Could not connect to database', err);
        this.connected = false;
      } else {
        console.log('Connect to database');
        this.connected = true;
      }
    })
  }

  public async run(sql: string, params:Array<any> = []): Promise<any>{
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err)=>{
        if (err) {
          console.log('Error runnig sql' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve('SQL request normaly completed' + sql);
        }
      })
    })

  }

  public async get(sql: string, params: Array<any> = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result)=>{
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      })
    })
  }

  public all(sql: string, params: Array<any> = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log('Error running sql: '+ sql);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }

  public get isConnected(): boolean {
    return this.connected;
  }
}