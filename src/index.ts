console.log('event-log-reader started');
import fs = require('fs');

import { getConfigFile } from './helpers/utils';
import { HttpServer } from './server/httpserver';
import { TDBReader } from './db/dbreader';

const settings = JSON.parse(fs.readFileSync(getConfigFile(), 'utf8'));
const DBReader = new TDBReader(settings.path);
const Server: HttpServer = new HttpServer(settings.HOST.port, DBReader);