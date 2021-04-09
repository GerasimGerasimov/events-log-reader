import { IEvent } from "./iDBEvent";
import TDAO from "./controllers/sqlite/DAO";
import EventsRepositoty from "./controllers/sqlite/EventsRepository";
import { iDB } from "./idb";
import { delay } from "../helpers/utils";

export class TDBReader implements iDB {
  
  private dao: TDAO;
  private eventsRepo: EventsRepositoty;
  private connected: boolean = false;

  constructor(path: string) {
    this.dao = new TDAO(path);
    this.eventsRepo = new EventsRepositoty(this.dao);
  }

  private async connectToDB(){
    console.log('start to create table')
    await this.eventsRepo.createTable();
    console.log('table is created')
    console.log('start row count:', await this.eventsRepo.getRowCount())
    this.connected = true;
  }

  public async write(values: Set<IEvent>){
    if (values.size != 0) {
      if (this.isConnected) {
        try {
          await this.dao.run('BEGIN TRANSACTION');
          for (const value of values) {
            console.log(`create record: ${value.date}, ${value.tag}`)
            await this.eventsRepo.create(value)
          }
        } catch(e) {
          console.log('DB Error :', e)
        }
        await this.dao.run('COMMIT TRANSACTION');
        console.log('end row count:', await this.eventsRepo.getRowCount())
      } else {
          await this.connectToDB();
          return;
      }
    }
  }

  public async getUniqDataList(): Promise<any> {
    await delay(1000);//имитация тормозов
    const res : Array<string> = [];
    const dates =  await this.eventsRepo.getUniqDataList();
    dates.forEach((items: any) => {
      const values: Array<any> = Object.values(items);
      const data: string = values[0] || '';
      if (data) {
        res.push(data)
      }
    });
    return res;
  }

  public async getRowsByDate(date: string): Promise<any>{
    await delay(0);//имитация тормозов
    return await this.eventsRepo.getRowsByDate(date);
  }

  public async beginTransaction() {
    await this.dao.run('BEGIN TRANSACTION');
  }

  public async commitTransaction(){
    await this.dao.run('COMMIT TRANSACTION');
  }

  public async getRowCount(): Promise<number> {
    return await this.eventsRepo.getRowCount()
  }

  public async getMaxUTimeRow(): Promise<string> {
    return await this.eventsRepo.getMaxUTimeRow()
  }

  public async getMinUTimeRow(): Promise<string> {
    return await this.eventsRepo.getMinUTimeRow()
  }

  private get isConnected(): boolean {
    return this.connected;
  }
}