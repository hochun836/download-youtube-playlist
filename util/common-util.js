/**
 * check param is empty
 * @param {*} param 
 * @param {*} checkPropertyEmpty default false
 */
function isEmpty(param, checkPropertyEmpty = false) {

  // null and undefined are "empty"
  if (param == null) {
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (param.length > 0) {
    return false;
  }
  if (param.length === 0) {
    return true;
  }

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof param !== 'object') {
    return false;
  }

  return checkPropertyEmpty ?
    Object.keys(param).length === 0 || !Object.keys(param).some(property => isNotEmpty(param[property], true)) :
    Object.keys(param).length === 0;
}

/**
 * check param is not empty
 * @param {*} param 
 * @param {*} checkPropertyEmpty default false
 */
function isNotEmpty(param, checkPropertyEmpty = false) {
  return !isEmpty(param, checkPropertyEmpty);
}

/**
 * async await loop
 * @param {*} array 
 * @param {*} callback 
 * @param  {...any} otherArgs otherArgs of callback function
 */
async function asyncForEach(array, callback, ...otherArgs) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], ...otherArgs);
  }
}

module.exports = {
  isEmpty,
  isNotEmpty,
  asyncForEach,
};