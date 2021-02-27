console.log('event-log-reader started');
import fs = require('fs');

import { getConfigFile } from './helpers/utils';
import { HttpServer } from './server/httpserver';
import { TDBReader } from './db/dbreader';

const DBReader = new TDBReader();
const settings = JSON.parse(fs.readFileSync(getConfigFile(), 'utf8'));
const Server: HttpServer = new HttpServer(settings.HOST.port, DBReader);