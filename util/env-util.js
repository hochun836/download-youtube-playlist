const dotenv = require('dotenv');
const { isNotEmpty } = require('../util/common-util');

module.exports = function(env) {
  
  if (isNotEmpty(env)) {
    dotenv.config({ path: `environment/variable.${env}.env` });
  } else {
    dotenv.config({ path: 'environment/variable.env' });
  }
};