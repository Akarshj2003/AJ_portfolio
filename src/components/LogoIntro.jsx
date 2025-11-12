import React from 'react'

function LogoIntro({ videoSource, onVideoEnd }) {
  return (
    <div className='fixed inset-0 z-10000 flex items-center justify-center bg-black overflow-hidden'>
      <video
        src={videoSource}
        autoPlay
        muted // Muting is often required for autoplay to work in browsers
        playsInline
        onEnded={onVideoEnd}
        className='max-w-full max-h-full object-contain' // Style the video to fit
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default LogoIntro