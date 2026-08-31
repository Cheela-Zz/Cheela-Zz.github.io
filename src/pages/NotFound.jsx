import { Link } from 'react-router-dom'

import { useDocumentTitle } from '../lib/useDocumentTitle.js'

export default function NotFound() {
  useDocumentTitle('Not found')

  return (
    <main className="page missing">
      <h1 className="missing__title">Blank page</h1>
      <p>There is nothing at this address.</p>
      <Link className="link" to="/">
        Back to the beginning
      </Link>
    </main>
  )
}
