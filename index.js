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
const successUrls = [];
const logger = log4js.getLogger();
let count = process.env.VIDEO_COUNT;
const urlFilePath = process.env.URL_FILE_PATH;
const downloadFolderPath = process.env.DOWNLOAD_FOLDER_PATH;

// process
const answer = '';//readlineSync.question('Does convert download video to mp3 ? (y/n)');
const urlContent = fs.readFileSync(urlFilePath);
// const urls = JSON.parse(urlContent);
const urls = [JSON.parse(urlContent)[0]];

(async function () {
  logger.debug('      *START*      ');

  // download
  await asyncForEach(urls, download);

  // convert
  if (!answer || answer.toLowerCase==='y' || answer.toLowerCase==='yes') {
    await asyncForEach(successUrls, convertToMP3);
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

    successUrls.push(filename);
    logger.debug(`success: ${filename}`);

  } catch (error) {
    logger.error(`fail: ${filename}\n${error}`);
  }
}

/**
 * convert mp4 to mp3 of success url 
 * @param {*} successUrl 
 * @param {*} index 
 * @param {*} successUrls 
 */
async function convertToMP3(successUrl, index, successUrls) {

  logger.debug(successUrl);
}