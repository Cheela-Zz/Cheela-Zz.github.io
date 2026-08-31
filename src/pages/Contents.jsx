import { Link } from 'react-router-dom'

import SunMark from '../components/SunMark.jsx'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import { albums, book, toRoman } from '../data/photos.js'

export default function Contents() {
  useDocumentTitle(book.title)

  return (
    <main className="page contents">
      <div>
        <Link className="contents__back" to="/">
          ← Back
        </Link>
      </div>

      <div className="contents__inner">
        <h1 className="contents__title">{book.title}</h1>
        <p className="contents__byline">{book.byline}</p>

        <ol className="toc">
          {albums.map((album, i) => (
            <li key={album.slug}>
              <Link className="toc__link" to={`/photos/${album.slug}`}>
                <span className="toc__name">{album.title}</span>
                <span className="leader" aria-hidden="true" />
                <span className="toc__num">{toRoman(i + 1)}</span>
              </Link>
            </li>
          ))}
        </ol>

        <p className="contents__edition">{book.edition}</p>
        <div className="contents__mark">
          <SunMark />
        </div>
      </div>
    </main>
  )
}
