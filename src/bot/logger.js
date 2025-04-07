import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Logs a message to a file in the "logs" folder.
 * The log file is named "logs {date}.txt".
 * @param {string} message - The message to log.
 */
export function logWrite(message) {
    const logsDir = path.join(__dirname, 'logs');
    const date = new Date().toISOString().split('T')[0];
    const logFileName = `logs ${date}.txt`;
    const logFilePath = path.join(logsDir, logFileName);

    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    const time = new Date();
    const logEntry = `[${time}] ${message}\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
}

export function logRead() {
    const logsDir = path.join(__dirname, 'logs');
    const date = new Date().toISOString().split('T')[0];
    const logFileName = `logs ${date}.txt`;
    const logFilePath = path.join(logsDir, logFileName);

    if (!fs.existsSync(logFilePath)) {
        return 'No logs available for today.';
    }

    return fs.readFileSync(logFilePath, 'utf8');
}