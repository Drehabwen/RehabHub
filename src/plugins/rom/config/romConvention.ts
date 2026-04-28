export const ROM_JOINTS = [
  'cervical',
  'shoulder',
  'elbow',
  'wrist',
  'hip',
  'knee',
  'ankle',
] as const;

export type JointType = (typeof ROM_JOINTS)[number];

export const ROM_DIRECTIONS = [
  'flexion',
  'extension',
  'abduction',
  'adduction',
  'internal-rotation',
  'external-rotation',
  'left-lateral-flexion',
  'right-lateral-flexion',
  'left-rotation',
  'right-rotation',
  'radial-deviation',
  'ulnar-deviation',
  'dorsiflexion',
  'plantarflexion',
] as const;

export type MovementDirection = (typeof ROM_DIRECTIONS)[number];

export type RangeThreshold = {
  normalMin: number;
  normalMax: number;
};

export type JointConvention = {
  label: string;
  sideMode: 'midline' | 'bilateral';
  supportedDirections: readonly MovementDirection[];
  referenceRanges: Partial<Record<MovementDirection, RangeThreshold>>;
};

export const ROM_DIRECTION_LABELS: Record<MovementDirection, string> = {
  flexion: '屈曲',
  extension: '伸展',
  abduction: '外展',
  adduction: '内收',
  'internal-rotation': '内旋',
  'external-rotation': '外旋',
  'left-lateral-flexion': '左侧屈',
  'right-lateral-flexion': '右侧屈',
  'left-rotation': '左旋',
  'right-rotation': '右旋',
  'radial-deviation': '桡偏',
  'ulnar-deviation': '尺偏',
  dorsiflexion: '背屈',
  plantarflexion: '跖屈',
};

export const ROM_JOINT_CONVENTION: Record<JointType, JointConvention> = {
  cervical: {
    label: '颈椎',
    sideMode: 'midline',
    supportedDirections: [
      'flexion',
      'extension',
      'left-lateral-flexion',
      'right-lateral-flexion',
      'left-rotation',
      'right-rotation',
    ],
    referenceRanges: {
      flexion: { normalMin: 35, normalMax: 60 },
      extension: { normalMin: 35, normalMax: 60 },
      'left-lateral-flexion': { normalMin: 30, normalMax: 55 },
      'right-lateral-flexion': { normalMin: 30, normalMax: 55 },
      'left-rotation': { normalMin: 50, normalMax: 85 },
      'right-rotation': { normalMin: 50, normalMax: 85 },
    },
  },
  shoulder: {
    label: '肩关节',
    sideMode: 'bilateral',
    supportedDirections: [
      'flexion',
      'extension',
      'abduction',
      'adduction',
      'internal-rotation',
      'external-rotation',
    ],
    referenceRanges: {
      flexion: { normalMin: 150, normalMax: 190 },
      extension: { normalMin: 40, normalMax: 70 },
      abduction: { normalMin: 150, normalMax: 190 },
      adduction: { normalMin: 20, normalMax: 50 },
      'internal-rotation': { normalMin: 55, normalMax: 100 },
      'external-rotation': { normalMin: 70, normalMax: 110 },
    },
  },
  elbow: {
    label: '肘关节',
    sideMode: 'bilateral',
    supportedDirections: ['flexion', 'extension'],
    referenceRanges: {
      flexion: { normalMin: 130, normalMax: 155 },
      extension: { normalMin: 0, normalMax: 15 },
    },
  },
  wrist: {
    label: '腕关节',
    sideMode: 'bilateral',
    supportedDirections: ['flexion', 'extension', 'radial-deviation', 'ulnar-deviation'],
    referenceRanges: {
      flexion: { normalMin: 60, normalMax: 95 },
      extension: { normalMin: 50, normalMax: 85 },
      'radial-deviation': { normalMin: 10, normalMax: 30 },
      'ulnar-deviation': { normalMin: 20, normalMax: 45 },
    },
  },
  hip: {
    label: '髋关节',
    sideMode: 'bilateral',
    supportedDirections: [
      'flexion',
      'extension',
      'abduction',
      'adduction',
      'internal-rotation',
      'external-rotation',
    ],
    referenceRanges: {
      flexion: { normalMin: 100, normalMax: 130 },
      extension: { normalMin: 15, normalMax: 35 },
      abduction: { normalMin: 35, normalMax: 55 },
      adduction: { normalMin: 15, normalMax: 35 },
      'internal-rotation': { normalMin: 30, normalMax: 55 },
      'external-rotation': { normalMin: 35, normalMax: 60 },
    },
  },
  knee: {
    label: '膝关节',
    sideMode: 'bilateral',
    supportedDirections: ['flexion', 'extension'],
    referenceRanges: {
      flexion: { normalMin: 125, normalMax: 145 },
      extension: { normalMin: 0, normalMax: 10 },
    },
  },
  ankle: {
    label: '踝关节',
    sideMode: 'bilateral',
    supportedDirections: ['dorsiflexion', 'plantarflexion'],
    referenceRanges: {
      dorsiflexion: { normalMin: 10, normalMax: 25 },
      plantarflexion: { normalMin: 35, normalMax: 55 },
    },
  },
};

export const ROM_DIRECTION_ALIASES: Record<string, MovementDirection> = {
  internal_rotation: 'internal-rotation',
  external_rotation: 'external-rotation',
  'left_lateral_flexion': 'left-lateral-flexion',
  'right_lateral_flexion': 'right-lateral-flexion',
  left_rotation: 'left-rotation',
  right_rotation: 'right-rotation',
  radial_deviation: 'radial-deviation',
  ulnar_deviation: 'ulnar-deviation',
  plantar_flexion: 'plantarflexion',
};

export const normalizeROMDirection = (joint: JointType, direction: string): MovementDirection => {
  if (direction in ROM_DIRECTION_ALIASES) {
    return ROM_DIRECTION_ALIASES[direction];
  }

  if (joint === 'cervical') {
    if (direction === 'abduction') return 'left-lateral-flexion';
    if (direction === 'adduction') return 'right-lateral-flexion';
    if (direction === 'internal_rotation') return 'left-rotation';
    if (direction === 'external_rotation') return 'right-rotation';
  }

  if (joint === 'wrist') {
    if (direction === 'abduction') return 'radial-deviation';
    if (direction === 'adduction') return 'ulnar-deviation';
  }

  if (joint === 'ankle') {
    if (direction === 'flexion') return 'dorsiflexion';
    if (direction === 'extension') return 'plantarflexion';
  }

  return direction as MovementDirection;
};

export const getDefaultDirectionForJoint = (joint: JointType): MovementDirection => {
  return ROM_JOINT_CONVENTION[joint].supportedDirections[0];
};

export const getDirectionLabel = (direction: MovementDirection): string => {
  return ROM_DIRECTION_LABELS[direction];
};

export const getJointLabel = (joint: JointType): string => {
  return ROM_JOINT_CONVENTION[joint].label;
};

export const isMidlineJoint = (joint: JointType): boolean => {
  return ROM_JOINT_CONVENTION[joint].sideMode === 'midline';
};
