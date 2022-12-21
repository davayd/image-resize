import rimraf from "rimraf";
import pkg from "gm";
const gm = pkg.subClass({ imageMagick: true });
import { mkdir, appendFile } from "fs";

export function transliterator(value) {
  return value.replace(" ", "-").replace(", ", "-");
}

export function appendFileAsyc(source, data) {
  return new Promise((resolve, reject) => {
    appendFile(source, data, { encoding: "utf8" }, (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

export function mkdirAsync(dirName) {
  return new Promise((resolve, reject) => {
    mkdir(
      dirName,
      {
        recursive: true,
      },
      (err, path) => {
        if (err) {
          reject(err);
        }
        resolve(path);
      }
    );
  });
}

export function rimrafAsync(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

export function gmResizeAsync(imgPath, mobileSize, path) {
  return new Promise((resolve, reject) => {
    gm(imgPath)
      .resize(mobileSize)
      .quality(quality)
      .write(path, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
  });
}

export function gmReadSizeAsyc(path) {
  return new Promise((resolve, reject) => {
    gm(path).size((err, size) => {
      if (err) {
        reject(err);
      }
      resolve(size);
    });
  });
}

export function formatPhotoInfo(
  dirName,
  fileNameTypescript,
  mobileSize,
  desktopSize
) {
  return `{
        url: \`/assets/photos/${dirName}/${fileNameTypescript}\`,
        sizes: {
            mobile: { width: ${mobileSize.width}, height: ${
    mobileSize.height
  } },
            desktop: { width: ${desktopSize.width}, height: ${
    desktopSize.height
  } }
        },
        label: \`${fileNameTypescript}\`,
        ${dirName === "main" ? `sessionRoute: \`${transliterator()}\`` : ""}
    },`;
}
