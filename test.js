// require
require('./util/env-util')('test');
const fs = require('fs');
const logger = require('./util/log-util');
const { asyncForEach } = require('./util/common-util');
const { download } = require('./util/ytdl-util');
const { createFolderRecurse, getAllFileNames, convertMP4ToMP3 } = require('./util/file-util');

const downloadFolderPath = createFolderRecurse(process.env.DOWNLOAD_FOLDER_PATH);
const urlFilePath = process.env.URL_FILE_PATH;
const urlContent = fs.readFileSync(urlFilePath);
const urls = JSON.parse(urlContent);

// process
(async function () {
  logger.debug('      *START*      ');

  // download
  await asyncForEach(urls, download, downloadFolderPath);

  // convert
  const filenames = getAllFileNames(downloadFolderPath);
  await asyncForEach(filenames, convertMP4ToMP3, downloadFolderPath, downloadFolderPath);

  logger.debug('      *END*      ');
})();
