import Database from 'better-sqlite3';
import * as fs from "node:fs";
import path from "node:path";


const dbPath = process.env.DATABASE_PATH || path.resolve('shelf.sqlite');
const backupDir = path.resolve('../../backups');

// 1. Ensure the backups folder exists (already in your .gitignore)
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
    console.error(`Database file not found at: ${dbPath}`);
    process.exit(1);
}


// 2. Format a safe timestamp: YYYY-MM-DD_HH-mm-ss
const now = new Date();
const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
const backupFile = path.join(backupDir, `shelf-backup-${timestamp}.sqlite`);

try {
    const db = new Database(dbPath);

    // 3. Atomically snapshot and compact the database
    db.prepare('VACUUM INTO ?').run(backupFile);
    db.close();

    const stats = fs.statSync(backupFile);
    console.log(`Database backup created successfully!`);
    console.log(`Location: ${backupFile}`);
    console.log(`Size: ${(stats.size / 1024).toFixed(2)} KB`);
} catch (error) {
    console.error(`Backup Failed:`, error.message);
    process.exit(1);
}

