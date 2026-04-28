import { useEffect, useRef, useState } from 'react';

type TrackInfo = {
  label: string;
  muted: boolean;
  readyState: MediaStreamTrackState;
};

type CameraStreamState = {
  stream: MediaStream | null;
  error: Error | null;
  isLoading: boolean;
  trackInfo: TrackInfo | null;
  startStream: () => Promise<void>;
  stopStream: () => void;
};

const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',
  },
  audio: false,
};

const FALLBACK_CONSTRAINTS: MediaStreamConstraints[] = [
  DEFAULT_CONSTRAINTS,
  {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  },
  {
    video: true,
    audio: false,
  },
];

const stopStreamTracks = (stream: MediaStream | null) => {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
};

export const useCameraStream = (enabled: boolean = true): CameraStreamState => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = () => {
    stopStreamTracks(streamRef.current);
    streamRef.current = null;
    setStream(null);
    setTrackInfo(null);
  };

  const startStream = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const mediaError = new Error('Media devices API is not available');
      setError(mediaError);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      stopStreamTracks(streamRef.current);
      let nextStream: MediaStream | null = null;
      let lastError: Error | null = null;

      for (const constraints of FALLBACK_CONSTRAINTS) {
        try {
          nextStream = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch (caughtError) {
          lastError = caughtError instanceof Error ? caughtError : new Error('Unknown getUserMedia error');
          console.warn('[useCameraStream] getUserMedia failed, retrying with fallback constraints:', constraints, lastError);
        }
      }

      if (!nextStream) {
        throw lastError ?? new Error('Unable to create camera stream');
      }

      streamRef.current = nextStream;
      setStream(nextStream);

      const track = nextStream.getVideoTracks()[0];
      if (track) {
        track.enabled = true;
        const syncTrackInfo = () => {
          setTrackInfo({
            label: track.label,
            muted: track.muted,
            readyState: track.readyState,
          });
        };

        track.onmute = syncTrackInfo;
        track.onunmute = syncTrackInfo;
        syncTrackInfo();
      } else {
        setTrackInfo(null);
      }
    } catch (caughtError) {
      const nextError = caughtError instanceof Error ? caughtError : new Error('Unknown getUserMedia error');
      setError(nextError);
      setStream(null);
      setTrackInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      stopStream();
      return;
    }

    void startStream();
    return () => stopStreamTracks(streamRef.current);
  }, [enabled]);

  return {
    stream,
    error,
    isLoading,
    trackInfo,
    startStream,
    stopStream,
  };
};

export const resetCameraStreamForTesting = () => {};
