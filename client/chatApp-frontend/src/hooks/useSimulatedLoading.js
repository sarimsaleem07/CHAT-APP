import { useEffect, useState } from 'react'

// TEMPORARY: fakes a network delay so skeletons are visible with dummy data.
// When APIs are added, replace each use with the request's real `isLoading`.
const useSimulatedLoading = (key = 'default', ms = 700) => {
  const [loadedKey, setLoadedKey] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoadedKey(key), ms)
    return () => clearTimeout(timer)
  }, [key, ms])

  return loadedKey !== key
}

export default useSimulatedLoading
