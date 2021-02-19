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
    console.log('beginTransaction');
    console.log('end row count:', await DBReader.getRowCount());
    console.log('dates:', await DBReader.getUniqDataList());
    const date = '2021-02-18';
    /*TODO не работает getRowsByDate rows: undefined*/
    console.log('rows:', await DBReader.getRowsByDate(date));
    console.log('End of transaction')
  } catch (e) {
    console.log(e)
  }
  console.log('event-log-reader stopped');
})()