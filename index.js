// require
require('./util/env-util')();
const fs = require('fs');
const logger = require('./util/log-util');
const { asyncForEach } = require('./util/common-util');
const { download } = require('./util/ytdl-util');
const { createTodayFolder } = require('./util/file-util');

const downloadFolderPath = createTodayFolder(process.env.DOWNLOAD_FOLDER_PATH);
const urlFilePath = process.env.URL_FILE_PATH;
const urlContent = fs.readFileSync(urlFilePath);
const urls = JSON.parse(urlContent);

// process
(async function () {
  logger.debug('      *START*      ');

  await asyncForEach(urls, download, downloadFolderPath);

  logger.debug('      *END*      ');
})();
