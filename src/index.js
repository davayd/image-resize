const path = require('path');
const rimraf = require('rimraf');
var fs = require('fs')
    , gm = require('gm').subClass({ imageMagick: true });

const dirName = 'masha-2021-minsk';
const inputDirPath = path.join(__dirname, `../assets/${dirName}`);
const outputDir = path.join(__dirname, `../output`);

const filenames = fs.readdirSync(inputDirPath);

const quality = 90;
const mobileSize = 500;
const desktopSize = 1000;


rimraf(path.join(outputDir, `${dirName}/*.*`), (err) => {

    if (err) {
        console.error(err);
        return;
    }

    filenames.forEach(fileName => {

        const [onlyFileName, extName] = path.basename(fileName).split('.');
        console.log(onlyFileName, extName);

        const imgPath = path.join(inputDirPath, `${onlyFileName}.${extName}`);
        const exactOutputDir = path.join(outputDir, dirName);
        console.log(exactOutputDir);

        fs.mkdirSync(exactOutputDir, {
            recursive: true,
        }, (err) => {
            if (err) {
                throw err;
            }
        })

        const result = [];
        const forComponent = path.join(exactOutputDir, 'component.txt');

        // mobile
        const mobileFileName = `${onlyFileName}-mobile.${extName}`;
        const mobileFileNameTypescript = `${onlyFileName}-\${imageMode}.${extName}`;
        const mobileOutputPath = path.join(exactOutputDir, mobileFileName);

        // desktop
        const desktopFileName = `${onlyFileName}-desktop.${extName}`;
        const desktopFileNameTypescript = `${onlyFileName}-\${imageMode}.${extName}`;
        const desktopOutputPath = path.join(exactOutputDir, desktopFileName);


        gm(imgPath)
            .resize(mobileSize).quality(quality).write(mobileOutputPath, (err) => {
                if (!err) {

                    console.log(`${fileName} mobile done`);

                    gm(mobileOutputPath).size((err, size) => {
                        if (!err) {
                            fs.appendFileSync(forComponent, `${JSON.stringify({
                                url: `/assets/photos/${dirName}/${mobileFileNameTypescript}`,
                                width: size.width,
                                height: size.height,
                                label: mobileFileNameTypescript
                            })},`, { encoding: 'utf8' });



                            // DESKTOP

                            gm(imgPath)
                                .resize(desktopSize).quality(quality).write(desktopOutputPath, (err) => {
                                    if (!err) {

                                        console.log(`${fileName} desktop done`);

                                        gm(desktopOutputPath).size((err, size) => {
                                            if (!err) {
                                                fs.appendFileSync(forComponent, `${JSON.stringify({
                                                    url: `/assets/photos/${dirName}/${desktopFileNameTypescript}`,
                                                    width: size.width,
                                                    height: size.height,
                                                    label: desktopFileNameTypescript
                                                })},`, { encoding: 'utf8' });
                                            }

                                        })
                                    }
                                })
                        }
                    })

                }
            })

    })


});
