import fs from "fs/promises";
import { chromium } from "playwright";
import pLimit from "p-limit";

const [, , urlsFile] = process.argv;
if (!urlsFile) {
  console.error("Usage: npm start -- <path-to-urls-file>");
  process.exit(1);
}

const raw = await fs.readFile(urlsFile, "utf-8");
const urls = raw.trim().split(/\r?\n/);

const browser = await chromium.launch({ headless: true });
const limit = pLimit(20);

await Promise.all(
  urls.map((url) =>
    limit(async () => {
      const page = await browser.newPage();
      const errors = [];
      page.on(
        "console",
        (msg) => msg.type() === "error" && errors.push(msg.text()),
      );

      try {
        await page.goto(url, { timeout: 60_000 });
        await page.waitForLoadState("load", { timeout: 60_000 });
      } catch (e) {
        console.log(`[LOAD FAILED] ${url} → ${e.message}`);
        await page.close();
        return;
      }

      if (errors.length) {
        console.log(`[JS ERRORS] ${url}`);
        for (const e of errors) console.log("   •", e);
      } else {
        console.log(`[OK]        ${url} (no JS errors)`);
      }
      await page.close();
    }),
  ),
);

await browser.close();
