/**
 * NestBudget — the program that hands the site in.
 *
 * The site itself is this directory's app/ folder: plain static
 * files (ES modules, one stylesheet, no build step) whose content
 * lives in their own files and loads nothing over the network.
 *
 * Running this program copies app/ and screenshots/ into the
 * output directory and writes dossier.json there — the summary
 * the judge reads — using make.fun's vendored frontend library.
 * vendor/makefun-frontend.ts is left exactly as the kit ships it:
 * the scorer rebuilds the dossier with its own copy of the same
 * file and requires the two to match byte for byte.
 *
 * Outside the grader's container, MAKEFUN_OUTPUT_DIR names the
 * output directory:
 *
 *   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
 */

import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildDossier } from "./vendor/makefun-frontend.ts";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The caps the kit's starter passes to buildDossier for this
// harness — the platform's own limits for the dossier.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function handIn(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  cpSync(join(ROOT, "app"), join(OUTPUT_DIR, "app"), { recursive: true });
  cpSync(join(ROOT, "screenshots"), join(OUTPUT_DIR, "screenshots"), {
    recursive: true,
  });
  const dossier = buildDossier(OUTPUT_DIR, DOSSIER_CAPS);
  writeFileSync(join(OUTPUT_DIR, "dossier.json"), dossier);
}

handIn();
