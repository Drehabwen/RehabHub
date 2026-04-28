import { useCallback, useEffect, useState } from 'react';
import { Results } from '@/lib/mediapipe-utils';
import { usePostureWS } from '@/hooks/usePostureWS';
import { useMeasurementStore } from '@/store/useMeasurementStore';
import type { Landmark, JointType as StoreJointType, MovementDirection as StoreMovementDirection } from '@/types/posture';
import type { JointType, MovementDirection } from '../types';
import { getDefaultDirectionForJoint, isMidlineJoint, normalizeROMDirection } from '../config/romConvention';

type PoseResults = Results & { poseWorldLandmarks?: Landmark[] };

export function useROMAnalysis() {
  const {
    activeMeasurements,
    isMeasuring,
    startMeasurement,
    stopMeasurement,
    resetMeasurement,
    setSingleMeasurement,
    updateMeasurementData,
  } = useMeasurementStore();
  const { analyzeJoint, jointResult } = usePostureWS();

  const [selectedJoint, setSelectedJoint] = useState<JointType>('shoulder');
  const [selectedDirection, setSelectedDirection] = useState<MovementDirection>(getDefaultDirectionForJoint('shoulder'));
  const [selectedSide, setSelectedSide] = useState<'left' | 'right'>('left');

  useEffect(() => {
    if (!jointResult?.results?.length) {
      return;
    }

    jointResult.results.forEach((result) => {
      if (result.angle === null || !Number.isFinite(result.angle)) {
        return;
      }
      updateMeasurementData(result.id, result.angle);
    });
  }, [jointResult, updateMeasurementData]);

  const configureAssessment = useCallback(
    (joint: JointType, direction: MovementDirection, side: 'left' | 'right') => {
      const normalizedDirection = normalizeROMDirection(joint, direction);
      const measurementSide = isMidlineJoint(joint) ? null : side;
      setSelectedJoint(joint);
      setSelectedDirection(normalizedDirection);
      setSelectedSide(side);
      setSingleMeasurement(joint as StoreJointType, normalizedDirection as StoreMovementDirection, measurementSide);
    },
    [setSingleMeasurement],
  );

  const startROMAssessment = useCallback(() => {
    const configuredMeasurement = useMeasurementStore.getState().activeMeasurements[0];
    const fallbackDirection = selectedDirection as StoreMovementDirection;
    const nextJoint = configuredMeasurement?.joint ?? (selectedJoint as StoreJointType);
    const nextDirection = configuredMeasurement?.direction ?? fallbackDirection;
    const nextSide =
      configuredMeasurement?.side !== undefined
        ? configuredMeasurement.side
        : isMidlineJoint(selectedJoint)
          ? null
          : selectedSide;
    setSingleMeasurement(nextJoint, nextDirection, nextSide);
    resetMeasurement();
    startMeasurement();
  }, [selectedDirection, selectedJoint, selectedSide, resetMeasurement, setSingleMeasurement, startMeasurement]);

  const stopROMAssessment = useCallback(() => {
    stopMeasurement();
  }, [stopMeasurement]);

  const handleResults = useCallback(
    (results: PoseResults, videoElement?: HTMLVideoElement) => {
      if (!isMeasuring || activeMeasurements.length === 0 || !results.poseLandmarks?.length) {
        return;
      }

      const width = videoElement?.videoWidth;
      const height = videoElement?.videoHeight;
      if (!width || !height) {
        return;
      }

      analyzeJoint(
        activeMeasurements.map((measurement) => ({
          id: measurement.id,
          jointType: measurement.joint,
          direction: normalizeROMDirection(measurement.joint as JointType, measurement.direction),
          side: measurement.side || undefined,
        })),
        results.poseLandmarks as Landmark[],
        width,
        height,
        results.poseWorldLandmarks,
        { calculationProfile: 'rom-plugin' },
      );
    },
    [activeMeasurements, analyzeJoint, isMeasuring],
  );

  return {
    activeMeasurements,
    isMeasuring,
    selectedJoint,
    selectedDirection,
    selectedSide,
    setSelectedJoint,
    setSelectedDirection,
    setSelectedSide,
    configureAssessment,
    startROMAssessment,
    stopROMAssessment,
    handleResults,
  };
}
