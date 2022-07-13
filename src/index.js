const path = require('path');
const rimraf = require('rimraf');
var fs = require('fs')
  , gm = require('gm').subClass({ imageMagick: true });

const mode = 'retouch' /* retouch | photo */;

let parentDir;
if (mode === 'photo') {
  parentDir = 'портфолио фото';
} else if (mode === 'retouch') {
  parentDir = 'портфолио ретушь';
}

const retouchSessionMap = {
  1: 'beauty',
  2: 'commercial',
  3: 'course',
}

const photoSessionMap = {
  1: 'masha 2021, Minsk',
  2: 'alyona 2021, Minsk',
  3: 'anya 2021, Minsk',
  4: 'katya 2022, Saint-Petersburb',
  5: 'nastya 2021, Grodno'
}
const dirName = retouchSessionMap[3];

const targetExt = '.webp';

const dirPath = path.normalize('C:/Users/Dmitry Dreko/Downloads/файлы для сайта-20220706T194712Z-001/файлы для сайта')
const inputDirPath = path.join(dirPath, parentDir, dirName);
const outputDir = path.normalize('C:/Users/Dmitry Dreko/Documents/Projects/ritamazura-website-ng/src/assets/photos')
const filenames = fs.readdirSync(inputDirPath);
const rimrafPhotosPath = path.join(outputDir, `${dirName}/*.*`);
const exactOutputDir = path.join(outputDir, dirName);
const rimrafComponentFilePath = path.join(__dirname, './../output', `${dirName}/*.*`)
const forComponent = path.join(exactOutputDir, 'data.ts');
const transliteratedDirName = dirName.replace(' ', '-').replace(', ', '-');

const quality = 95;
const mobileSize = 500;
const desktopSize = 1000;


(async function () {
  await rimrafAsync(rimrafPhotosPath);
  await rimrafAsync(rimrafComponentFilePath);

  await mkdirAsync(exactOutputDir);

  await appendFileAsyc(forComponent, `
    import { PhotographySession, RetouchSession, PhotoItem, ImageMode } from "models/session";

    export function generateSession(imageMode: ImageMode) {
      const title: string = '${dirName}';
      const transliteratedUrl: string = '${transliteratedDirName}'
      const photos: ${mode === 'photo' ? 'PhotoItem[]' : '[PhotoItem, PhotoItem][]'} = [`);

  for (const [index, fileName] of filenames.entries()) {

    if (mode === 'retouch' && index % 2 === 0) {
      await appendFileAsyc(forComponent, `[`);
    }

    const { ext: extName, name: onlyFileName } = path.parse(fileName);
    console.log(onlyFileName, extName);

    const imgPath = path.join(inputDirPath, `${onlyFileName}${extName}`);
    const forComponentFilename = `${onlyFileName}-\${imageMode}${targetExt}`;

    // mobile
    const mobileFileName = `${onlyFileName}-mobile${targetExt}`;
    const mobileOutputPath = path.join(exactOutputDir, mobileFileName);

    // desktop
    const desktopFileName = `${onlyFileName}-desktop${targetExt}`;
    const desktopOutputPath = path.join(exactOutputDir, desktopFileName);

    await gmResizeAsync(imgPath, mobileSize, mobileOutputPath);
    const mobileFileSize = await gmReadSizeAsyc(mobileOutputPath)

    await gmResizeAsync(imgPath, desktopSize, desktopOutputPath);
    const desktopFileSize = await gmReadSizeAsyc(desktopOutputPath)

    const photoInfo = formatPhotoInfo(dirName, forComponentFilename, mobileFileSize, desktopFileSize)
    await appendFileAsyc(forComponent, photoInfo)

    if (mode === 'retouch' && index % 2 === 1) {
      await appendFileAsyc(forComponent, `],`);
    }
  }

  await appendFileAsyc(forComponent, `\n];\n`);
  await appendFileAsyc(forComponent, `

    return new ${mode === 'photo' ? 'PhotographySession' : 'RetouchSession'}(title, transliteratedUrl, photos);
  }
  `);

})()



function gmResizeAsync(imgPath, mobileSize, path) {
  return new Promise((resolve, reject) => {
    gm(imgPath).resize(mobileSize).quality(quality).write(path, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    })
  })
}


function gmReadSizeAsyc(path) {
  return new Promise((resolve, reject) => {
    gm(path).size((err, size) => {
      if (err) {
        reject(err)
      }
      resolve(size)
    })
  })
}

function formatPhotoInfo(dirName, fileNameTypescript, mobileSize, desktopSize) {
  return `{
        url: \`/assets/photos/${dirName}/${fileNameTypescript}\`,
        sizes: {
            mobile: { width: ${mobileSize.width}, height: ${mobileSize.height} },
            desktop: { width: ${desktopSize.width}, height: ${desktopSize.height} }
        },
        label: \`${fileNameTypescript}\`
    },`
}
function appendFileAsyc(forComponent, data) {
  return new Promise((resolve, reject) => {
    fs.appendFile(forComponent, data, { encoding: 'utf8' }, (err) => {
      if (err) {
        reject(err)
      }

      resolve()
    });
  })
}

function mkdirAsync(dirName) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirName, {
      recursive: true,
    }, (err, path) => {
      if (err) {
        reject(err);
      }
      resolve(path)
    });
  })
}


function rimrafAsync(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}


