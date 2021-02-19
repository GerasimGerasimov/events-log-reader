console.log('event-log-reader started');
import fs = require('fs');

//import { getConfigFile } from './helpers/utils';
//import { HttpServer } from './server/httpserver';
import { TDBReader } from './db/dbreader';

//const settings = JSON.parse(fs.readFileSync(getConfigFile(), 'utf8'));
//const Server: HttpServer = new HttpServer(settings.HOST.port);
const DBReader = new TDBReader();

(async () => {
  try {
    await DBReader.beginTransaction();
    console.log('end row count:', await DBReader.getRowCount());
    console.log('max utime:', await DBReader.getMaxUTimeRow());
    console.log('min utime:', await DBReader.getMinUTimeRow());
    await DBReader.commitTransaction();
  } catch (e) {
    console.log(e)
  }
  console.log('event-log-reader stopped');
})()