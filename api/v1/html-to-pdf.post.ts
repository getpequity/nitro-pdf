import fs from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { htmlToPdf } from '../../helpers/htmlToPdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default eventHandler(async (event) => {
  const body = await readBody(event);

  const html = body.html || '';
  const name = body.name || 'test';

  const pdf = await htmlToPdf(html);

  const pdfFilePath = resolve(join(__dirname, `../../${name}.pdf`));

  await fs.promises.writeFile(pdfFilePath, pdf);

  return { message: 'Ok' };
});
