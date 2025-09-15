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
    if (err) {
      console.error("Erro no parse:", err);
      return res.status(500).send("Erro ao processar upload");
    }

    try {
      // pega o arquivo enviado (input name="file")
      const file = files.file;
      const buffer = await fs.promises.readFile(file.filepath);

      // processa com sua lógica
      const data = await parseExcelBuffer(buffer);
      const outBuffer = await exportToExcelBuffer(data);

      // envia arquivo para download
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
