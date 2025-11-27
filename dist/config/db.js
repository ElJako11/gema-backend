"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.DB = void 0;
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
class DB {
    constructor() {
        this.ssl = process.env.SSL === 'true' ? true : false;
        this.databaseUrl = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGSERVER}:${process.env.PGPORT}/${process.env.PGNAME}${this.ssl ? '?ssl=true' : ''}`;
        this.pool = new pg_1.Pool({
            connectionString: this.databaseUrl,
            ssl: this.ssl,
        });
        this.db = (0, node_postgres_1.drizzle)({ client: this.pool });
    }
    static getInstance() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        else {
            console.log('Ya la instancia ha sido creada');
        }
        return DB.instance;
    }
    static getDB() {
        return DB.getInstance().db;
    }
    static getPool() {
        return DB.getInstance().pool;
    }
}
exports.DB = DB;
exports.db = DB.getDB();
