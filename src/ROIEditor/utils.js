/** calculates the centroid of a polygon as the arithmetic mean of its vertices */
export function getPolygonCentroid(points) {
  const n = points.length;
  if (n === 0) return [0, 0];
  const cx = points.reduce((sum, p) => sum + p[0], 0) / n;
  const cy = points.reduce((sum, p) => sum + p[1], 0) / n;
  return [cx, cy];
}
