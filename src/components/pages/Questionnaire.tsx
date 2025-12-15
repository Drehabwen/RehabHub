import React, { useState } from 'react';
import { colors } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import Button from '../ui/Button';
import AudioRecorder from '../ui/AudioRecorder';

const Questionnaire: React.FC = () => {
  const { goBack } = useNavigation();
  const [showRecorder, setShowRecorder] = useState(false);
  const [lastTranscript, setLastTranscript] = useState<string>('');

  return (
    <div className="mx-auto max-w-5xl p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.primary[800] }}>问诊</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowRecorder(!showRecorder)}
            style={{ borderColor: colors.primary[400], color: colors.primary[700] }}
          >
            录音并转写病例
          </Button>
          <Button
            variant="primary"
            onClick={goBack}
            style={{ backgroundColor: colors.primary[500], color: '#fff' }}
          >
            返回
          </Button>
        </div>
      </div>
      {showRecorder && (
        <div className="mb-6">
          <AudioRecorder
            onComplete={(data) => {
              setLastTranscript(data.transcript || '');
            }}
          />
          {lastTranscript && (
            <div className="mt-3 p-3 rounded-md border" style={{ backgroundColor: '#fafafa', borderColor: '#e5e7eb' }}>
              <div className="text-sm font-medium mb-1" style={{ color: colors.primary[800] }}>最近一次转写</div>
              <div className="text-sm" style={{ color: colors.text.secondary }}>{lastTranscript}</div>
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 border rounded-xl shadow bg-white">
          <div className="text-lg font-semibold text-gray-800 mb-2">基础信息</div>
          <div className="text-sm text-gray-500">年龄、性别、既往病史、过敏史</div>
        </div>
        <div className="p-5 border rounded-xl shadow bg-white">
          <div className="text-lg font-semibold text-gray-800 mb-2">主诉与现病史</div>
          <div className="text-sm text-gray-500">疼痛位置、发生时间、诱因与缓解因素</div>
        </div>
        <div className="p-5 border rounded-xl shadow bg-white">
          <div className="text-lg font-semibold text-gray-800 mb-2">生活方式与风险因素</div>
          <div className="text-sm text-gray-500">运动习惯、职业、睡眠质量</div>
        </div>
        <div className="p-5 border rounded-xl shadow bg-white">
          <div className="text-lg font-semibold text-gray-800 mb-2">随访与预后</div>
          <div className="text-sm text-gray-500">治疗目标、复诊计划</div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
