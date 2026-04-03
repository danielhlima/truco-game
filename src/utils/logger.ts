let logs: string[] = []
let loggerInitialized = false

export function initLogger() {
  if (loggerInitialized) {
    return
  }

  loggerInitialized = true
}

export function logEvent(...args: unknown[]) {
  const message = args
    .map((arg) => formatLogValue(arg))
    .join(" ")

  logs.push(message)
  console.log(...args)
}

function formatLogValue(value: unknown): string {
  if (typeof value === "object" && value !== null) {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return "[object]"
    }
  }

  return String(value)
}

export function getLogsAsText(): string {
  return logs.join("\n")
}

export function clearLogs() {
  logs = []
}