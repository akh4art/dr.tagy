import React, { useEffect, useRef, useState } from 'react';

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playFailed, setPlayFailed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force strict muted properties for autoplay permission across all browsers (Safari/Chrome/iOS)
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.playsInline = true;

    // Trigger video play programmatically
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlayFailed(false);
        })
        .catch((error) => {
          console.warn('Direct MP4 video autoplay was blocked or failed, using robust fallback mechanism:', error);
          setPlayFailed(true);
        });
    }
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-all duration-1000 bg-[#092B21]"
      style={{
        // Ultra-luxurious aesthetic dark green & gold cosmetic backup background
        backgroundImage: `linear-gradient(180deg, rgba(9, 43, 33, 0.7) 0%, rgba(9, 43, 33, 0.6) 50%, rgba(9, 43, 33, 0.8) 100%), url('https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=1920')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 1. Primary Direct High-Speed Video Loop */}
      {!playFailed && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-[center_35%] md:object-center transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectFit: 'cover' }}
        >
          {/* 1. Primary Direct High-Speed Video Loop: User's Uploaded Custom Hero Video */}
          <source 
            src="/hiro-vid.mp4" 
            type="video/mp4" 
          />
          {/* Fallback Mixkit high-resolution face & luxury skincare sequence */}
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-face-of-a-beautiful-woman-with-clean-skin-41582-large.mp4" 
            type="video/mp4" 
          />
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-woman-applying-skincare-serum-to-her-face-41589-large.mp4" 
            type="video/mp4" 
          />
          {/* Backup Skincare Dropper dropper loop */}
          <source 
            src="https://player.vimeo.com/external/440079979.hd.mp4?s=3f9e9cf5bc9202dd9e604f1e0066d11f5fe0fcbd&profile_id=170" 
            type="video/mp4" 
          />
        </video>
      )}

      {/* 2. Secondary Iframe Fallback: If device is in Low-Power mode or direct video is blocked, we use a robust Vimeo background loop iframe */}
      {playFailed && (
        <iframe
          src="https://player.vimeo.com/video/440079979?autoplay=1&loop=1&muted=1&background=1&quality=720p"
          className="absolute inset-0 w-[116%] h-[116%] -left-[8%] -top-[8%] pointer-events-none object-cover"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          title="Dr Tagy Aesthetic Skincare Dropper Loop"
        ></iframe>
      )}

      {/* Luxury green & gold frosted glass overlay gradient to make Arabic text extremely sharp and highly legible */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#092B21]/60 via-[#092B21]/45 to-[#092B21]/70 z-0" 
        style={{ contentVisibility: 'auto' }}
      ></div>
    </div>
  );
}
