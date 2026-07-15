'use client';

import React, { useState, useRef, useEffect } from 'react';

interface VoiceRecorderProps {
  onAudioRecorded: (base64Audio: string, durationSeconds: number) => void;
  existingAudio: string | null;
  existingDuration: number;
  onClear: () => void;
}

export default function VoiceRecorder({
  onAudioRecorded,
  existingAudio,
  existingDuration,
  onClear
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recorderError, setRecorderError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Sync state if audio is already provided
  useEffect(() => {
    if (existingAudio) {
      setAudioUrl(existingAudio);
    } else {
      setAudioUrl(null);
    }
  }, [existingAudio]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecorderError(null);
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine supported mime types for audio
      let options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/ogg' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        // Fallback to default
        options = { mimeType: '' };
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        // Stop all tracks in stream to release microphone icon
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const localUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localUrl);

        // Convert audioBlob to Base64 for parent component storage
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onAudioRecorded(reader.result, recordingTime);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      recorder.start(250); // Get chunks every 250ms
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

    } catch (err: any) {
      console.error("Microphone access failed:", err);
      setRecorderError("Could not access your microphone. Please check your browser settings and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    onClear();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
      <div className="flex flex-col gap-4">
        <label className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Voice Description / സംസാരം
        </label>
        <p className="text-gray-500 text-base leading-relaxed">
          Record a voice note describing the issue. For example, explain how long the pothole has been there or if it causes blockages.
        </p>

        {recorderError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-base">
            {recorderError}
          </div>
        )}

        {audioUrl ? (
          /* Finished Recording State */
          <div className="flex flex-col gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-150">
            <div className="text-gray-700 font-bold text-lg">Listen to your Voice Note:</div>
            
            <audio 
              src={audioUrl} 
              controls 
              className="w-full max-w-md my-2"
            />
            
            <div className="text-gray-500 text-sm">
              Duration: {formatTime(existingDuration || recordingTime)}
            </div>

            <button
              type="button"
              onClick={deleteRecording}
              className="w-full max-w-xs py-4 px-6 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl border-2 border-red-200 transition-colors flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
              style={{ minHeight: '64px' }}
            >
              Delete & Record Again
            </button>
          </div>
        ) : isRecording ? (
          /* Recording Active State */
          <div className="flex flex-col items-center justify-center p-6 bg-red-50/30 border-2 border-dashed border-red-300 rounded-2xl gap-4">
            <div className="text-red-700 font-bold text-2xl animate-pulse flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-600 block"></span>
              RECORDING...
            </div>
            
            <div className="text-4xl font-mono font-bold text-gray-800 tracking-wider">
              {formatTime(recordingTime)}
            </div>

            {/* Giant Stop Button */}
            <button
              type="button"
              onClick={stopRecording}
              className="w-28 h-28 bg-red-600 hover:bg-red-700 text-white rounded-full flex flex-col items-center justify-center gap-1 shadow-lg cursor-pointer border-4 border-white animate-pulse-record transition-transform active:scale-95"
            >
              {/* Square icon representing stop */}
              <span className="w-8 h-8 bg-white rounded-sm block"></span>
              <span className="text-sm font-bold tracking-wide">STOP</span>
            </button>

            <p className="text-gray-600 text-center text-sm font-medium">
              Tap the big red button when you are done speaking.
            </p>
          </div>
        ) : (
          /* Start Recording Initial State */
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-ash-grey bg-beige/20 rounded-2xl gap-4">
            <div className="text-dark-teal font-bold text-lg">Tap below to record description:</div>
            
            {/* Giant Record Button */}
            <button
              type="button"
              onClick={startRecording}
              className="w-28 h-28 bg-dark-teal hover:bg-dark-teal/90 text-white rounded-full flex flex-col items-center justify-center gap-1 shadow-md cursor-pointer border-4 border-white transition-transform hover:scale-105 active:scale-95"
            >
              <span className="text-sm font-bold tracking-wide">RECORD</span>
            </button>

            <p className="text-gray-500 text-center text-sm font-medium">
              Speak clearly. You can review your recording before submitting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
