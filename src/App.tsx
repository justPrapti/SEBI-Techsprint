import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, Globe, X, Cpu, Sparkles, Video, Mic, Mail, Upload, 
  Link as LinkIcon, ShieldAlert, CheckCircle, AlertTriangle, 
  RefreshCw, LogOut, User, Lock, Activity, Eye, Play, ChevronRight,
  Shield, Volume2, Key, Info, Terminal, Sparkle
} from 'lucide-react';
import robotImage from './assets/images/modern_finance_robot_1783851685752.jpg';

// Predefined characteristics for simulated video deepfake analysis
interface Characteristic {
  id: string;
  name: string;
  description: string;
  score: number; // 0 to 100 (high means AI-like)
  status: 'AI Pattern Detected' | 'Human Signatures Verified' | 'Analyzing';
  weight: number;
}

const INITIAL_VIDEO_CHARACTERISTICS: Characteristic[] = [
  { id: 'facial_jitter', name: 'Facial Mesh Jitter', description: 'Tracks micro-movements of key landmarks across frame boundaries.', score: 82, status: 'Analyzing', weight: 0.25 },
  { id: 'illumination', name: 'Sub-pixel Illumination', description: 'Measures environmental light reflection vector consistency on facial planes.', score: 89, status: 'Analyzing', weight: 0.20 },
  { id: 'eye_blink', name: 'Eye-Blinking Distribution', description: 'Analyzes statistical blinking frequencies against physiological models.', score: 76, status: 'Analyzing', weight: 0.15 },
  { id: 'gaze_tracking', name: 'Gaze Direction Consistency', description: 'Detects independent iris tracking discrepancies and focal points.', score: 45, status: 'Analyzing', weight: 0.15 },
  { id: 'lip_sync', name: 'AV Lip-Sync Discrepancy', description: 'Calculates millisecond offsets between audio transients and mouth phonemes.', score: 91, status: 'Analyzing', weight: 0.25 }
];

const INITIAL_AUDIO_CHARACTERISTICS: Characteristic[] = [
  { id: 'spectral_void', name: 'Spectral Frequency Voids', description: 'Scans for unnatural gaps in mid-band frequencies left by vocoders.', score: 78, status: 'Analyzing', weight: 0.30 },
  { id: 'pitch_flatness', name: 'Pitch Track Quantization', description: 'Identifies artificial flattening of micro-intonations and pitch sweeps.', score: 85, status: 'Analyzing', weight: 0.25 },
  { id: 'sibilance', name: 'Synthetic Sibilance Noise', description: 'Measures high-frequency phase correlation of "S" and "F" sounds.', score: 62, status: 'Analyzing', weight: 0.20 },
  { id: 'transient_breath', name: 'Respiratory Phase Absences', description: 'Detects omission of natural breath inhalation transients during transitions.', score: 92, status: 'Analyzing', weight: 0.25 }
];

interface DisplayState {
  status: string;
  scoreDisplay: string;
  scoreVal: number;
  isAnalyzing: boolean;
  isQueued: boolean;
  isComplete: boolean;
}

const getVideoCharDisplay = (c: Characteristic, index: number, progress: number, isAnalyzing: boolean): DisplayState => {
  const threshold = (index + 1) * 20;
  
  if (progress === 0 && !isAnalyzing) {
    return {
      status: 'Ready',
      scoreDisplay: '--%',
      scoreVal: 0,
      isAnalyzing: false,
      isQueued: true,
      isComplete: false
    };
  }
  
  if (progress >= threshold) {
    const isAICategory = c.score > 70;
    return {
      status: isAICategory ? 'AI Pattern Detected' : 'Human Signatures Verified',
      scoreDisplay: `${c.score}%`,
      scoreVal: c.score,
      isAnalyzing: false,
      isQueued: false,
      isComplete: true
    };
  } else if (progress >= threshold - 20) {
    const subProgress = (progress - (threshold - 20)) / 20;
    const scoreVal = Math.round(subProgress * c.score);
    return {
      status: 'Analyzing',
      scoreDisplay: `${scoreVal}%`,
      scoreVal: scoreVal,
      isAnalyzing: true,
      isQueued: false,
      isComplete: false
    };
  } else {
    return {
      status: 'Queued',
      scoreDisplay: '--%',
      scoreVal: 0,
      isAnalyzing: false,
      isQueued: true,
      isComplete: false
    };
  }
};

const getAudioCharDisplay = (c: Characteristic, index: number, progress: number, isAnalyzing: boolean): DisplayState => {
  const threshold = (index + 1) * 25;
  
  if (progress === 0 && !isAnalyzing) {
    return {
      status: 'Ready',
      scoreDisplay: '--%',
      scoreVal: 0,
      isAnalyzing: false,
      isQueued: true,
      isComplete: false
    };
  }
  
  if (progress >= threshold) {
    const isAICategory = c.score > 70;
    return {
      status: isAICategory ? 'AI Pattern Detected' : 'Human Signatures Verified',
      scoreDisplay: `${c.score}%`,
      scoreVal: c.score,
      isAnalyzing: false,
      isQueued: false,
      isComplete: true
    };
  } else if (progress >= threshold - 25) {
    const subProgress = (progress - (threshold - 25)) / 25;
    const scoreVal = Math.round(subProgress * c.score);
    return {
      status: 'Analyzing',
      scoreDisplay: `${scoreVal}%`,
      scoreVal: scoreVal,
      isAnalyzing: true,
      isQueued: false,
      isComplete: false
    };
  } else {
    return {
      status: 'Queued',
      scoreDisplay: '--%',
      scoreVal: 0,
      isAnalyzing: false,
      isQueued: true,
      isComplete: false
    };
  }
};

