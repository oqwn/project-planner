import React, { useState, useRef, useEffect } from 'react';
import { CodeEditor } from './CodeEditor';
import './MeetingRoom.css';

interface MeetingRoomProps {
  meeting: {
    id: string;
    title: string;
    code: string;
  };
  onLeave: () => void;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  meeting,
  onLeave,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [viewMode, setViewMode] = useState<'cv' | 'code'>('code');
  const [cvContent, setCvContent] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCvContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleLeave = () => {
    stopCamera();
    onLeave();
  };

  return (
    <div className="meeting-room">
      <div className="meeting-header">
        <div className="meeting-info">
          <h2>{meeting.title}</h2>
          <span className="meeting-code">Code: {meeting.code}</span>
        </div>
        <button className="leave-btn" onClick={handleLeave}>
          Leave Meeting
        </button>
      </div>

      <div className="meeting-content">
        <div className="video-section">
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`video-stream ${!isCameraOn ? 'hidden' : ''}`}
            />
            {!isCameraOn && (
              <div className="camera-off-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3L21 21M9 9.5V13L16 18V11L23 16V8L16 13V6C16 5.448 15.552 5 15 5H9.5M5 5H5C4.448 5 4 5.448 4 6V18C4 18.552 4.448 19 5 19H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p>Camera is off</p>
              </div>
            )}
          </div>

          <div className="video-controls">
            <button
              className={`control-btn ${!isCameraOn ? 'off' : ''}`}
              onClick={toggleCamera}
            >
              {isCameraOn ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 10L23 5V19L16 14M2 6C2 5.448 2.448 5 3 5H15C15.552 5 16 5.448 16 6V18C16 18.552 15.552 19 15 19H3C2.448 19 2 18.552 2 18V6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3L21 21M9 9.5V13L16 18V11L23 16V8L16 13V6C16 5.448 15.552 5 15 5H9.5M5 5H5C4.448 5 4 5.448 4 6V18C4 18.552 4.448 19 5 19H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            <button
              className={`control-btn ${!isMicOn ? 'off' : ''}`}
              onClick={toggleMic}
            >
              {isMicOn ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 1C10.343 1 9 2.343 9 4V12C9 13.657 10.343 15 12 15C13.657 15 15 13.657 15 12V4C15 2.343 13.657 1 12 1Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17 12C17 14.761 14.761 17 12 17C9.239 17 7 14.761 7 12M12 17V21M8 21H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3L21 21M15 9.5V4C15 2.343 13.657 1 12 1C10.343 1 9 2.343 9 4V12L15 18V12M7 12C7 14.761 9.239 17 12 17C12.5 17 13 16.9 13.5 16.7M12 17V21M8 21H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="work-section">
          <div className="work-tabs">
            <button
              className={`tab ${viewMode === 'code' ? 'active' : ''}`}
              onClick={() => setViewMode('code')}
            >
              Code Editor
            </button>
            <button
              className={`tab ${viewMode === 'cv' ? 'active' : ''}`}
              onClick={() => setViewMode('cv')}
            >
              CV/Resume
            </button>
          </div>

          <div className="work-content">
            {viewMode === 'code' ? (
              <CodeEditor />
            ) : (
              <div className="cv-viewer">
                {cvContent ? (
                  <div className="cv-content">
                    <pre>{cvContent}</pre>
                  </div>
                ) : (
                  <div className="cv-upload">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 13H15M12 10V16M21 7V17C21 19.209 19.209 21 17 21H7C4.791 21 3 19.209 3 17V7C3 4.791 4.791 3 7 3H12L14 6H17C19.209 6 21 7.791 21 10V7Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <p>Upload your CV/Resume</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      className="btn-secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
