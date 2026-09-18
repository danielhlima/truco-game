const MAX_PRELOADED_IMAGES = 8
const preloadedImages = new Map<string, HTMLImageElement>()

export function preloadImages(urls: Array<string | undefined>) {
  if (typeof window === "undefined") return

  for (const url of [...new Set(urls.filter((value): value is string => !!value))]) {
    if (preloadedImages.has(url)) continue

    const image = new Image()
    image.decoding = "async"
    image.src = url
    preloadedImages.set(url, image)
    void image.decode().catch(() => {
      preloadedImages.delete(url)
    })
  }

  while (preloadedImages.size > MAX_PRELOADED_IMAGES) {
    const oldestUrl = preloadedImages.keys().next().value
    if (!oldestUrl) break
    preloadedImages.delete(oldestUrl)
  }
}
