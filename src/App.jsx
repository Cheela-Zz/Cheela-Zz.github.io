import { useEffect } from 'react'
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import Home from './pages/Home.jsx'
import Contents from './pages/Contents.jsx'
import Album from './pages/Album.jsx'
import NotFound from './pages/NotFound.jsx'

/* The hash router is only used for the single file preview build. The real
   site uses clean paths, with dist/404.html catching deep links. */
const useHash = import.meta.env.VITE_HASH_ROUTER === 'true'
const Router = useHash ? HashRouter : BrowserRouter
const basename = useHash
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <Router basename={basename}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photos" element={<Contents />} />
        <Route path="/photos/:slug" element={<Album />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
