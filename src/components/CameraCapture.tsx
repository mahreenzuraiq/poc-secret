'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, Check, Trash2, Smartphone, Laptop, AlertTriangle } from 'lucide-react';

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
          <Camera className="w-6 h-6 text-emerald-850 shrink-0" />
          <span>Issue Photo / ഫോട്ടോ എടുക്കുക</span>
        </label>
        <p className="text-gray-550 text-base leading-relaxed">
          Please take a clear picture of the issue (e.g. road pothole, leaking pipe) so our team can locate it.
        </p>

        {existingPhoto ? (
          /* Captured Photo State */
          <div className="flex flex-col gap-4 items-center">
            <div className="relative w-full max-w-md rounded-lg overflow-hidden border-4 border-dark-teal shadow-md aspect-video bg-gray-150">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={existingPhoto} 
                alt="Captured issue" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-full text-sm shadow flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Ready
              </div>
            </div>
            
            <button
              type="button"
              onClick={onClear}
              className="w-full max-w-xs py-4 px-6 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl border-2 border-red-200 transition-colors flex items-center justify-center gap-2.5 text-lg active:scale-[0.98]"
              style={{ minHeight: '64px' }}
            >
              <Trash2 className="w-5 h-5" /> Delete & Retake Photo
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
                className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-lg flex items-center justify-center gap-2.5 active:scale-[0.98]"
                style={{ minHeight: '64px' }}
              >
                <Camera className="w-5 h-5" /> Click to Snap Photo
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
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Native System Camera Button (Best for Mobile PWAs) */}
              <label 
                className="flex flex-col items-center justify-center border-3 border-dashed border-dark-teal hover:border-dark-teal/90 bg-beige/10 hover:bg-beige/25 text-dark-teal rounded-lg p-6 cursor-pointer text-center gap-3 transition-colors shadow-sm active:scale-[0.98]"
                style={{ minHeight: '140px' }}
              >
                <div className="p-3 bg-emerald-100 rounded-full text-emerald-800 border border-emerald-250">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-xl">Use Mobile Camera</div>
                  <div className="text-sm text-dark-teal mt-1">Open camera and snap photo instantly</div>
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
                className="flex flex-col items-center justify-center border-3 border-dashed border-air-force hover:border-air-force/90 bg-air-force/5 hover:bg-air-force/10 text-dark-teal rounded-lg p-6 text-center gap-3 transition-colors shadow-sm active:scale-[0.98]"
                style={{ minHeight: '140px' }}
              >
                <div className="p-3 bg-amber-100 rounded-full text-amber-800 border border-amber-250">
                  <Laptop className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-xl">Use Web Browser Cam</div>
                  <div className="text-sm text-air-force mt-1">Show camera preview right here on screen</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
