const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const sanitize = require("sanitize-filename");
const logger = require('../util/log-util');

/**
 * download video
 * @param {*} url video url
 * @param {*} folderPath save folder path
 */
async function download(url, folderPath) {

  try {

    // get title
    const info = await ytdl.getBasicInfo(url);
    const title = info.player_response.videoDetails.title;
    const filename = sanitize(`${title}.mp4`);
    const location = path.join(folderPath, filename);

    // download
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

    logger.debug(`[download] success: ${filename}`);

  } catch (error) {
    logger.error(`[download] url: ${url}\n${error}`);
  }
}

module.exports = {
  download,
};
