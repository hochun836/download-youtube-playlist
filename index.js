// require
const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const dotenv = require('dotenv');
const sanitize = require("sanitize-filename");
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');
const readlineSync = require('readline-sync');

log4js.configure('./log4js.json');
dotenv.config({
  path: './variable.env'
});

// variable
const successFilenames = [];
// const successFilenames = ['463. Ahiru no Sora Opening 3 HQ Full - 『Humming Bird』 by BLUE ENCOUNT.mp4']; // test
const logger = log4js.getLogger();
let count = process.env.VIDEO_COUNT;
const urlFilePath = process.env.URL_FILE_PATH;
const downloadFolderPath = process.env.DOWNLOAD_FOLDER_PATH;

// process
const answer = readlineSync.question('Does convert download video to mp3 ? (y/n)'); // debug not work
const urlContent = fs.readFileSync(urlFilePath);
const urls = JSON.parse(urlContent);
// const urls = [JSON.parse(urlContent)[0]]; // test

(async function () {
  logger.debug('      *START*      ');

  // download
  await asyncForEach(urls, download);

  // convert
  if (!answer || answer.toLowerCase === 'y' || answer.toLowerCase === 'yes') {
    await asyncForEach(successFilenames, convertToMP3);
  }

  logger.debug('      *END*      ');
})();

/**
 * async await loop
 * @param {*} array 
 * @param {*} callback 
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * download video by url
 * @param {*} url 
 * @param {*} index 
 * @param {*} urls 
 */
async function download(url, index, urls) {

  const prefix = count--;
  const info = await ytdl.getBasicInfo(url);
  const filename = sanitize(`${prefix}. ${info.title}.mp4`);
  const location = path.join(downloadFolderPath, filename);

  try {

    const writeStream = fs.createWriteStream(location); // create file
    const readStream = ytdl(url); // download video

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream); // pipe to file
      readStream.on("error", (err) => {
        reject(err);
      });
      writeStream.on("finish", function () {
        resolve();
      });
    });

    successFilenames.push(filename);
    logger.debug(`[download] success: ${filename}`);

  } catch (error) { // TODO: UnhandledPromiseRejectionWarning: Error: This video is unavailable
    logger.error(`[download] fail: ${filename}\n${error}`);
  }
}

/**
 * convert mp4 to mp3 of success filename 
 * @param {*} successFilename 
 * @param {*} index 
 * @param {*} successFilenames 
 */
async function convertToMP3(successFilename, index, successFilenames) {

  const sourceFileName = successFilename;
  const targetFileName = `${path.basename(successFilename, '.mp4')}.mp3`;

  const sourcePath = path.join(downloadFolderPath, sourceFileName);
  const targetPath = path.join(downloadFolderPath, targetFileName);

  try {

    var video = await new ffmpeg(sourcePath);

    // convert to target
    // notice 1. edit source code because https://stackoverflow.com/questions/22766111/ffmpeg-not-working-with-filenames-that-have-whitespace
    //        2. fnExtractSoundToMP3 does return promise
    const result = await video.fnExtractSoundToMP3(targetPath);

    // delete source
    if (fs.existsSync(sourcePath)) {
			fs.unlinkSync(sourcePath);
    }

    logger.debug(`[convert] success: ${targetFileName}`);

  } catch (error) { // TODO: same as download
    logger.error(`[convert] fail: ${targetFileName}\n${error}`);
  }
}