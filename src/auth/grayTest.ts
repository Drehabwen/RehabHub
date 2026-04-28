export interface GrayTesterProfile {
  name: string;
  contact: string;
  organization: string;
  inviteCode: string;
  acknowledgedAt: string;
}

const STORAGE_KEY = 'rehab_gray_profile';
const DEFAULT_CODES = ['pilot-2026', 'qyzh-2026'];

const normalizeValue = (value: string) => value.trim();
const normalizeCode = (value: string) => normalizeValue(value).toLowerCase();
const getWindowTarget = () => (typeof window === 'undefined' ? null : window);

export const getGrayTestAccessCodes = (): string[] => {
  const configured = import.meta.env.VITE_GRAY_TEST_ACCESS_CODES
    ?.split(',')
    .map(normalizeCode)
    .filter(Boolean);

  return configured?.length ? configured : DEFAULT_CODES;
};

export const validateGrayTestInviteCode = (code: string): boolean => (
  getGrayTestAccessCodes().includes(normalizeCode(code))
);

export const readGrayTesterProfile = (): GrayTesterProfile | null => {
  const target = getWindowTarget();
  if (!target) return null;

  const raw = target.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<GrayTesterProfile>;
    if (!parsed.name || !parsed.contact || !parsed.inviteCode || !parsed.acknowledgedAt) {
      return null;
    }

    return {
      name: normalizeValue(parsed.name),
      contact: normalizeValue(parsed.contact),
      organization: normalizeValue(parsed.organization ?? ''),
      inviteCode: normalizeValue(parsed.inviteCode),
      acknowledgedAt: normalizeValue(parsed.acknowledgedAt),
    };
  } catch {
    return null;
  }
};

export const saveGrayTesterProfile = (profile: GrayTesterProfile) => {
  const target = getWindowTarget();
  if (!target) return;
  target.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const clearGrayTesterProfile = () => {
  const target = getWindowTarget();
  if (!target) return;
  target.localStorage.removeItem(STORAGE_KEY);
};

export const buildGrayTestUserId = (profile: Pick<GrayTesterProfile, 'contact' | 'name'>) => {
  const normalizedContact = normalizeValue(profile.contact).replace(/[^\w\u4e00-\u9fff-]+/g, '-');
  const normalizedName = normalizeValue(profile.name).replace(/[^\w\u4e00-\u9fff-]+/g, '-');
  return `pilot-${normalizedName || 'user'}-${normalizedContact || 'contact'}`;
};

export const GRAY_TEST_NOTICE_TITLE = '灰度测试入口';
export const GRAY_TEST_NOTICE_LINES = [
  '本系统当前用于受控灰测，仅面向已邀请的学校、机构和测试执行人员开放。',
  '测试阶段的数据仅用于筛查流程验证与交互优化，不替代正式医疗诊断。',
  '进入系统前请登记姓名与联系方式，便于后续复测追踪、问题回访和结果说明。',
];

export const GRAY_TEST_FEEDBACK_TEXT = import.meta.env.VITE_GRAY_TEST_FEEDBACK_TEXT ?? '问题反馈请联系测试负责人温昌辉';
export const GRAY_TEST_FEEDBACK_LINK = import.meta.env.VITE_GRAY_TEST_FEEDBACK_LINK ?? '';
