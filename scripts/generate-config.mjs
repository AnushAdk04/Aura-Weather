import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = resolve(process.cwd());
const envPath = resolve(rootDir, ".env");
const configPath = resolve(rootDir, "config.js");

const envContent = readFileSync(envPath, "utf-8");

const envMap = envContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .reduce((acc, line) => {
        const separatorIndex = line.indexOf("=");
        if (separatorIndex === -1) {
            return acc;
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        acc[key] = value;
        return acc;
    }, {});

const apiKey = envMap.OPENWEATHER_API_KEY || "";

const configContent = `window.APP_CONFIG = {
  OPENWEATHER_API_KEY: "${apiKey.replace(/"/g, '\\"')}"
};\n`;

writeFileSync(configPath, configContent, "utf-8");
console.log("Generated config.js from .env");
