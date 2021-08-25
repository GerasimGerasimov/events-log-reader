import TDAO from "./controllers/sqlite/DAO";
import EventsRepositoty from "./controllers/sqlite/EventsRepository";
import { iDB } from "./idb";
//import { delay } from "../helpers/utils";

export class TDBReader implements iDB {
  
  private dao: TDAO;
  private eventsRepo: EventsRepositoty;
  

  constructor(path: string) {
    this.dao = new TDAO(path);
    this.eventsRepo = new EventsRepositoty(this.dao);
  }

  public async getUniqDataList(): Promise<any> {
    //await delay(1000);//имитация тормозов
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
    //await delay(0);//имитация тормозов
    return await this.eventsRepo.getRowsByDate(date);
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

  public get isConnected(): boolean {
    return this.dao.isConnected;
  }
}