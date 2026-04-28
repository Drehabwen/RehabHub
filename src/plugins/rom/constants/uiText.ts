import {
  getDirectionLabel,
  getJointLabel,
  isMidlineJoint,
  type JointType,
  type MovementDirection,
} from '../config/romConvention';

export const ROM_TEXTS = {
  title: '关节活动度筛查',
  description: '面向筛查场景记录各关节活动范围，对比左右差异并为后续复测留档。',
  joints: {
    cervical: getJointLabel('cervical'),
    shoulder: getJointLabel('shoulder'),
    elbow: getJointLabel('elbow'),
    wrist: getJointLabel('wrist'),
    hip: getJointLabel('hip'),
    knee: getJointLabel('knee'),
    ankle: getJointLabel('ankle'),
  },
  status: {
    normal: '正常',
    limited: '活动受限',
    excessive: '活动过度',
  },
  messages: {
    start: '准备就绪后开始采集。',
    measuring: '正在采集中，请保持动作稳定。',
    completed: '本次测量已完成。',
    save: '保存筛查结果',
  },
} as const;

export const getROMDirectionLabel = (joint: JointType, direction: MovementDirection) => {
  if (joint === 'cervical' && isMidlineJoint(joint)) {
    return getDirectionLabel(direction);
  }

  return getDirectionLabel(direction);
};

export const getROMSideLabel = (joint: JointType, side: 'left' | 'right') => {
  if (isMidlineJoint(joint)) {
    return '中线位';
  }

  return side === 'left' ? '左侧' : '右侧';
};
