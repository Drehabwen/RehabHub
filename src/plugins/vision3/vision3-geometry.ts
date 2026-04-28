import { PoseLandmark } from './vision3-utils';

/**
 * Core geometry helpers for capture gating and stability checks.
 */
export const Vision3Geometry = {
  /**
   * Accepts slightly looser full-body evidence so users are not blocked
   * when MediaPipe only returns upper-body landmarks on the first frames.
   */
  checkUserPosition: (
    landmarks: PoseLandmark[] | null,
    minVisibility: number = 0.18,
    requiredPoints: number[] = [0, 11, 12, 23, 24], // nose, shoulders, hips
  ): boolean => {
    if (!landmarks || landmarks.length < 25) return false;

    const getVisibility = (idx: number) => landmarks[idx]?.visibility ?? 0;
    const isVisible = (idx: number, threshold: number = minVisibility) => getVisibility(idx) >= threshold;
    const visibleCount = requiredPoints.reduce((count, idx) => count + (isVisible(idx) ? 1 : 0), 0);
    const visibleLandmarks = landmarks.filter((landmark) => (landmark.visibility ?? 0) >= minVisibility);

    const shouldersVisible = isVisible(11) && isVisible(12);
    const hipsVisible = isVisible(23) && isVisible(24);
    const torsoAnchored = shouldersVisible && (hipsVisible || isVisible(23) || isVisible(24) || isVisible(0));

    if (visibleCount >= 3 && torsoAnchored) {
      return true;
    }

    if (!torsoAnchored || visibleLandmarks.length < 6) {
      return false;
    }

    const xs = visibleLandmarks.map((landmark) => landmark.x);
    const ys = visibleLandmarks.map((landmark) => landmark.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = (minX + maxX) / 2;

    return width >= 0.12 && height >= 0.3 && centerX >= 0.18 && centerX <= 0.82;
  },

  /**
   * Distance between two normalized points.
   */
  distance: (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  },

  /**
   * Stability check used by auto-capture.
   */
  isStable: (
    current: PoseLandmark[],
    previous: PoseLandmark[],
    threshold: number = 0.01,
  ): boolean => {
    const indices = [11, 12, 23, 24];
    let totalDist = 0;
    let count = 0;

    indices.forEach((idx) => {
      if (current[idx] && previous[idx]) {
        totalDist += Vision3Geometry.distance(current[idx], previous[idx]);
        count++;
      }
    });

    if (count === 0) return false;
    return (totalDist / count) < threshold;
  },
};
