const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const ffmpeg = require('ffmpeg');
const { isNotEmpty } = require('../util/common-util');
const logger = require('../util/log-util');

/**
 * create folder if it doesn't exist
 * @param {*} folderPath 
 */
function createFolder(folderPath) {
  fs.mkdirSync(folderPath);
  return folderPath;
}

/**
 * create folder recurse if it doesn't exist
 * @param {*} folderPath 
 */
function createFolderRecurse(folderPath) {
  fs.mkdirSync(folderPath, { recursive: true });
  return folderPath;
}

/**
 * create today folder
 * @param {*} targetPath the path which the today folder is under
 */
function createTodayFolder(targetPath) {
  const today = format(new Date(), 'yyyyMMdd');
  const folderPath = isNotEmpty(targetPath) ? `${targetPath}/${today}` : today;
  createFolderRecurse(folderPath);
  return folderPath;
}

/**
 * get all file names in some folder
 * @param {*} folderPath 
 */
function getAllFileNames(folderPath) {
  return fs.readdirSync(folderPath);
}

/**
 * convert mp4 to mp3
 * @param {*} sourceFileName 
 * @param {*} sourceFolderPath 
 * @param {*} targetFolderPath 
 */
async function convertMP4ToMP3(sourceFileName, sourceFolderPath, targetFolderPath) {

  const targetFileName = `${path.basename(sourceFileName, '.mp4')}.mp3`;

  const source = path.join(sourceFolderPath, sourceFileName);
  const target = path.join(targetFolderPath, targetFileName);

  try {

    var video = await new ffmpeg(source);

    // convert to target
    // notice 1. edit source code because https://stackoverflow.com/questions/22766111/ffmpeg-not-working-with-filenames-that-have-whitespace
    //        2. fnExtractSoundToMP3 does return promise
    const result = await video.fnExtractSoundToMP3(target);

    logger.debug(`[convert] success: ${targetFileName}`);

  } catch (error) {
    logger.error(`[convert] ${sourceFileName}\n${error}`);
  }
}

module.exports = {
  createFolder,
  createFolderRecurse,
  createTodayFolder,
  getAllFileNames,
  convertMP4ToMP3,
};