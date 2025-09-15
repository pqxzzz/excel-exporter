// api/upload.js (Vercel / Next-style)
// instalar: npm i formidable
// api/upload.js
import formidable from "formidable";
import { parseExcelBuffer } from "../../src/parser.js";
import { exportToExcelBuffer } from "../../src/exporter.js";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).send("Método não permitido");

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Erro no parse do formulário");

    try {
      const file = files.file; // name="file"
      const buffer = await file.toBuffer(); // <-- funciona na v2

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
