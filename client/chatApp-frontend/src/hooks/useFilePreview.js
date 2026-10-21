import { useEffect, useState } from 'react'

// Returns a data URL for image files (null for anything else / while loading)
const useFilePreview = (file, allowedTypes) => {
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!(file instanceof File) || !file.type.startsWith('image/')) return
    if (allowedTypes && !allowedTypes.includes(file.type)) return
    const reader = new FileReader()
    reader.onload = () => setResult({ file, url: reader.result })
    reader.readAsDataURL(file)
    return () => reader.abort()
  }, [file, allowedTypes])

  return result?.file === file ? result.url : null
}

export default useFilePreview
