'use strict';

var search = require('binary-search');
var matrix = require('./matrix');

/**
 * Linear interpolation with some eccentricities.
 * @param {number[]} vX - array (vector in math speak) of x values
 * @param {number[]} vY - array (vector in math speak) of y values
 * @param {number} x - value to interpolate
 * @returns {number} interpolated value
 */
function lerp (vX, vY, x) {
  if (x < vX[0]) {
    // Don't interpolate leftward, Cuellar says this is done on purpose
    return vY[0];
  }

  var i = search(vX, x, function (a, b) {return a - b;});

  if (i >= 0) {
    // found exact match, no need to interpolate
    return vY[i];
  } else {
    // when not found, binary-search returns the -(index_x_should_be + 1),
    // see https://github.com/darkskyapp/binary-search/issues/1
    i = Math.abs(i + 1);
    if (i >= vX.length) {
      // extrapolate using last 2 values
      i = vX.length - 1;
    }
    var y0 = vY[i - 1];
    var y1 = vY[i];
    var x0 = vX[i - 1];
    var x1 = vX[i];

    return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
  }
}

/**
 * Calculate a CUSUM-based p-value for a given test statistic.
 * @param {number} stat - test statistic to interpolate
 * @returns {number} p-value
 */
module.exports = function cusumPValue (stat) {
  // Since we're interpolating linearly, instead of asymptotically, values far to the right can extrapolate past 0 and
  // get negative. Since this doesn't make sense for a p-value, we return 0 in those cases.
  return Math.max(0, lerp(matrix.x, matrix.y, stat));
};

// in case any consumers want to do their own interpolation
module.exports.matrix = matrix;
