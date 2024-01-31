import DOMPurify from 'isomorphic-dompurify';
import { chromium } from 'playwright';

export const htmlToPdf = async (htmlTemplate: string) => {
  const html = await htmlTemplate;

  if (!html) {
    throw new Error('Cannot convert blank html');
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(
    DOMPurify.sanitize(html, {
      FORCE_BODY: true,
      ALLOWED_ATTR: [
        'style',
        'class',
        'type',
        'href',
        'rel',
        'width',
        'fill',
        'transform',
        'height',
        'viewbox',
        'xmlns',
        'd',
        'charset',
        'content',
        'name',
        'src',
      ],
      ALLOWED_TAGS: ['div', 'svg', 'g', 'path', 'span', 'defs', 'clipPath', 'rect', 'style', 'link', 'meta', 'img'],
    }),
    { waitUntil: 'domcontentloaded' }
  );

  // https://pptr.dev/api/puppeteer.pdfoptions/
  const pdf = await page.pdf({
    printBackground: true,
    width: '612px',
    height: '792px',
  });

  browser.close();

  return pdf;
};
