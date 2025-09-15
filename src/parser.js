// logica para gerar excel
//  Ler Excel e transformar linhas em array de objetos

// src/parser.js
import ExcelJS from "exceljs";

/**
 * Recebe um Buffer (upload via web) e retorna array de objetos.
 */
export async function parseExcelBuffer(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer); // lê do buffer
  return parseWorkbook(workbook);
}

/**
 * Lê do disco (CLI)
 */
export async function parseExcelFile(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return parseWorkbook(workbook);
}

function parseWorkbook(workbook) {
  const rows = [];
  workbook.eachSheet((sheet) => {
    let headers = [];
    sheet.eachRow((row, rowNumber) => {
      const values = row.values.slice(1); // ExcelJS tem undefined na posição 0
      if (rowNumber === 1) {
        headers = values.map((h) => String(h ?? "").trim());
      } else {
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] !== undefined ? values[i] : null;
        });
        rows.push(obj);
      }
    });
  });
  return rows;
}
