import { useEffect } from 'react'

const SUFFIX = 'Cheela Zhu'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX
  }, [title])
}
