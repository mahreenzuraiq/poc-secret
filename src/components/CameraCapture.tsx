'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CameraCaptureProps {
  onPhotoCaptured: (base64Photo: string) => void;
  existingPhoto: string | null;
  onClear: () => void;
}

export default function CameraCapture({ onPhotoCaptured, existingPhoto, onClear }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Prefer back camera on mobile
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Camera access failed, falling back to file input:", err);
      setCameraError("Could not open live camera preview. Please take a photo using the default camera instead.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video stream aspect ratio
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to Base64 data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // 85% quality to save storage space
        onPhotoCaptured(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onPhotoCaptured(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
      <div className="flex flex-col gap-4">
        <label className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Issue Photo / ഫോട്ടോ എടുക്കുക
        </label>
        <p className="text-gray-500 text-base leading-relaxed">
          Please take a clear picture of the issue (e.g. road pothole, leaking pipe) so our team can locate it.
        </p>

        {existingPhoto ? (
          /* Captured Photo State */
          <div className="flex flex-col gap-4 items-center">
            <div className="relative w-full max-w-md rounded-xl overflow-hidden border-4 border-emerald-600 shadow-md aspect-video bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={existingPhoto} 
                alt="Captured issue" 
                className="w-full h-full object-cover" 
                />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-full text-sm shadow">
                Ready
              </div>
            </div>
            
            <button
              type="button"
              onClick={onClear}
              className="w-full max-w-xs py-4 px-6 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl border-2 border-red-200 transition-colors flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
              style={{ minHeight: '64px' }}
            >
              Delete & Retake Photo
            </button>
          </div>
        ) : isCameraActive ? (
          /* Live Camera Viewport State */
          <div className="flex flex-col gap-4 items-center">
            <div className="relative w-full max-w-md rounded-xl overflow-hidden border-4 border-amber-500 shadow-lg aspect-video bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-4 w-full max-w-md">
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                style={{ minHeight: '64px' }}
              >
                Click to Snap Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="py-4 px-6 bg-gray-150 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-lg active:scale-[0.98]"
                style={{ minHeight: '64px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Initial Selector State */
          <div className="flex flex-col gap-4">
            {/* Show camera error warnings if user declined permissions */}
            {cameraError && (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-base">
                {cameraError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Native System Camera Button (Best for Mobile PWAs) */}
              <label 
                className="flex flex-col items-center justify-center border-3 border-dashed border-emerald-500 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 rounded-2xl p-6 cursor-pointer text-center gap-3 transition-colors shadow-sm active:scale-[0.98]"
                style={{ minHeight: '140px' }}
              >
                <div>
                  <div className="font-bold text-xl">Use Mobile Camera</div>
                  <div className="text-sm text-emerald-700 mt-1">Open camera and snap photo instantly</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>

              {/* WebRTC Live Webcam Button (Best for Laptop browsers) */}
              <button
                type="button"
                onClick={startCamera}
                className="flex flex-col items-center justify-center border-3 border-dashed border-amber-500 hover:border-amber-600 bg-amber-50/30 hover:bg-amber-50 text-amber-800 rounded-2xl p-6 text-center gap-3 transition-colors shadow-sm active:scale-[0.98]"
                style={{ minHeight: '140px' }}
              >
                <div>
                  <div className="font-bold text-xl">Use Web Browser Cam</div>
                  <div className="text-sm text-amber-700 mt-1">Show camera preview right here on screen</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