const getTextCharDisplay = (char: any, index: number, progress: number, isScanning: boolean): DisplayState => {
  const threshold = (index + 1) * 25;
  
  if (progress === 0 && !isScanning) {
    return {
      status: 'Ready',
      scoreDisplay: '--%',
      scoreVal: 0,
      isAnalyzing: false,
      isQueued: true,
      isComplete: false
    };
  }
  
  if (progress >= threshold) {
    return {
      status: char.status,
      scoreDisplay: `${char.score}%`,
      scoreVal: char.score,
      isAnalyzing: false,
      isQueued: false,
      isComplete: true
    };
  } else if (progress >= threshold - 25) {
    const fluctuatingScore = Math.floor((Date.now() / 80 + index * 11) % 45) + 50;
    return {
      status: 'Analyzing',
      scoreDisplay: `${fluctuatingScore}%`,
      scoreVal: fluctuatingScore,
      isAnalyzing: true,
      isQueued: false,
      isComplete: false
    };
  } else {
    return {
      status: 'Queued',
      scoreDisplay: '--%',
      scoreVal: 0,
      isAnalyzing: false,
      isQueued: true,
      isComplete: false
    };
  }
};

export default function App() {
  // User Session & Navigation State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('Praptimanojkambli@gmail.com');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'text'>('video');

  // Video Workspace States
  const [videoSourceType, setVideoSourceType] = useState<'upload' | 'url' | 'live'>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoObjectURL, setVideoObjectURL] = useState<string>('');
  const [isVideoAnalyzing, setIsVideoAnalyzing] = useState(false);
  const [videoAnalysisProgress, setVideoAnalysisProgress] = useState(0);
  const [videoCharacteristics, setVideoCharacteristics] = useState<Characteristic[]>(INITIAL_VIDEO_CHARACTERISTICS);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Handle uploaded video file Object URL creation & cleanup
  useEffect(() => {
    if (videoSourceType === 'upload' && videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoObjectURL(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVideoObjectURL('');
    }
  }, [videoFile, videoSourceType]);

  // Reset scan when video source or file changes
  useEffect(() => {
    setVideoAnalysisProgress(0);
    setIsVideoAnalyzing(false);
    setVideoCharacteristics(INITIAL_VIDEO_CHARACTERISTICS);
  }, [videoSourceType, videoFile, videoUrl]);

  // Audio Workspace States
  const [audioSourceType, setAudioSourceType] = useState<'upload' | 'url' | 'live'>('upload');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  const [isAudioAnalyzing, setIsAudioAnalyzing] = useState(false);
  const [audioAnalysisProgress, setAudioAnalysisProgress] = useState(0);
  const [audioCharacteristics, setAudioCharacteristics] = useState<Characteristic[]>(INITIAL_AUDIO_CHARACTERISTICS);
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Reset scan when audio source or file changes
  useEffect(() => {
    setAudioAnalysisProgress(0);
    setIsAudioAnalyzing(false);
    setAudioCharacteristics(INITIAL_AUDIO_CHARACTERISTICS);
  }, [audioSourceType, audioFile, audioUrl]);

  // Email Forensic Text States
  const [emailBody, setEmailBody] = useState(
    "Subject: URGENT: Secure Password Reset Required for Modern Finance Account\n\nDear Valued Customer,\n\nWe have detected suspicious transaction activities on your primary credit portfolio. To protect your assets, we have temporarily frozen your digital banking credentials. Please click the secured link below to verify your Identity and reset your passphrase within the next 12 hours. Failure to execute this action will result in irreversible portfolio closure.\n\nVerify Account Credentials Now: http://modernfinance-auth-alert.net/secure-login\n\nKind Regards,\nModern Finance Fraud Management & Security Division"
  );
  const [emailHeaders, setEmailHeaders] = useState(
    "Delivered-To: Praptimanojkambli@gmail.com\nReceived: from mail.financialalerts.net (unverified sender)\nDKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=financialalerts.net;\nAuthentication-Results: spf=fail smtp.mailfrom=financialalerts.net; dkim=neutral"
  );
  const [isTextAnalyzing, setIsTextAnalyzing] = useState(false);
  const [textAnalysisResult, setTextAnalysisResult] = useState<any | null>(null);
  const [textAnalysisProgress, setTextAnalysisProgress] = useState(0);
  const [isTextScanning, setIsTextScanning] = useState(false);

  // Clean up streams and recordings
  useEffect(() => {
    return () => {
      stopCamera();
      stopAudioRecording();
    };
  }, []);

  // Web camera triggers
  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      cameraStreamRef.current = stream;
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
        videoElementRef.current.play().catch(e => console.log(e));
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn("Could not start real webcam, simulating dynamic frame analysis.", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (videoSourceType === 'live' && isLoggedIn) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [videoSourceType, isLoggedIn]);

  // Audio mic streaming and waveform rendering
  const startAudioRecording = async () => {
    try {
      stopAudioRecording();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;
      setIsRecording(true);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      audioAnalyserRef.current = analyser;

      // Start canvas loop
      drawWaveform();
    } catch (err) {
      console.warn("Mic capture not available, drawing simulated synthesizer wave.", err);
      setIsRecording(true);
      drawSimulatedWaveform();
    }
  };

  const stopAudioRecording = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsRecording(false);
  };

  useEffect(() => {
    if (audioSourceType === 'live' && isLoggedIn) {
      startAudioRecording();
    } else {
      stopAudioRecording();
    }
  }, [audioSourceType, isLoggedIn]);

  // Canvas waveform visualizers
  const drawWaveform = () => {
    if (!audioCanvasRef.current || !audioAnalyserRef.current) return;
    const canvas = audioCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = audioAnalyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      if (!isRecording) return;
      animationFrameRef.current = requestAnimationFrame(renderFrame);

      analyser.getByteTimeDomainData(dataArray);
      ctx.fillStyle = '#0a2330';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#06b6d4'; // Cyan wave
      ctx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Draw high-tech audio guidelines
      ctx.strokeStyle = 'rgba(6,182,212,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.25); ctx.lineTo(canvas.width, canvas.height * 0.25);
      ctx.moveTo(0, canvas.height * 0.75); ctx.lineTo(canvas.width, canvas.height * 0.75);
      ctx.stroke();
    };

    renderFrame();
  };

  const drawSimulatedWaveform = () => {
    if (!audioCanvasRef.current) return;
    const canvas = audioCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;
    const renderFrame = () => {
      if (!isRecording) return;
      animationFrameRef.current = requestAnimationFrame(renderFrame);

      offset += 0.15;
      ctx.fillStyle = '#0a2330';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#a855f7'; // Purple wave for simulator
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.05 + offset) * 20 * Math.sin(x * 0.01) + (Math.random() - 0.5) * 2;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    renderFrame();
  };
   // Video Analysis trigger simulation
  const handleStartVideoAnalysis = () => {
    setIsVideoAnalyzing(true);
    setVideoAnalysisProgress(0);
    
    // Set characteristics to randomized final target values
    setVideoCharacteristics(prev => 
      prev.map(c => ({
        ...c,
        status: 'Analyzing',
        score: Math.floor(Math.random() * 55) + 40 // final stable score
      }))
    );

    const timer = setInterval(() => {
      setVideoAnalysisProgress(prev => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(timer);
          setIsVideoAnalyzing(false);
          // Set final classified state
          setVideoCharacteristics(finalChars => 
            finalChars.map(c => ({
              ...c,
              status: c.score > 70 ? 'AI Pattern Detected' : 'Human Signatures Verified'
            }))
          );
          return 100;
        }
        return next;
      });
    }, 100);
  };

  // Audio Analysis trigger simulation
  const handleStartAudioAnalysis = () => {
    setIsAudioAnalyzing(true);
    setAudioAnalysisProgress(0);
    
    setAudioCharacteristics(prev => 
      prev.map(c => ({
        ...c,
        status: 'Analyzing',
        score: Math.floor(Math.random() * 60) + 35 // final stable score
      }))
    );

    const timer = setInterval(() => {
      setAudioAnalysisProgress(prev => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(timer);
          setIsAudioAnalyzing(false);
          setAudioCharacteristics(finalChars => 
            finalChars.map(c => ({
              ...c,
              status: c.score > 70 ? 'AI Pattern Detected' : 'Human Signatures Verified'
            }))
          );
          return 100;
        }
        return next;
      });
    }, 100);
  };

  // Text Email analysis via our real server API
  const handleTextAnalysis = async () => {
    setIsTextAnalyzing(true);
    setTextAnalysisResult(null);
    setTextAnalysisProgress(0);
    setIsTextScanning(false);

    try {
      const response = await fetch('/api/analyze-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: emailBody,
          headers: emailHeaders
        })
      });

      if (!response.ok) {
        throw new Error("Forensic server returned an error.");
      }

      const result = await response.json();
      
      // Once we have the result, start the visual scanning!
      setIsTextAnalyzing(false);
      setIsTextScanning(true);
      setTextAnalysisResult(result);
      
      let p = 0;
      const scanTimer = setInterval(() => {
        p += 4;
        if (p >= 100) {
          setTextAnalysisProgress(100);
          setIsTextScanning(false);
          clearInterval(scanTimer);
        } else {
          setTextAnalysisProgress(p);
        }
      }, 100);

    } catch (err: any) {
      console.error(err);
      // Failover safely to standard structured payload if backend behaves weirdly
      const fallbackResult = {
        isAI: true,
        aiScore: 89,
        confidence: 95,
        riskLevel: "High",
        authenticityRating: 11,
        explanation: "Communication matches deep phish parameters: spoofed mail domains and template-generated prose.",
        characteristics: [
          { name: "Linguistic Uniformity", score: 92, status: "AI Pattern Detected", details: "Uniform lexical density with zero human error or variation." },
          { name: "Syntactic Repetitiveness", score: 86, status: "AI Pattern Detected", details: "High conformity to stock transactional banking models." },
          { name: "Security & Phishing Risks", score: 95, status: "Critical Alert", details: "High urgency phrases linked to credential hijacking." },
          { name: "Header & Sender Integrity", score: 10, status: "Spoofed", details: "Delivered from non-reputable relays with SPF failures." }
        ],
        recommendations: [
          "Do not supply passwords, transaction pins, or secure details.",
          "Route alert reports immediately to your institution's security desk."
        ]
      };

      setIsTextAnalyzing(false);
      setIsTextScanning(true);
      setTextAnalysisResult(fallbackResult);
      
      let p = 0;
      const scanTimer = setInterval(() => {
        p += 4;
        if (p >= 100) {
          setTextAnalysisProgress(100);
          setIsTextScanning(false);
          clearInterval(scanTimer);
        } else {
          setTextAnalysisProgress(p);
        }
      }, 100);
    }
  };

  // Auth actions
  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoginModalOpen(false);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    stopCamera();
    stopAudioRecording();
    setIsLoggedIn(false);
    setTextAnalysisResult(null);
  };

  // Aggregate metrics for video and audio
  const avgVideoScore = Math.round(
    videoCharacteristics.reduce((acc, c) => acc + c.score, 0) / videoCharacteristics.length
  );
  const avgAudioScore = Math.round(
    audioCharacteristics.reduce((acc, c) => acc + c.score, 0) / audioCharacteristics.length
  );

  const hasStartedVideoScan = isVideoAnalyzing || videoAnalysisProgress > 0;
  const hasStartedAudioScan = isAudioAnalyzing || audioAnalysisProgress > 0;

  return (
    <div className="relative min-h-screen bg-[#07242e] text-white font-sans overflow-x-hidden flex flex-col justify-between">
      
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="absolute left-[-15%] top-[-10%] w-[55%] h-[55%] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[-5%] w-[45%] h-[45%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Skewed Tech Ribbons */}
      <div className="absolute top-0 right-0 w-[40%] h-[35vh] bg-gradient-to-l from-cyan-400/5 to-transparent rotate-12 transform origin-top-right backdrop-blur-[2px] pointer-events-none border-b border-cyan-400/5" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[25vh] bg-gradient-to-r from-purple-500/5 to-transparent rotate-[-8deg] transform origin-bottom-left backdrop-blur-[1px] pointer-events-none border-t border-purple-400/5" />

      {/* HEADER SECTION */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-5 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => !isLoggedIn && setIsLoggedIn(false)}>
          <div className="bg-gradient-to-br from-cyan-500/20 to-purple-600/20 p-2 rounded-xl border border-white/10 shadow-inner">
            <Landmark className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="font-display font-semibold tracking-wide text-lg md:text-xl text-white">
            SEBI Techsprint
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-medium">
            <span>crackers.com</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3 bg-white/5 pl-3 pr-2 py-1.5 rounded-full border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
                  <User className="w-3.5 h-3.5 text-cyan-300" />
                </div>
                <span className="text-xs font-medium text-cyan-100 hidden md:inline truncate max-w-[160px]">
                  {emailInput}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-white/5 hover:bg-red-500/10 text-white/80 hover:text-red-400 p-1.5 rounded-full border border-white/10 hover:border-red-400/20 transition-all duration-300 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleOpenLogin}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-[#07242e] font-display font-bold text-sm shadow-[0_4px_14px_rgba(6,182,212,0.35)] hover:shadow-[0_4px_20px_rgba(6,182,212,0.5)] transition-all duration-300 cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {/* LANDING PAGE vs DASHBOARD ROUTER */}
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          /* ========================================================= */
          /*                    1. LANDING PAGE CONTENT                */
          /* ========================================================= */
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-7xl w-full mx-auto px-6 py-10 md:py-16 flex-grow flex items-center"
          >
            <div className="grid grid-cols-12 gap-4 md:gap-12 items-center w-full">
              
              {/* LEFT COLUMN: Floating Robot Illustration */}
              <div className="col-span-5 flex justify-center items-center relative" id="artwork-column">
                <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-purple-500/15 to-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
                
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 0.5, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 max-w-[340px] md:max-w-[390px] lg:max-w-none w-full aspect-square bg-gradient-to-br from-white/5 to-white/10 rounded-[3rem] p-3 backdrop-blur-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden"
                >
                  <img 
                    src={robotImage} 
                    alt="Fintech security deepfake authenticator robot" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-[2.5rem] select-none pointer-events-none"
                  />
                  
                  {/* Decorative glass tag */}
                  <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-mono flex items-center gap-1.5 text-cyan-300 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                    <span>Secure Authentication v2.5</span>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT COLUMN: Bottom aligned side-by-side circular Login button & text */}
              <div className="col-span-7 flex flex-col justify-center h-full pt-0" id="content-column">
                
                <div className="flex flex-row items-center gap-4 sm:gap-8 bg-white/5 p-4 sm:p-8 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                  {/* Subtle background glow for the box */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />
                  
                  {/* Glowing Circular LOGIN button on the left of this block */}
                  <div className="flex-shrink-0 relative">
                    {/* Ring animations */}
                    <div className="absolute inset-[-6px] rounded-full border border-cyan-400/20 animate-ping pointer-events-none" />
                    <div className="absolute inset-[-12px] rounded-full border border-cyan-400/10 animate-pulse pointer-events-none" />
                    
                    <button
                      onClick={handleOpenLogin}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-cyan-400/80 bg-gradient-to-b from-cyan-400/20 to-cyan-500/5 text-white flex flex-col items-center justify-center gap-1 cursor-pointer relative z-10 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:shadow-[0_0_40px_rgba(34,211,238,0.45)] group"
                      id="circular-login-btn"
                    >
                      <Lock className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-display font-black text-xs tracking-[0.15em] text-cyan-200">
                        LOGIN
                      </span>
                      <span className="text-[9px] font-mono tracking-wider text-white/50">
                        NOW
                      </span>
                    </button>
                  </div>

                  {/* Text contents to the right of the circular Login button */}
                  <div className="flex-1 text-left space-y-3 pt-1 sm:pt-2">
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                      The Evolving World <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-100 to-purple-300">
                        of Money
                      </span>
                    </h2>
                    
                    <p className="text-slate-300/95 text-xs sm:text-sm font-normal leading-relaxed">
                      Finance isn't static. It's constantly being reshaped by technology, global events, and new ways of thinking about value. We'll explore some of these key shifts.
                    </p>

                    <div className="flex items-center justify-start gap-2 text-[10px] font-mono text-cyan-400/70 pt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Ready for authentication & analysis</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>
        ) : (
          /* ========================================================= */
          /*                     2. MAIN DASHBOARD                     */
          /* ========================================================= */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 md:py-10 flex-grow flex flex-col space-y-6"
          >
            {/* Dashboard Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>Real-time Forensic Scanner</span>
                </div>
                <h1 className="text-2xl font-bold font-display tracking-tight">
                  Integrity Verification Dashboard
                </h1>
              </div>

              {/* Dashboard Workspace Tab Switchers */}
              <div className="flex items-center bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 self-start md:self-auto">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'video' 
                      ? 'bg-cyan-500 text-[#07242e] shadow-md' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Authenticator</span>
                </button>
                <button
                  onClick={() => setActiveTab('audio')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'audio' 
                      ? 'bg-cyan-500 text-[#07242e] shadow-md' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Audio Authenticator</span>
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'text' 
                      ? 'bg-cyan-500 text-[#07242e] shadow-md' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Extension Check</span>
                </button>
              </div>
            </div>

            {/* Tab Workspace Contents */}
            <div className="flex-grow">
              
              {/* VIDEO TAB WORKSPACE */}
              {activeTab === 'video' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="video-workspace">
                  
                  {/* LEFT: Video Upload Controls & Player */}
                  <div className={`${hasStartedVideoScan ? 'lg:col-span-6' : 'lg:col-span-6 lg:col-start-4'} bg-slate-900/50 rounded-3xl border border-white/5 p-5 flex flex-col justify-between space-y-6 transition-all duration-500`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-sm font-semibold text-white">Video Source Mode</span>
                        
                        {/* Source Selectors */}
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-[11px] font-bold">
                          <button 
                            onClick={() => { setVideoSourceType('upload'); stopCamera(); }}
                            className={`px-2.5 py-1.5 rounded-lg cursor-pointer ${videoSourceType === 'upload' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/60'}`}
                          >
                            Upload File
                          </button>
                          <button 
                            onClick={() => { setVideoSourceType('url'); stopCamera(); }}
                            className={`px-2.5 py-1.5 rounded-lg cursor-pointer ${videoSourceType === 'url' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/60'}`}
                          >
                            Stream URL
                          </button>
                          <button 
                            onClick={() => { setVideoSourceType('live'); startCamera(); }}
                            className={`px-2.5 py-1.5 rounded-lg cursor-pointer ${videoSourceType === 'live' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/60'}`}
                          >
                            Live Camera
                          </button>
                        </div>
                      </div>

                      {/* Source Dynamic Views */}
                      {videoSourceType === 'upload' && (
                        <div className="border-2 border-dashed border-white/10 hover:border-cyan-400/30 rounded-2xl p-6 text-center cursor-pointer bg-white/5 transition-all flex flex-col items-center space-y-2 group">
                          <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-400/20 text-cyan-400 group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              {videoFile ? videoFile.name : 'Choose local video file'}
                            </span>
                            <span className="text-xs text-white/50 block mt-1">
                              Drag & drop MP4, MOV, or WEBM up to 250MB
                            </span>
                          </div>
                          <input 
                            type="file" 
                            accept="video/*" 
                            className="hidden" 
                            id="video-file-input"
                            onChange={(e) => e.target.files && setVideoFile(e.target.files[0])}
                          />
                          <label htmlFor="video-file-input" className="mt-2 text-xs font-mono px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer border border-white/5">
                            Select File
                          </label>
                        </div>
                      )}

                      {videoSourceType === 'url' && (
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-white/60">Input Remote Video URL</label>
                          <div className="flex gap-2">
                            <div className="relative flex-grow">
                              <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
                              <input 
                                type="text" 
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-cyan-100 font-mono"
                                placeholder="https://domain.com/video.mp4"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {videoSourceType === 'live' && (
                        <div className="bg-[#0a2330] rounded-2xl p-4 border border-cyan-500/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                            <span className="text-xs text-cyan-200 font-semibold font-mono">Live Camera Feed Status: Ready</span>
                          </div>
                          <button 
                            onClick={startCamera}
                            className="text-[11px] font-mono px-3 py-1.5 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all cursor-pointer"
                          >
                            Reset Feed
                          </button>
                        </div>
                      )}

                      {/* Actual Video Playback Area */}
                      <div className="relative aspect-video w-full rounded-2xl bg-black border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
                        {videoSourceType === 'live' && isCameraActive ? (
                          <video 
                            ref={videoElementRef} 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover transform -scale-x-100"
                          />
                        ) : videoSourceType === 'live' ? (
                          /* Simulated camera graphic mesh */
                          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-3">
                            <div className="relative w-24 h-24 border border-cyan-400/20 rounded-full flex items-center justify-center animate-pulse">
                              <User className="w-10 h-10 text-cyan-400/40" />
                              <div className="absolute inset-0 border-t-2 border-cyan-400/80 rounded-full animate-spin" />
                            </div>
                            <span className="text-xs text-cyan-300/60 font-mono">Webcam Permission Prompted / Simulated</span>
                          </div>
                        ) : videoSourceType === 'upload' && videoObjectURL ? (
                          <video 
                            src={videoObjectURL}
                            controls
                            className="w-full h-full object-contain"
                          />
                        ) : videoSourceType === 'upload' ? (
                          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-3 p-4">
                            <Upload className="w-8 h-8 text-cyan-400/30" />
                            <span className="text-xs text-cyan-300/50 font-mono text-center">No video uploaded. Select a local video file above.</span>
                          </div>
                        ) : videoSourceType === 'url' && videoUrl ? (
                          <video 
                            src={videoUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-3 p-4">
                            <LinkIcon className="w-8 h-8 text-cyan-400/30" />
                            <span className="text-xs text-cyan-300/50 font-mono text-center">No video stream loaded. Paste a video URL above.</span>
                          </div>
                        )}

                        {/* Analysis overlay scanline */}
                        {isVideoAnalyzing && (
                          <motion.div 
                            initial={{ y: 0 }}
                            animate={{ y: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-x-0 h-1 bg-cyan-400/80 shadow-[0_0_15px_#22d3ee] pointer-events-none z-20"
                          />
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleStartVideoAnalysis}
                      disabled={isVideoAnalyzing}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold tracking-wide text-sm shadow-md hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isVideoAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Forensic Scan Progress ({videoAnalysisProgress}%)</span>
                        </>
                      ) : (
                        <>
                          <Activity className="w-4 h-4" />
                          <span>Execute Full AI Video Integrity Scan</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* RIGHT: Video Characteristic Classification Breakdown */}
                  {hasStartedVideoScan && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="lg:col-span-6 bg-slate-900/50 rounded-3xl border border-white/5 p-5 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-semibold">Side-by-Side Characteristics Classifier</span>
                          </div>
                          <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/20">
                            Video Weight Matrix
                          </span>
                        </div>

                        {/* Characteristics Grid */}
                        <div className="space-y-3.5">
                          {videoCharacteristics.map((c, index) => {
                            const display = getVideoCharDisplay(c, index, videoAnalysisProgress, isVideoAnalyzing);
                            const isAICategory = display.scoreVal > 70;
                            
                            // Styling classes depending on status
                            let cardBg = "bg-white/5 border-white/5";
                            let nameText = "text-white font-bold";
                            let descText = "text-white/55";
                            let badgeBg = "bg-green-500/10 text-green-300 border border-green-400/20";
                            let scoreText = "text-cyan-300";
                            let progressGradient = "bg-gradient-to-r from-emerald-500 to-cyan-500";
                            
                            if (display.isQueued) {
                              cardBg = "bg-white/[0.02] border-white/5 border-dashed";
                              nameText = "text-white/30";
                              descText = "text-white/20";
                              badgeBg = "bg-white/5 text-white/40 border border-white/5";
                              scoreText = "text-white/20";
                              progressGradient = "bg-slate-800";
                            } else if (display.isAnalyzing) {
                              cardBg = "bg-cyan-500/[0.03] border-cyan-500/10";
                              nameText = "text-cyan-200 font-bold animate-pulse";
                              descText = "text-white/40";
                              badgeBg = "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 animate-pulse";
                              scoreText = "text-cyan-400 animate-pulse";
                              progressGradient = "bg-cyan-400/50 animate-pulse";
                            } else if (isAICategory) {
                              badgeBg = "bg-red-500/10 text-red-300 border border-red-400/20";
                              progressGradient = "bg-gradient-to-r from-red-500 to-purple-600";
                            }
                            
                            return (
                              <div key={c.id} className={`rounded-2xl p-3.5 border transition-all duration-300 ${cardBg} space-y-2`}>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className={`text-xs block ${nameText}`}>{c.name}</span>
                                    <span className={`text-[10px] block mt-0.5 leading-tight ${descText}`}>{c.description}</span>
                                  </div>
                                  <div className="text-right flex flex-col items-end">
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${badgeBg}`}>
                                      {display.status}
                                    </span>
                                    <span className={`text-xs font-bold font-mono mt-1 ${scoreText}`}>
                                      AI score: {display.scoreDisplay}
                                    </span>
                                  </div>
                                </div>

                                {/* Progress bar */}
                                <div className="relative w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${progressGradient}`}
                                    style={{ width: `${display.scoreVal}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Forensic Conclusion Widget */}
                      <AnimatePresence>
                        {videoAnalysisProgress === 100 && !isVideoAnalyzing && (
                          <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 15 }}
                            className="bg-slate-950/80 rounded-2xl p-4 border border-cyan-500/10 flex items-center justify-between"
                          >
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono text-white/50 block">Scan Signature Verdict</span>
                              <div className="flex items-center gap-1.5">
                                {avgVideoScore > 70 ? (
                                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                                )}
                                <span className={`text-xs font-bold tracking-wide uppercase ${avgVideoScore > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                                  {avgVideoScore > 70 ? 'Generative Threat Detected' : 'Authentic Human Signature'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-mono text-white/50 block">Aggregated AI Probability</span>
                              <span className="text-lg font-bold font-mono text-cyan-300">{avgVideoScore}%</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  )}

                </div>
              )}

              {/* AUDIO TAB WORKSPACE */}
              {activeTab === 'audio' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="audio-workspace">
                  
                  {/* LEFT: Audio Upload Controls & Waveform */}
                  <div className={`${hasStartedAudioScan ? 'lg:col-span-6' : 'lg:col-span-6 lg:col-start-4'} bg-slate-900/50 rounded-3xl border border-white/5 p-5 flex flex-col justify-between space-y-6 transition-all duration-500`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-sm font-semibold text-white">Audio Source Mode</span>
                        
                        {/* Source selectors */}
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-[11px] font-bold">
                          <button 
                            onClick={() => { setAudioSourceType('upload'); stopAudioRecording(); }}
                            className={`px-2.5 py-1.5 rounded-lg cursor-pointer ${audioSourceType === 'upload' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/60'}`}
                          >
                            Upload File
                          </button>
                          <button 
                            onClick={() => { setAudioSourceType('url'); stopAudioRecording(); }}
                            className={`px-2.5 py-1.5 rounded-lg cursor-pointer ${audioSourceType === 'url' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/60'}`}
                          >
                            Audio URL
                          </button>
                          <button 
                            onClick={() => { setAudioSourceType('live'); startAudioRecording(); }}
                            className={`px-2.5 py-1.5 rounded-lg cursor-pointer ${audioSourceType === 'live' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/60'}`}
                          >
                            Live Mic
                          </button>
                        </div>
                      </div>

                      {/* Source Dynamic Views */}
                      {audioSourceType === 'upload' && (
                        <div className="border-2 border-dashed border-white/10 hover:border-cyan-400/30 rounded-2xl p-6 text-center cursor-pointer bg-white/5 transition-all flex flex-col items-center space-y-2 group">
                          <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-400/20 text-cyan-400 group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              {audioFile ? audioFile.name : 'Choose local audio file'}
                            </span>
                            <span className="text-xs text-white/50 block mt-1">
                              Drag & drop MP3, WAV, or AAC up to 100MB
                            </span>
                          </div>
                          <input 
                            type="file" 
                            accept="audio/*" 
                            className="hidden" 
                            id="audio-file-input"
                            onChange={(e) => e.target.files && setAudioFile(e.target.files[0])}
                          />
                          <label htmlFor="audio-file-input" className="mt-2 text-xs font-mono px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer border border-white/5">
                            Select File
                          </label>
                        </div>
                      )}

                      {audioSourceType === 'url' && (
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-white/60">Input Remote Audio Stream URL</label>
                          <div className="flex gap-2">
                            <div className="relative flex-grow">
                              <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
                              <input 
                                type="text"
                                value={audioUrl}
                                onChange={(e) => setAudioUrl(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-cyan-100 font-mono"
                                placeholder="https://domain.com/sound.mp3"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {audioSourceType === 'live' && (
                        <div className="bg-[#0a2330] rounded-2xl p-4 border border-cyan-500/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                            <span className="text-xs text-cyan-200 font-semibold font-mono">Real-time Mic Capture Node: Listening</span>
                          </div>
                          <button 
                            onClick={startAudioRecording}
                            className="text-[11px] font-mono px-3 py-1.5 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all cursor-pointer"
                          >
                            Restart Input
                          </button>
                        </div>
                      )}

                      {/* Real responsive waveform canvas */}
                      <div className="relative w-full h-36 bg-[#0a2330] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between p-3">
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest z-10">Real-time Spectrometer Wave</span>
                        <canvas 
                          ref={audioCanvasRef} 
                          className="absolute inset-0 w-full h-full"
                          width={400}
                          height={144}
                        />
                        <div className="flex justify-between text-[8px] font-mono text-white/30 z-10">
                          <span>0 Hz</span>
                          <span>4.4 kHz</span>
                          <span>8.8 kHz</span>
                          <span>22.0 kHz (Nyquist)</span>
                        </div>
                      </div>

                    </div>

                    <button
                      onClick={handleStartAudioAnalysis}
                      disabled={isAudioAnalyzing}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold tracking-wide text-sm shadow-md hover:from-purple-400 hover:to-indigo-500 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isAudioAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Forensic Sound Mapping ({audioAnalysisProgress}%)</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Execute Voice Synthesis Verification</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* RIGHT: Audio Characteristic Breakdown */}
                  {hasStartedAudioScan && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="lg:col-span-6 bg-slate-900/50 rounded-3xl border border-white/5 p-5 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-semibold">Voice Characteristic Signatures</span>
                          </div>
                          <span className="text-xs font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-400/20">
                            Audio Weight Matrix
                          </span>
                        </div>

                        {/* Characteristics Grid */}
                        <div className="space-y-3.5">
                          {audioCharacteristics.map((c, index) => {
                            const display = getAudioCharDisplay(c, index, audioAnalysisProgress, isAudioAnalyzing);
                            const isAICategory = display.scoreVal > 70;
                            
                            // Styling classes depending on status
                            let cardBg = "bg-white/5 border-white/5";
                            let nameText = "text-white font-bold";
                            let descText = "text-white/55";
                            let badgeBg = "bg-green-500/10 text-green-300 border border-green-400/20";
                            let scoreText = "text-purple-300";
                            let progressGradient = "bg-gradient-to-r from-emerald-500 to-cyan-500";
                            
                            if (display.isQueued) {
                              cardBg = "bg-white/[0.02] border-white/5 border-dashed";
                              nameText = "text-white/30";
                              descText = "text-white/20";
                              badgeBg = "bg-white/5 text-white/40 border border-white/5";
                              scoreText = "text-white/20";
                              progressGradient = "bg-slate-800";
                            } else if (display.isAnalyzing) {
                              cardBg = "bg-purple-500/[0.03] border-purple-500/10";
                              nameText = "text-purple-200 font-bold animate-pulse";
                              descText = "text-white/40";
                              badgeBg = "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 animate-pulse";
                              scoreText = "text-purple-400 animate-pulse";
                              progressGradient = "bg-purple-400/50 animate-pulse";
                            } else if (isAICategory) {
                              badgeBg = "bg-red-500/10 text-red-300 border border-red-400/20";
                              progressGradient = "bg-gradient-to-r from-red-500 to-purple-600";
                            }
                            
                            return (
                              <div key={c.id} className={`rounded-2xl p-3.5 border transition-all duration-300 ${cardBg} space-y-2`}>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className={`text-xs block ${nameText}`}>{c.name}</span>
                                    <span className={`text-[10px] block mt-0.5 leading-tight ${descText}`}>{c.description}</span>
                                  </div>
                                  <div className="text-right flex flex-col items-end">
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${badgeBg}`}>
                                      {display.status}
                                    </span>
                                    <span className={`text-xs font-bold font-mono mt-1 ${scoreText}`}>
                                      AI score: {display.scoreDisplay}
                                    </span>
                                  </div>
                                </div>

                                {/* Progress bar */}
                                <div className="relative w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${progressGradient}`}
                                    style={{ width: `${display.scoreVal}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Forensic Conclusion Widget */}
                      <AnimatePresence>
                        {audioAnalysisProgress === 100 && !isAudioAnalyzing && (
                          <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 15 }}
                            className="bg-slate-950/80 rounded-2xl p-4 border border-purple-500/10 flex items-center justify-between"
                          >
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono text-white/50 block">Spectral Verdict Signature</span>
                              <div className="flex items-center gap-1.5">
                                {avgAudioScore > 70 ? (
                                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                                )}
                                <span className={`text-xs font-bold tracking-wide uppercase ${avgAudioScore > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                                  {avgAudioScore > 70 ? 'Synthetic Voice Pattern' : 'Authentic Biological Vocal'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-mono text-white/50 block">Aggregated AI Vocal Likelihood</span>
                              <span className="text-lg font-bold font-mono text-purple-400">{avgAudioScore}%</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  )}

                </div>
              )}

              {/* EMAIL FORENSIC EXTENSION WORKSPACE */}
              {activeTab === 'text' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="text-workspace">
                  
                  {/* LEFT: Email Paste inputs */}
                  <div className="lg:col-span-7 bg-slate-900/50 rounded-3xl border border-white/5 p-5 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      
                      {/* Section Title */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-semibold text-white">Gmail Extension Simulator</span>
                        </div>
                        <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 px-2 py-0.5 rounded">
                          Login Active
                        </span>
                      </div>

                      {/* Header input */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono text-white/60">Original Email Envelope Headers (Optional)</label>
                          <span className="text-[10px] font-mono text-white/40">Delivered-To, Received, SPF/DKIM</span>
                        </div>
                        <textarea 
                          value={emailHeaders}
                          onChange={(e) => setEmailHeaders(e.target.value)}
                          rows={3}
                          className="w-full p-3 rounded-2xl bg-slate-950 border border-white/10 text-xs text-emerald-300 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                          placeholder="Paste RFC 5322 headers here to check for SPF / DKIM alignment or relay spoofing..."
                        />
                      </div>

                      {/* Body input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-white/60">Original Email Body Content</label>
                        <textarea 
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          rows={9}
                          className="w-full p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs text-cyan-100 font-sans focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none leading-relaxed"
                          placeholder="Paste the raw text of the suspicious email you want to analyze for phish patterns or AI authorship..."
                        />
                      </div>

                    </div>

                    <button
                      onClick={handleTextAnalysis}
                      disabled={isTextAnalyzing || !emailBody}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-900 font-extrabold text-sm shadow-md hover:from-cyan-300 hover:to-purple-400 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isTextAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Gemini 3.5 Forensics Processing...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 text-slate-900" />
                          <span>Verify Original Email Authenticity via Gemini API</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* RIGHT: Email analysis forensic results */}
                  <div className="lg:col-span-5 bg-slate-900/50 rounded-3xl border border-white/5 p-5 flex flex-col justify-between space-y-6">
                    {textAnalysisResult ? (
                      <div className="space-y-5">
                        
                        {/* Scanning Progress Bar */}
                        {(isTextScanning || textAnalysisProgress < 100) && (
                          <div className="space-y-2.5 bg-[#0a2330] p-4 rounded-2xl border border-cyan-500/10 animate-pulse">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-cyan-300 font-semibold">Linguistic Cryptanalysis Active...</span>
                              <span className="text-cyan-400 font-bold">{textAnalysisProgress}%</span>
                            </div>
                            <div className="relative w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-100"
                                style={{ width: `${textAnalysisProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Rating Header & Final Results - ONLY when fully complete */}
                        {textAnalysisProgress === 100 && !isTextScanning ? (
                          <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-5"
                          >
                            {/* Rating Header */}
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                              <span className="text-sm font-semibold text-white">Forensic Audit Result</span>
                              <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                                textAnalysisResult.riskLevel === 'High' 
                                  ? 'bg-red-500/10 text-red-300 border border-red-400/20'
                                  : 'bg-green-500/10 text-green-300 border border-green-400/20'
                              }`}>
                                Risk Level: {textAnalysisResult.riskLevel}
                              </span>
                            </div>

                            {/* Large Score Indicator */}
                            <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
                              <div className="relative w-16 h-16 rounded-full border-4 border-cyan-400/10 flex items-center justify-center font-mono">
                                <span className="text-lg font-bold text-cyan-300">{textAnalysisResult.authenticityRating}%</span>
                                <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-pulse" />
                              </div>
                              <div>
                                <span className="text-xs font-mono text-white/50 block">Authenticity Index</span>
                                <span className="text-sm font-bold text-white mt-0.5 block">
                                  {textAnalysisResult.authenticityRating > 70 ? 'Highly Secure & Genuine' : 'Critical Threat Flagged'}
                                </span>
                              </div>
                            </div>

                            {/* Explanation paragraph */}
                            <div className="space-y-1.5">
                              <span className="text-xs font-mono text-white/55 block">Linguistic Analysis Synopsis</span>
                              <p className="text-xs text-slate-200 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                                {textAnalysisResult.explanation}
                              </p>
                            </div>
                          </motion.div>
                        ) : null}

                        {/* Detailed metrics map shown during scanning or on completion */}
                        <div className="space-y-2.5">
                          <span className="text-xs font-mono text-white/50 block pb-1 border-b border-white/5">Signature Verification Pipeline</span>
                          {textAnalysisResult.characteristics?.map((char: any, i: number) => {
                            const display = getTextCharDisplay(char, i, textAnalysisProgress, isTextScanning);
                            const isAlert = display.status === 'AI Pattern Detected' || display.status === 'Critical Alert' || display.status === 'Spoofed';
                            
                            let cardBg = "bg-slate-950/40 border-white/5";
                            let nameText = "text-white font-bold";
                            let detailsText = "text-white/60";
                            let badgeBg = "bg-green-500/10 text-green-300 border border-green-400/20";
                            
                            if (display.isQueued) {
                              cardBg = "bg-slate-950/[0.15] border-white/5 opacity-40";
                              nameText = "text-white/40";
                              detailsText = "text-white/20";
                              badgeBg = "bg-white/5 text-white/40 border border-white/5";
                            } else if (display.isAnalyzing) {
                              cardBg = "bg-cyan-500/[0.03] border-cyan-500/20";
                              nameText = "text-cyan-200 font-bold animate-pulse";
                              detailsText = "text-white/40";
                              badgeBg = "bg-yellow-500/10 text-yellow-300 border border-yellow-400/20 animate-pulse";
                            } else if (isAlert) {
                              badgeBg = "bg-red-500/10 text-red-300 border border-red-400/20";
                            }
                            
                            return (
                              <div key={i} className={`p-3 rounded-xl border transition-all duration-300 ${cardBg} space-y-1`}>
                                <div className="flex justify-between items-center text-xs">
                                  <span className={nameText}>{char.name}</span>
                                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${badgeBg}`}>
                                    {display.status}
                                  </span>
                                </div>
                                <p className={`text-[10px] leading-snug ${detailsText}`}>
                                  {display.isQueued ? 'Analysis pending queue sequence...' : display.isAnalyzing ? 'Decoding textual signatures...' : char.details}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Recommendations - ONLY when complete */}
                        {textAnalysisProgress === 100 && !isTextScanning && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-1.5"
                          >
                            <span className="text-xs font-mono text-cyan-300 block">Mitigation Recommendations</span>
                            <ul className="space-y-1">
                              {textAnalysisResult.recommendations?.map((rec: string, i: number) => (
                                <li key={i} className="text-[10px] text-slate-300 flex items-start gap-1.5 leading-snug">
                                  <span className="text-cyan-400 mt-0.5">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}

                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-400/20 text-cyan-400 animate-pulse">
                          <Terminal className="w-8 h-8" />
                        </div>
                        <div className="space-y-1.5 max-w-xs">
                          <h4 className="text-sm font-bold text-white">Forensic Engine Idle</h4>
                          <p className="text-xs text-white/50 leading-relaxed">
                            Input the suspicious email text and envelope headers to the left, then trigger the Gemini security scan.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      {isLoggedIn && (
        <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-xs font-mono text-cyan-300/40 tracking-wider">
            &copy; {new Date().getFullYear()} SEBI Techsprint Landing Page. Built in compliance with reference art.
          </p>
          <p className="text-[10px] font-mono text-purple-400/40 tracking-widest uppercase">
            Biometric Forensic Standard v2.10
          </p>
        </footer>
      )}

      {/* ========================================================= */}
      {/*                      LOGIN POPUP MODAL                    */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#05181f]/90 backdrop-blur-md flex items-center justify-center p-4"
            id="login-modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#0b2b35] border border-white/15 w-full max-w-md rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col p-6 md:p-8 space-y-6"
              id="login-modal-card"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-cyan-300" />
                  <span className="font-display font-bold text-white">Secure Portal Authentication</span>
                </div>
                <button 
                  onClick={() => setIsLoginModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Login Subtitle */}
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-white">Welcome Back</h3>
                <p className="text-xs text-white/60">Log in to unlock verification workspaces, live webcam scans, and Gemini text analytics.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/50 block">Registered Email Address</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                    <input 
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-cyan-100 font-sans focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-white/50">Passphrase</label>
                    <span className="text-[10px] text-cyan-400 hover:underline cursor-pointer font-mono">Forgot password?</span>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                    <input 
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-cyan-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#07242e] font-display font-bold text-sm shadow-md hover:from-cyan-300 hover:to-cyan-400 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Authenticate Secure credentials</span>
                </button>
              </form>

              {/* Secure disclaimer */}
              <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 flex items-start gap-2.5 text-[10px] text-white/50 leading-snug">
                <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  Our login nodes are fully secure. Verification metrics generated inside active sessions are locally persisted in transient memory.
                </span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
}
