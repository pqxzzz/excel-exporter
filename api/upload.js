// api/upload.js (Vercel / Next-style)
// instalar: npm i formidable
import formidable from "formidable";
import fs from "fs";
import { parseExcelBuffer } from "../src/parser.js";
import { exportToExcelBuffer } from "../src/exporter.js";

// Em Next.js API routes você precisa desativar o bodyParser — se estiver usando Next.
// export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro no upload");
    }
    // files.file.path (no formidable up-to-date pode ser file.filepath)
    const file = files.file;
    const buffer = await fs.promises.readFile(file.filepath || file.path);
    const rows = await parseExcelBuffer(buffer);
    const outBuffer = await exportToExcelBuffer(rows);

    res.setHeader("Content-Disposition", 'attachment; filename="saida.xlsx"');
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.status(200).send(outBuffer);
  });
}
