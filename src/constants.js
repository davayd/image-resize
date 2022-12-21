import { join, normalize, dirname } from "path";
import { transliterator } from "./utils.js";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const retouchSessionMap = {
  1: "beauty",
  2: "commercial",
  3: "course",
};

export const photoSessionMap = {
  Ayna: "Ayna 08.2022, St.Petersburg",
  Olya: "Olya 08.22, St.Petersburg",
  Polina1: "Polina 1 08.2022, St.Petersburg",
  Polina2: "Polina 2 08.2022, St.Petersburg",
  RealPeople: "Real People 2021, Minsk",
  Main: "main",
  Other: "other",
  PolinaStudio1: "Polina.Studio, part. 1",
  PolinaStudio2: "Polina.Studio, part. 2",
  Anastasia: "Anastasia 12.2022. Model test",
  Miron: "Miron 12.2022. Model test",
};

export let parentDir;
export const mode = "photo"; /* retouch | photo */

if (mode === "photo") {
  parentDir = "портфолио фото";
} else if (mode === "retouch") {
  parentDir = "портфолио ретушь";
}

export const dirName = photoSessionMap.Main;

export const targetExt = ".webp";

export const dirPath = normalize(
  "C:/Users/Dmitry Dreko/Downloads/файлы для сайта-20220706T194712Z-001/файлы для сайта"
);

export const inputDirPath = join(dirPath, parentDir, dirName);

export const outputDir = normalize(
  "C:/Users/Dmitry Dreko/Documents/Projects/ritamazura-website-ng/src/assets/photos"
);

export const rimrafPhotosPath = join(outputDir, `${dirName}/*.*`);
export const exactOutputDir = join(outputDir, dirName);
export const rimrafComponentFilePath = join(
  __dirname,
  "./../output",
  `${dirName}/*.*`
);
export const componenentDataFile = join(exactOutputDir, "data.ts");
export const sitemapPath = join(outputDir, "sitemap.ts");
export const teamMembersPath = join(outputDir, "teamMembers.ts");

export const transliterateDirName = transliterator(dirName);

export const quality = 95;
export const mobileSize = 500;
export const desktopSize = 1000;
