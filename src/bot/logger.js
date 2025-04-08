import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Logs a message to a file in the "logs" folder.
 * The log file is named "logs {date}.txt".
 * @param {string} message - The message to log.
 */
export function logWrite(message) {
    const logsDir = path.join(__dirname, "logs");
    const date = new Date().toISOString().split("T")[0];
    const logFileName = `logs ${date}.txt`;
    const logFilePath = path.join(logsDir, logFileName);

    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    const timeUTC = getUTCDate();
    const logEntry = `[${timeUTC}] ${message}\n`;
    fs.appendFileSync(logFilePath, logEntry, "utf8");
}

export function logRead() {
    const logsDir = path.join(__dirname, "logs");
    const date = new Date().toISOString().split("T")[0];
    const logFileName = `logs ${date}.txt`;
    const logFilePath = path.join(logsDir, logFileName);
    return fs.readFileSync(logFilePath, "utf8");
}

export function getUTCDate() {
    const date = new Date();
    const HH = String(date.getUTCHours()).padStart(2, "0");
    const MM = String(date.getUTCMinutes()).padStart(2, "0");
    const SS = String(date.getUTCSeconds()).padStart(2, "0");
    const YYYY = date.getUTCFullYear();
    const MM2 = String(date.getUTCMonth() + 1).padStart(2, "0");
    const DD = String(date.getUTCDate()).padStart(2, "0");
    const formattedDate = `${YYYY}-${MM2}-${DD} ${HH}:${MM}:${SS}`;
    return `${formattedDate} (UTC)`;
}