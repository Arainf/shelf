import 'reflect-metadata';
import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'better-sqlite3',
    database: process.env.DATABASE_PATH || 'shelf.sqlite',
    synchronize: false,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    prepareDatabase: (db) => {
        db.pragma('foreign_keys = ON');
        db.pragma('journal_mode = WAL');
    },
});