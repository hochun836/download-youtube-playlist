// require
require('./util/env-util')();
const fs = require('fs');
const readlineSync = require('readline-sync');
const logger = require('./util/log-util');
const { asyncForEach } = require('./util/common-util');
const { download } = require('./util/ytdl-util');
const { createFolder, createTodayFolder, getAllFileNames, convertMP4ToMP3 } = require('./util/file-util');

const downloadFolderPath = createTodayFolder(process.env.DOWNLOAD_FOLDER_PATH);
const urlFilePath = process.env.URL_FILE_PATH;
const urlContent = fs.readFileSync(urlFilePath);
const urls = JSON.parse(urlContent);

// process
const answer = readlineSync.question('Does convert download video to mp3 ? (y/n)'); // debug not work

(async function () {
  logger.debug('      *START*      ');

  // download
  await asyncForEach(urls, download, downloadFolderPath);

  // convert
  if (!answer && (answer.toLowerCase === 'y' || answer.toLowerCase === 'yes')) {
    const fileNames = getAllFileNames(downloadFolderPath);
    const mp3FolderPath = createFolder(`${downloadFolderPath}/mp3`);
    await asyncForEach(fileNames, convertMP4ToMP3, downloadFolderPath, mp3FolderPath);
  }

  logger.debug('      *END*      ');
})();