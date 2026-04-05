import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { colors } from '../../theme';

interface AudioRecorderProps {
  onComplete?: (data: { audioUrl?: string; transcript?: string }) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onComplete }) => {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = e => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        if (onComplete) onComplete({ audioUrl: url, transcript });
      };
      mr.start();
      setRecording(true);
    } catch (_) {}
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.stop();
    }
    setRecording(false);
  };

  const startTranscription = () => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      setTranscribing(false);
      return;
    }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'zh-CN';
    rec.onresult = (event: any) => {
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        text += res[0].transcript;
      }
      setTranscript(text);
    };
    rec.onend = () => {
      setTranscribing(false);
      if (onComplete) onComplete({ audioUrl, transcript });
    };
    rec.start();
    setTranscribing(true);
  };

  const stopTranscription = () => {
    const rec = recognitionRef.current;
    if (rec) {
      rec.stop();
    }
  };

  useEffect(() => {
    return () => {6
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="p-4 rounded-lg border" style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold" style={{ color: colors.primary[800] }}>录音与转写</div>
        <div className="text-xs" style={{ color: colors.text.secondary }}>仅在本地运行</div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          variant={recording ? 'secondary' : 'primary'}
          onClick={() => (recording ? stopRecording() : startRecording())}
          style={{ backgroundColor: recording ? colors.error[500] : colors.primary[500], color: '#fff' }}
        >
          {recording ? '停止录音' : '开始录音'}
        </Button>
        <Button
          variant={transcribing ? 'secondary' : 'outline'}
          onClick={() => (transcribing ? stopTranscription() : startTranscription())}
        >
          {transcribing ? '停止转写' : '开始转写'}
        </Button>
        {audioUrl && (
          <a
            href={audioUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-md text-sm"
            style={{ backgroundColor: colors.primary[50], color: colors.primary[700] }}
          >
            试听录音
          </a>
        )}
      </div>
      <div className="mt-4">
        <textarea
          value={transcript}
          onChange={e => setTranscript(e.target.value)}
          placeholder="自动或手动输入转写内容"
          className="w-full h-32 p-3 rounded-md border"
          style={{ borderColor: '#e5e7eb' }}
        />
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          variant="primary"
          onClick={() => {
            if (onComplete) onComplete({ audioUrl, transcript });
            try {
              const payload = { audioUrl, transcript, ts: Date.now() };
              sessionStorage.setItem('voice_intake_latest', JSON.stringify(payload));
            } catch {}
          }}
          style={{ backgroundColor: colors.primary[600], color: '#fff' }}
        >
          保存
        </Button>
      </div>
    </div>
  );
};

export default AudioRecorder;

