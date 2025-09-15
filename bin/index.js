#!/usr/bin/env node
// arquivo principal - user chama
// CLI: argumentos, mensagens, chamar funções do src

import ExcelJs from "exceljs";
import path from "path";
import fs from "fs";
import { parseExcelFile } from "../src/parser.js";
import { exportToExcelFile } from "../src/exporter.js";
import { fileURLToPath } from "url";

import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("❌ Por favor, passe o caminho de um arquivo ou texto");
  process.exit(1);
}

const desktopPath = path.join(os.homedir(), "Desktop");
const inputPath = path.resolve(args[0]);

const baseName = args[1] || "excel_anna";

const now = new Date();

const day = String(now.getDate()).padStart(2, "0"); // DIA
const month = String(now.getMonth() + 1).padStart(2, "0"); // MÊS (0-11, por isso +1)
const year = now.getFullYear(); // ANO
const hours = String(now.getHours()).padStart(2, "0"); // HORA
const minutes = String(now.getMinutes()).padStart(2, "0"); // MINUTO

const dateTimeString = `${day}_${month}_${year}_${hours}_${minutes}`;

// Nome final do arquivo
const fileName = `${baseName}_${dateTimeString}.xlsx`;

const outputPath = path.join(desktopPath, fileName);

(async () => {
  try {
    const data = await parseExcelFile(inputPath);

    await exportToExcelFile(data, outputPath);
  } catch (err) {
    console.log(err);
    console.error("❌ Erro ao ler o arquivo Excel:", err.message);
    process.exit(1);
  }
})();
