const fs = require('fs');
const { format } = require('date-fns');
const { isNotEmpty } = require('../util/common-util');

/**
 * create folder if it doesn't exist
 * @param {*} folderPath 
 */
function createFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  return folderPath;
}

/**
 * create today folder
 * @param {*} target the location which the today folder is under
 */
function createTodayFolder(target) {
  const today = format(new Date(), 'yyyyMMdd');
  const folderPath = isNotEmpty(target) ? `${target}/${today}` : today;
  createFolder(folderPath);
  return folderPath;
}

module.exports = {
  createFolder,
  createTodayFolder,
};