export function installWindowLocalStorageMock() {
  const store = new Map<string, string>()

  const localStorage = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
    removeItem(key: string) {
      store.delete(key)
    },
    clear() {
      store.clear()
    },
  }

  Object.defineProperty(globalThis, "window", {
    value: { localStorage },
    configurable: true,
  })

  return {
    localStorage,
    cleanup() {
      Reflect.deleteProperty(globalThis, "window")
    },
  }
}
