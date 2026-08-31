import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import NotFound from './NotFound.jsx'
import { asset } from '../lib/asset.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import { albums, toRoman } from '../data/photos.js'

function Plate({ plate, index }) {
  const [loaded, setLoaded] = useState(false)

  // An image served from cache can finish before React attaches onLoad, so
  // check the element itself the moment it lands.
  const attach = useCallback((node) => {
    if (node && node.complete && node.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <li className="plate" data-plate={index}>
      <figure className="plate__figure">
        <div className="plate__frame">
          <img
            ref={attach}
            className={`plate__img${loaded ? ' is-loaded' : ''}`}
            src={asset(plate.src)}
            width={plate.w}
            height={plate.h}
            alt={plate.caption || ''}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
          <div className="grain" aria-hidden="true" />
        </div>
        <figcaption className="plate__caption">
          <span className="plate__num">{toRoman(index + 1)}</span>
          <span className="plate__text">{plate.caption}</span>
        </figcaption>
      </figure>
    </li>
  )
}

export default function Album() {
  const { slug } = useParams()
  const listRef = useRef(null)
  const [current, setCurrent] = useState(0)

  const index = albums.findIndex((a) => a.slug === slug)
  const album = index >= 0 ? albums[index] : null
  const total = album ? album.plates.length : 0

  useDocumentTitle(album ? album.title : 'Not found')

  // Keep the running plate number in the bar in step with the scroll.
  useEffect(() => {
    if (!album) return undefined
    const nodes = listRef.current?.querySelectorAll('.plate')
    if (!nodes?.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(Number(entry.target.dataset.plate))
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [album, slug])

  // Turn pages with j and k, or the left and right arrows. Up and down are
  // left alone so ordinary scrolling still behaves.
  useEffect(() => {
    if (!album) return undefined

    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const tag = event.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return

      let step = 0
      if (event.key === 'j' || event.key === 'ArrowRight') step = 1
      if (event.key === 'k' || event.key === 'ArrowLeft') step = -1
      if (!step) return

      const nodes = listRef.current?.querySelectorAll('.plate')
      if (!nodes?.length) return

      event.preventDefault()
      const next = Math.min(Math.max(current + step, 0), nodes.length - 1)
      nodes[next].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [album, current])

  if (!album) return <NotFound />

  const previous = index > 0 ? albums[index - 1] : null
  const next = index < albums.length - 1 ? albums[index + 1] : null

  return (
    <>
      <div className="album__bar">
        <div className="page album__bar-inner">
          <Link className="album__back" to="/photos">
            ← Contents
          </Link>
          <span className="album__bar-title">{album.title}</span>
          <span className="album__counter">
            {toRoman(current + 1)} / {toRoman(total)}
          </span>
        </div>
      </div>

      <main className="page">
        <header className="album__head">
          <h1 className="album__title">{album.title}</h1>
          {album.subtitle ? <p className="album__subtitle">{album.subtitle}</p> : null}
        </header>

        <ol className="plates" ref={listRef}>
          {album.plates.map((plate, i) => (
            <Plate key={plate.src} plate={plate} index={i} />
          ))}
        </ol>

        <nav className="album__foot" aria-label="Chapters">
          {previous ? (
            <Link to={`/photos/${previous.slug}`}>← {previous.title}</Link>
          ) : (
            <span>Beginning</span>
          )}
          <Link to="/photos">Contents</Link>
          {next ? (
            <Link to={`/photos/${next.slug}`}>{next.title} →</Link>
          ) : (
            <span>End</span>
          )}
        </nav>
      </main>
    </>
  )
}
