import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset.js'

/*
 * The landing clip. Colour is stripped in CSS and the whole thing is multiplied
 * onto the page, so the highlights take on the grey of the paper rather than
 * sitting on it as a white rectangle. The grain layer sits on top.
 */
export default function Portrait({ video, poster, alt, caption }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (calm?.matches) {
      el.pause()
      setPlaying(false)
    }
  }, [])

  function toggle() {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      el.play().then(
        () => setPlaying(true),
        () => setPlaying(false)
      )
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  return (
    <figure className="landing__figure">
      <div className="portrait">
        <video
          ref={videoRef}
          className="portrait__media"
          src={asset(video)}
          poster={asset(poster)}
          aria-label={alt}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <div className="grain" aria-hidden="true" />
        <div className="portrait__vignette" aria-hidden="true" />
        <button type="button" className="portrait__toggle" onClick={toggle}>
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>
      {caption ? <figcaption className="landing__caption">{caption}</figcaption> : null}
    </figure>
  )
}
