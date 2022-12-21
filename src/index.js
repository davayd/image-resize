import { parse, extname, join } from "path";
import { readdirSync } from "fs";

import {
  dirName,
  inputDirPath,
  rimrafPhotosPath,
  rimrafComponentFilePath,
  componenentDataFile,
  transliterateDirName,
  mode,
} from "./constants";
import {
  appendFileAsyc,
  mkdirAsync,
  rimrafAsync,
  gmResizeAsync,
  gmReadSizeAsyc,
  formatPhotoInfo,
} from "./utils";

const filenames = readdirSync(inputDirPath)
  .filter((file) => {
    if (extname(file) === ".jpg") {
      return true;
    }
  })
  .sort((a, b) => {
    return Number(parse(a).name) - Number(parse(b).name);
  });

(async function () {
  await rimrafAsync(rimrafPhotosPath);
  await rimrafAsync(rimrafComponentFilePath);

  await mkdirAsync(exactOutputDir);

  await appendFileAsyc(
    componenentDataFile,
    `
    import { PhotographySession, RetouchSession, PhotoItem, ImageMode } from "models/session";

    export function generateSession(imageMode: ImageMode) {
      const title: string = '${dirName}';
      const transliteratedUrl: string = '${transliterateDirName}'
      const photos: ${
        mode === "photo" ? "PhotoItem[]" : "[PhotoItem, PhotoItem][]"
      } = [`
  );

  for (const [index, fileName] of filenames.entries()) {
    if (mode === "retouch" && index % 2 === 0) {
      await appendFileAsyc(componenentDataFile, `[`);
    }

    const { ext: extName, name: onlyFileName } = parse(fileName);
    console.log(onlyFileName, extName);

    const imgPath = join(inputDirPath, `${onlyFileName}${extName}`);
    const forComponentFilename = `${onlyFileName}-\${imageMode}${targetExt}`;

    // mobile
    const mobileFileName = `${onlyFileName}-mobile${targetExt}`;
    const mobileOutputPath = join(exactOutputDir, mobileFileName);

    // desktop
    const desktopFileName = `${onlyFileName}-desktop${targetExt}`;
    const desktopOutputPath = join(exactOutputDir, desktopFileName);

    // resize
    await gmResizeAsync(imgPath, mobileSize, mobileOutputPath);
    const mobileFileSize = await gmReadSizeAsyc(mobileOutputPath);

    await gmResizeAsync(imgPath, desktopSize, desktopOutputPath);
    const desktopFileSize = await gmReadSizeAsyc(desktopOutputPath);

    const photoInfo = formatPhotoInfo(
      dirName,
      forComponentFilename,
      mobileFileSize,
      desktopFileSize
    );
    await appendFileAsyc(componenentDataFile, photoInfo);

    if (mode === "retouch" && index % 2 === 1) {
      await appendFileAsyc(componenentDataFile, `],`);
    }
  }

  await appendFileAsyc(componenentDataFile, `\n];\n`);
  await appendFileAsyc(
    componenentDataFile,
    `

    return new ${
      mode === "photo" ? "PhotographySession" : "RetouchSession"
    }(title, transliteratedUrl, photos);
  }
  `
  );
})();
