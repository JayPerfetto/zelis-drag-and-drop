// Refering to this video helped a ton with the math and generic implementation: https://www.youtube.com/watch?v=r9IU5eJhhGo

const getGradientStop = (
  ratio: number,
  innerColor: string,
  outerColor: string
) => {
  ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;

  const c0 = innerColor
    .match(/.{1,2}/g)!
    .map((oct) => parseInt(oct, 16) * (1 - ratio));
  const c1 = outerColor
    .match(/.{1,2}/g)!
    .map((oct) => parseInt(oct, 16) * ratio);
  const ci = [0, 1, 2].map((i) => Math.min(Math.round(c0[i] + c1[i]), 255));
  const color = ci
    .reduce((a, v) => (a << 8) + v, 0)
    .toString(16)
    .padStart(6, "0");

  return `#${color}`;
};

const calculateColor = (
  x: number,
  innerColor: string,
  outerColor: string,
  maxRadius: number
) => {
  const maxDiff = maxRadius * 2;
  const distance = x + maxRadius;
  const ratio = distance / maxDiff;

  const stop = getGradientStop(ratio, innerColor, outerColor);

  return stop;
};

const randomFromInterval = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const Points = ({
  innerColor,
  outerColor,
  minRadius,
  maxRadius,
  depth,
  numPoints,
}: {
  innerColor: string;
  outerColor: string;
  minRadius: number;
  maxRadius: number;
  depth: number;
  numPoints: number;
}) => {
  const pointsInner = Array.from({ length: numPoints }, (v, k) => k + 1).map(
    (num) => {
      const randomRadius = randomFromInterval(minRadius, maxRadius);
      const randomAngle = Math.random() * 2 * Math.PI;

      const x = randomRadius * Math.cos(randomAngle);
      const y = randomRadius * Math.sin(randomAngle);
      const z = randomFromInterval(-depth, depth);

      const color = calculateColor(x, innerColor, outerColor, maxRadius);

      return {
        idx: num,
        position: [x, y, z],
        color,
      };
    }
  );

  const pointsOuter = Array.from({ length: numPoints }, (v, k) => k + 1).map(
    (num) => {
      const randomRadius = randomFromInterval(minRadius / 2, maxRadius * 2);
      const randomAngle = Math.random() * 2 * Math.PI;

      const x = randomRadius * Math.cos(randomAngle);
      const y = randomRadius * Math.sin(randomAngle);
      const z = randomFromInterval(-depth * 25, depth * 25);

      const color = calculateColor(x, innerColor, outerColor, maxRadius);

      return {
        idx: num,
        position: [x, y, z],
        color,
      };
    }
  );

  return { pointsInner, pointsOuter };
};
