import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useROMAnalysis } from '../hooks/useROMAnalysis';
import { useMeasurementStore } from '@/store/useMeasurementStore';

const analyzeJointMock = vi.fn();
const usePostureWSMock = vi.hoisted(() => ({
  jointResult: null as { results: { id: string; angle: number | null }[]; timestamp: number } | null,
}));

vi.mock('@/hooks/usePostureWS', () => ({
  usePostureWS: () => ({
    analyzeJoint: analyzeJointMock,
    jointResult: usePostureWSMock.jointResult,
  }),
}));

const buildMeasurement = (
  joint: 'cervical' | 'hip' | 'shoulder',
  direction: 'flexion' | 'internal-rotation',
  side: 'left' | 'right' | null,
) => ({
  id: `${joint}-${side ?? 'none'}`,
  joint,
  direction,
  side,
  currentAngle: 0,
  maxAngle: -Infinity,
  minAngle: Infinity,
  data: [],
  color: '#2563eb',
});

describe('useROMAnalysis', () => {
  beforeEach(() => {
    analyzeJointMock.mockReset();
    usePostureWSMock.jointResult = null;
    useMeasurementStore.setState((state) => ({
      ...state,
      activeMeasurements: [buildMeasurement('cervical', 'flexion', null)],
      isMeasuring: false,
      startTime: null,
      savedMeasurements: [],
      postureReports: [],
    }));
  });

  it('replaces the default cervical placeholder with the selected joint before measurement starts', () => {
    const { result } = renderHook(() => useROMAnalysis());

    act(() => {
      result.current.configureAssessment('hip', 'flexion', 'right');
      result.current.startROMAssessment();
    });

    expect(result.current.isMeasuring).toBe(true);
    expect(result.current.activeMeasurements).toHaveLength(1);
    expect(result.current.activeMeasurements[0]).toEqual(
      expect.objectContaining({
        joint: 'hip',
        direction: 'flexion',
        side: 'right',
      }),
    );
  });

  it('sends ROM measurements to backend joint analysis instead of computing locally', () => {
    const { result } = renderHook(() => useROMAnalysis());

    act(() => {
      result.current.configureAssessment('shoulder', 'internal-rotation', 'left');
      result.current.startROMAssessment();
    });

    const measurementId = result.current.activeMeasurements[0].id;
    const poseLandmarks = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
    const poseWorldLandmarks = Array.from({ length: 33 }, () => ({ x: 0.1, y: 0.2, z: 0.3 }));

    act(() => {
      result.current.handleResults(
        { poseLandmarks, poseWorldLandmarks } as never,
        { videoWidth: 1280, videoHeight: 720 } as HTMLVideoElement,
      );
    });

    expect(analyzeJointMock).toHaveBeenCalledTimes(1);
    expect(analyzeJointMock).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          id: measurementId,
          jointType: 'shoulder',
          direction: 'internal-rotation',
          side: 'left',
        }),
      ],
      poseLandmarks,
      1280,
      720,
      poseWorldLandmarks,
      { calculationProfile: 'rom-plugin' },
    );
  });

  it('writes backend joint angles back into the measurement store', () => {
    const { result, rerender } = renderHook(() => useROMAnalysis());

    act(() => {
      result.current.configureAssessment('shoulder', 'flexion', 'left');
      result.current.startROMAssessment();
    });

    const measurementId = result.current.activeMeasurements[0].id;
    usePostureWSMock.jointResult = {
      results: [{ id: measurementId, angle: 47.5 }],
      timestamp: Date.now(),
    };

    rerender();

    const updated = useMeasurementStore.getState().activeMeasurements[0];
    expect(updated.currentAngle).toBe(47.5);
  });
});
