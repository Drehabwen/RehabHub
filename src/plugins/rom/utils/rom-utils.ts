import type { ROMData } from '../types';
import {
  ROM_DIRECTION_LABELS,
  ROM_JOINT_CONVENTION,
  type JointType,
  type MovementDirection,
} from '../config/romConvention';

export const jointNameMap: Record<string, string> = Object.fromEntries(
  Object.entries(ROM_JOINT_CONVENTION).map(([joint, config]) => [joint, config.label]),
);

export const directionNameMap: Record<string, string> = ROM_DIRECTION_LABELS;

export const normalROMRanges: Record<JointType, Partial<Record<MovementDirection, { normalMin: number; normalMax: number }>>> =
  Object.fromEntries(
    Object.entries(ROM_JOINT_CONVENTION).map(([joint, config]) => [joint, config.referenceRanges]),
  ) as Record<JointType, Partial<Record<MovementDirection, { normalMin: number; normalMax: number }>>>;

export const calculateROMStatus = (
  joint: JointType,
  direction: MovementDirection,
  angle: number,
): 'normal' | 'limited' | 'excessive' => {
  const range = normalROMRanges[joint]?.[direction];
  if (!range || !Number.isFinite(angle)) return 'normal';

  if (angle < range.normalMin) return 'limited';
  if (angle > range.normalMax) return 'excessive';
  return 'normal';
};

export const getROMReferenceAngle = (item: Pick<ROMData, 'angle' | 'maxAngle' | 'minAngle'>): number => {
  if (Number.isFinite(item.maxAngle)) {
    return Math.max(0, item.maxAngle);
  }
  if (Number.isFinite(item.angle)) {
    return Math.max(0, item.angle);
  }
  if (Number.isFinite(item.minAngle)) {
    return Math.max(0, item.minAngle);
  }
  return 0;
};

export const calculateROMScore = (romData: ROMData[]): number => {
  const total = romData.length;
  if (total === 0) return 0;

  const normalCount = romData.filter((item) =>
    calculateROMStatus(item.joint, item.direction, getROMReferenceAngle(item)) === 'normal'
  ).length;

  return Math.round((normalCount / total) * 100);
};
