// logica para gerar excel
//  Ler Excel e transformar linhas em array de objetos

import ExcelJS from "exceljs";

export async function parseExcel(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  let result = [];

  workbook.eachSheet((sheet) => {
    let headers = [];

    sheet.eachRow((row, rowNumber) => {
      const rowValues = row.values.slice(1);

      if (rowNumber === 1) headers = rowValues;
      else {
        let obj = {};
        headers.forEach((header, i) => (obj[header] = rowValues[i]));
        result.push(obj);
      }
    });
  });

  return result;
}
