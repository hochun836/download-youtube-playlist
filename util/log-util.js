const log4js = require('log4js');

log4js.configure(process.env.LOG_CONFIG_PATH);

module.exports = log4js.getLogger();