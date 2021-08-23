import http = require('http');
import express = require("express");
import cors = require("cors");
import bodyParser = require('body-parser');
import { iDB } from '../db/idb';

const app = express();
const jsonParser = bodyParser.json()

export class HttpServer{
    public https: any;

    private port: number;
    private db  : iDB;
    
    constructor (port: number, db: iDB) {
        this.port = port;
        this.db = db;
        this.init();
    }

    private init () {
        app.use(cors());

        app.route('/v1/dates/')
            .get(jsonParser, [this.getDates.bind(this)])
        app.route('/v1/events/:id')
            .get(jsonParser, [this.getDateEvents.bind(this)])
        
        this.https = http.createServer(app).listen(this.port);
        console.log('events-log-reader server started at port: ', this.port);
    }

    private async getDates (request: any, response: any) {
        console.log('/v1/dates/>');
        try {
            response.json(await this.db.getUniqDataList());
        } catch (e) {
            response.status(400).json({status:'Error',
                                        msg: e.message || ''})
        }
    }

    private async getDateEvents (request: any, response: any) {
        console.log(`/v1/events/> ${request.params.id || ''}`);
        try {
            const date = `${request.params.id || ''}`;
            response.json(await this.db.getRowsByDate(date));
        } catch (e) {
            response.status(400).json({status:'Error',
                                        msg: e.message || ''})
        }
    }
}