// d3interpolator.ts
import * as d3 from 'd3';

export const interpolatePath = (startPath, endPath, numFrames, cp1x, cp1y, cp2x, cp2y) => {
    const interpolator = d3.interpolate(startPath, endPath);
    return Array.from({ length: numFrames + 1 }, (_, i) => {
        const t = i / (numFrames);
        const { y } = cubicBezier(t, [cp1x, cp1y], [cp2x, cp2y]);
        return interpolator(y);
    });
};

export function cubicBezier(t, p1, p2) {
    const [cp1x, cp1y] = p1;
    const [cp2x, cp2y] = p2;
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const x = mt3 * 0 + 3 * mt2 * t * cp1x + 3 * mt * t2 * cp2x + t3 * 1;
    const y = mt3 * 0 + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * 1;
    return { x, y };
}
