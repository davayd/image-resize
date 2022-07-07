const path = require('path');
const rimraf = require('rimraf');
var fs = require('fs')
    , gm = require('gm').subClass({ imageMagick: true });

const dirName = 'nastya 2021, Grodno';

const dirPath = path.normalize('C:/Users/Dmitry Dreko/Downloads/файлы для сайта-20220706T194712Z-001/файлы для сайта/портфолио фото')
const inputDirPath = path.join(dirPath, dirName);
const outputDir = path.normalize('C:/Users/Dmitry Dreko/Documents/Projects/ritamazura-website-ng/src/assets/photos')
const filenames = fs.readdirSync(inputDirPath);
const rimrafPhotosPath = path.join(outputDir, `${dirName}/*.*`);
const exactOutputDir = path.join(outputDir, dirName);
const componentFileDir = path.join(__dirname, './../output', dirName)
const rimrafComponentFilePath = path.join(__dirname, './../output', `${dirName}/*.*`)

const quality = 100;
const mobileSize = 500;
const desktopSize = 1000;


(async function () {
    await rimrafAsync(rimrafPhotosPath);
    await rimrafAsync(rimrafComponentFilePath);

    await mkdirAsync(exactOutputDir);
    await mkdirAsync(componentFileDir);

    for (const fileName of filenames) {
        const [onlyFileName, extName] = path.basename(fileName).split('.');
        console.log(onlyFileName, extName);

        const imgPath = path.join(inputDirPath, `${onlyFileName}.${extName}`);
        const forComponent = path.join(componentFileDir, 'component.txt');
        const forComponentFilename = `${onlyFileName}-\${imageMode}.${extName}`;

        // mobile
        const mobileFileName = `${onlyFileName}-mobile.${extName}`;
        const mobileOutputPath = path.join(exactOutputDir, mobileFileName);

        // desktop
        const desktopFileName = `${onlyFileName}-desktop.${extName}`;
        const desktopOutputPath = path.join(exactOutputDir, desktopFileName);

        await gmResizeAsync(imgPath, mobileSize, mobileOutputPath);
        const mobileFileSize = await gmReadSizeAsyc(mobileOutputPath)

        await gmResizeAsync(imgPath, desktopSize, desktopOutputPath);
        const desktopFileSize = await gmReadSizeAsyc(desktopOutputPath)

        appendFileAsyc(forComponent, dirName, forComponentFilename, mobileFileSize, desktopFileSize)
    }

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

function appendFileAsyc(forComponent, dirName, fileNameTypescript, mobileSize, desktopSize) {
    return new Promise((resolve, reject) => {
        fs.appendFile(forComponent, `{
            url: \`/assets/photos/${dirName}/${fileNameTypescript}\`,
            sizes: {
                mobile: { width: ${mobileSize.width}, height: ${mobileSize.height} },
                desktop: { width: ${desktopSize.width}, height: ${desktopSize.height} }
            }
            label: \`${fileNameTypescript}\`
        },`, { encoding: 'utf8' }, (err) => {
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


