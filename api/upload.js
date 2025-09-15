// api/upload.js (Vercel / Next-style)
// instalar: npm i formidable
// api/upload.js
import formidable from "formidable";
import fs from "fs";
import { parseExcelBuffer } from "../src/parser.js";
import { exportToExcelBuffer } from "../src/exporter.js";

// Vercel precisa desabilitar bodyParser padrão (caso esteja usando Next.js)
export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método não permitido");
  }

  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Erro no parse");

    try {
      const file = files.file; // name="file" do input
      const buffer = await file.toBuffer(); //

      const data = await parseExcelBuffer(buffer);
      const outBuffer = await exportToExcelBuffer(data);

      res.setHeader("Content-Disposition", 'attachment; filename="saida.xlsx"');
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(outBuffer);
    } catch (e) {
      console.error(e);
      res.status(500).send("Erro no processamento do Excel");
    }
  });
}
