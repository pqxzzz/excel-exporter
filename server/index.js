// server/index.js
import express from "express";
import multer from "multer";
import path from "path";
import { parseExcelBuffer } from "../src/parser.js";
import { exportToExcelBuffer } from "../src/exporter.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// serve arquivos estáticos (public/index.html)
app.use(express.static(path.join(process.cwd(), "public")));

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("Nenhum arquivo enviado");
    const rows = await parseExcelBuffer(req.file.buffer);

    // exemplo de transformação: aqui você pode filtrar/agrupar/mapear
    const outBuffer = await exportToExcelBuffer(rows);

    res.setHeader("Content-Disposition", 'attachment; filename="saida.xlsx"');
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(outBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao processar o arquivo");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Servidor local rodando: http://localhost:${port}`)
);
