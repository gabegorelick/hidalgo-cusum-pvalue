'use strict';

var chai = require('chai');
var expect = chai.expect;

var pValue = require('../index');
var matrix = require('../matrix');

describe('p-value', function () {
  it('should interpolate', function () {
    for (var i = 1; i < matrix.x.length; i++) {
      var x0 = matrix.x[i - 1];
      var x1 = matrix.x[i];
      var y0 = matrix.y[i - 1];
      var y1 = matrix.y[i];

      var x = x0 + (x1 - x0) * 0.5;
      expect(x).to.be.above(x0).and.below(x1);

      var expected = y0 + (y1 - y0) * (x - x0) / (x1 - x0);
      expect(pValue(x)).to.equal(expected);
    }
  });

  it('should interpolate exactly when testStat is in matrix.x', function () {
    for (var i = 0; i < matrix.x.length; i++) {
      expect(pValue(matrix.x[i])).to.equal(matrix.y[i]);
    }
  });

  it('should extrapolate using last 2 values', function () {
    var lastX = matrix.x[matrix.x.length - 1];
    var secondToLastX = matrix.x[matrix.x.length - 2];
    var lastY = matrix.y[matrix.y.length - 1];
    var secondToLastY = matrix.y[matrix.y.length - 2];

    var expected = secondToLastY + (lastX + 0.1 - secondToLastX) / (lastX - secondToLastX) * (lastY - secondToLastY);

    expect(pValue(lastX + 0.1)).to.equal(expected);
  });

  it('should not extrapolate leftward', function () {
    expect(pValue(matrix.x[0] - 1)).to.equal(matrix.y[0]);
  });

  it('should return 0 instead of negative p-value', function () {
    var lastX = matrix.x[matrix.x.length - 1];
    var secondToLastX = matrix.x[matrix.x.length - 2];
    var lastY = matrix.y[matrix.y.length - 1];
    var secondToLastY = matrix.y[matrix.y.length - 2];

    var expected = secondToLastY + (lastX + 1 - secondToLastX) / (lastX - secondToLastX) * (lastY - secondToLastY);
    expect(expected).to.be.below(0);
    expect(pValue(lastX + 1)).to.equal(0);
  });
});
