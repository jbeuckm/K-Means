// from http://4e.iwp9.org/papers/lumpyrng.pdf

function genrand(bmin, bmax, rmin, rmax, n) {
  // Generalized random number generator;
  // sum of n random variables (usually 3).
  // Bell curve spans bmin<=x<bmax; then,
  // values outside rmin<=x<rmax are rejected.
  var i, u, sum;
  do {
    sum = 0;

    for (let i = 0; i < n; i++) {
      sum += bmin + ((Math.random() * Number.MAX_VALUE) % (bmax - bmin));
    }

    if (sum < 0) sum -= n - 1;
    /* prevent pileup at 0 */
    u = sum / n;
  } while (!(rmin <= u && u < rmax));

  return u;
}

var clusterCurveDescriptions;

exports.init = function(ranges, count, _maxClusterPortion) {
  var maxClusterPortion = _maxClusterPortion || 1;

  clusterCurveDescriptions = [];

  for (var i = 0; i < count; i++) {
    var ccd = generateClusterCurveDescriptions(ranges, maxClusterPortion);

    clusterCurveDescriptions.push(ccd);
  }

  return clusterCurveDescriptions;
};

/*
 * Generate bell curve descriptions in each dimension (within range) to define a cluster probability
 */
function generateClusterCurveDescriptions(ranges, maxClusterPortion) {
  const curveDescriptions = [];

  for (var i = 0, l = ranges.length; i < l; i++) {
    var range = ranges[i];
    var rangeSize = range[1] - range[0];

    var center = range[0] + Math.random() * rangeSize;
    var width =
      rangeSize / 2 + ((Math.random() * rangeSize) / 2) * maxClusterPortion;

    var curveDescription = {
      bmin: center - width / 2,
      bmax: center + width / 2,
      rmin: center - width / 2,
      rmax: center + width / 2,
      height: 3
    };

    curveDescriptions.push(curveDescription);
  }

  return curveDescriptions;
}

/*
 * Generate a point from one of the clusters (random if not specified)
 */
function generatePoint(clusterIndex) {
  if (!clusterCurveDescriptions) {
    return null;
  }

  if (!clusterIndex) {
    clusterIndex = Math.floor(Math.random() * clusterCurveDescriptions.length);
  }

  var curveDescriptions = clusterCurveDescriptions[clusterIndex];
  var point = [];
  for (var i = 0, l = curveDescriptions.length; i < l; i++) {
    var cd = curveDescriptions[i];
    point.push(genrand(cd.bmin, cd.bmax, cd.rmin, cd.rmax, cd.height));
  }

  return point;
}

exports.generateClusterCurveDescriptions = generateClusterCurveDescriptions;
exports.genrand = genrand;
exports.generatePoint = generatePoint;
