import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIST_DIR = "dist";
const TOKEN = "_uLorccZIpY-NlRb036yMXgs2lvctMD5A_aSlU6HRa4";
const TARGET_META = `<meta name="google-site-verification" content="${TOKEN}">`;
const META_REGEX = /<meta\b[^>]*\bname=(?:"|')?google-site-verification(?:"|')?[^>]*>/gi;

async function getHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) return getHtmlFiles(fullPath);
      if (entry.isFile() && fullPath.endsWith(".html")) return [fullPath];
      return [];
    }),
  );
  return files.flat();
}

async function main() {
  const htmlFiles = await getHtmlFiles(DIST_DIR);

  await Promise.all(
    htmlFiles.map(async (filePath) => {
      const html = await readFile(filePath, "utf8");
      const updated = html.replace(META_REGEX, TARGET_META);
      if (updated !== html) {
        await writeFile(filePath, updated, "utf8");
      }
    }),
  );
}

await main();
