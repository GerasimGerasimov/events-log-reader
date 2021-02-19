import { IEvent } from "./iDBEvent";
import TDAO from "./controllers/sqlite/DAO";
import EventsRepositoty from "./controllers/sqlite/EventsRepository";

export class TDBReader {
  
  private dao: TDAO;
  private eventsRepo: EventsRepositoty;
  private connected: boolean = false;

  constructor() {
    this.dao = new TDAO('./db/database.sqlite3');
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

  public async getUniqDataList(): Promise<any>{
    return await this.eventsRepo.getUniqDataList()
  }

  public async getRowsByDate(date: string): Promise<any>{
    return await this.eventsRepo.getRowsByDate(date)
  }

  public async beginTransaction(){
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