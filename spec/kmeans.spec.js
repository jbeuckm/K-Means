import { default as kmeans } from "../src/kmeans";

describe("KMeans", function() {
  var data = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

  it("counts the number of points assigned to each mean", function() {
    var assignments = [0, 0, 0, 1, 1, 2];

    expect(kmeans.countPointsPerMean(assignments)).toEqual({
      0: 3,
      1: 2,
      2: 1
    });
  });

  it("should find ranges in a data array", function() {
    var ranges = kmeans.findRanges(data);

    expect(ranges).toEqual([[0, 6], [1, 7], [2, 8]]);
  });

  it("should create K random points within specified ranges", function() {
    var ranges = kmeans.findRanges(data);
    var dimensions = ranges.length;

    var means = kmeans.generateRandomPoints(ranges, 2);

    expect(means.length).toEqual(2);

    for (var i = 0; i < 2; i++) {
      var mean = means[i];

      expect(mean.length).toBeDefined();

      for (var d = 0; d < dimensions; d++) {
        //        expect(mean[d]).not.toBeLessThan(ranges[d][0]);
        //        expect(mean[d]).not.toBeGreaterThan(ranges[d][1]);
        //@TODO: fix these ranges to work with new random generator
      }
    }
  });

  it("calculates Euclidean distance between two points", function() {
    var point1 = [0, 0, 0],
      point2 = [3, 4, 0];

    expect(kmeans.distance(point1, point2)).toEqual(5);

    point1 = [0, 0, 0];
    point2 = [0, 3, 4];

    expect(kmeans.distance(point1, point2)).toEqual(5);
  });

  it("assigns a datapoint to the closest mean", function() {
    var means = [[0, 0], [5, 0], [0, 5], [10, 10]];

    expect(kmeans.findClosestMean([0, 0], means)).toEqual(0);
    expect(kmeans.findClosestMean([4, 0], means)).toEqual(1);
    expect(kmeans.findClosestMean([9, 9], means)).toEqual(3);
  });

  it("finds the index of the smallest number in an array", function() {
    expect(kmeans.findIndexOfMinimum([5, 8, 3, 9])).toEqual(2);
  });

  it("assigns points to their closest mean", function() {
    var means = [[0, 0], [10, 10]];

    var points = [[1, 1], [2, 2], [8, 8], [9, 9]];

    var assignments = kmeans.assignPointsToMeans(points, means);

    expect(assignments).toEqual([0, 0, 1, 1]);
  });

  it("counts changed assignments", function() {
    var oldAssignments = [0, 0, 1, 1];
    var newAssignments = [0, 0, 1, 1];

    expect(
      kmeans.countChangedAssignments(oldAssignments, newAssignments)
    ).toEqual(0);

    newAssignments[0] = 1;
    expect(
      kmeans.countChangedAssignments(oldAssignments, newAssignments)
    ).toEqual(1);

    newAssignments[1] = 1;
    expect(
      kmeans.countChangedAssignments(oldAssignments, newAssignments)
    ).toEqual(2);
  });

  it("adjusts the means array according to assigned points", function() {
    var means = [[0, 0], [10, 10]];
    var points = [[1, 1], [2, 2], [8, 8], [9, 9]];
    var assignments = kmeans.assignPointsToMeans(points, means);

    var newMeans = kmeans.moveMeansToCenters(points, assignments, means);

    expect(newMeans.length).toEqual(means.length);
  });

  it("finds the average of a pointset", function() {
    expect(kmeans.averagePosition([[0, 0, 0], [1, 1, 1]])).toEqual([
      0.5,
      0.5,
      0.5
    ]);
  });

  it("finds the average separation in a set of points", function() {
    var points = [[3, 0], [0, 4]];
    var sep = kmeans.findAverageMeanSeparation(points);
    expect(sep).toEqual(5);

    points = [[0, 0], [1, 0], [2, 0]];
    sep = kmeans.findAverageMeanSeparation(points);
    expect(sep).toEqual(4 / 3);

    points = [[0, 0], [1, 0], [0, 1], [1, 1]];
    sep = kmeans.findAverageMeanSeparation(points);
    expect(sep).toEqual((4 + 2 * Math.sqrt(2)) / 6);
  });
});
