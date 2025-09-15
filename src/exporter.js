// logica par aler/processar a lista
// Criar Excel de saída a partir do array de objetos

import ExcelJS from "exceljs";

export async function exportToExcel(data, outputPath) {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Results");

  if (data.length === 0) return;

  sheet.addRow(Object.keys(data[0])); //headers
  data.forEach((obj) => sheet.addRow(Object.values(obj))); // linhas

  await workbook.xlsx.writeFile(outputPath);
}
