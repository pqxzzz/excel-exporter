// logica par aler/processar a lista
// Criar Excel de saída a partir do array de objetos

// src/exporter.js
import ExcelJS from "exceljs";
import fs from "fs";

export async function exportToExcelBuffer(data = []) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Resultados");

  if (!data || data.length === 0) {
    sheet.addRow(["No data"]);
    return workbook.xlsx.writeBuffer();
  }

  const headers = Object.keys(data[0]);
  sheet.addRow(headers);

  // adicionar linhas na ordem dos headers
  data.forEach((item) => {
    sheet.addRow(headers.map((h) => item[h]));
  });

  // opcional: col widths automáticas simples
  sheet.columns = headers.map((h) => ({
    header: h,
    width: Math.max(10, Math.min(40, String(h).length + 8))
  }));

  // retorna um Buffer (pronto pra enviar ao browser)
  return workbook.xlsx.writeBuffer();
}

export async function exportToExcelFile(data, filePath) {
  const buffer = await exportToExcelBuffer(data);
  await fs.promises.writeFile(filePath, buffer);
}
