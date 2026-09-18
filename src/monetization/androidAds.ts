import { Capacitor, registerPlugin, type PluginListenerHandle } from "@capacitor/core"
import {
  decideInterstitialAfterMatch,
  INTERSTITIAL_COOLDOWN_MS,
  MATCHES_BETWEEN_INTERSTITIALS,
} from "./adsPolicy"

type AndroidAdsStatus = {
  initialized: boolean
  loading: boolean
  ready: boolean
  shown: boolean
  privacyOptionsRequired: boolean
}

type AndroidAdsPlugin = {
  isDebugBuild(): Promise<{ enabled: boolean }>
  initialize(): Promise<AndroidAdsStatus>
  preloadInterstitial(): Promise<AndroidAdsStatus>
  getStatus(): Promise<AndroidAdsStatus>
  showInterstitial(): Promise<AndroidAdsStatus>
  showPrivacyOptions(): Promise<AndroidAdsStatus>
  openPrivacyPolicy(): Promise<void>
  openSupport(): Promise<void>
  addListener(
    eventName: "sdkInitialized" | "adLoaded" | "adShown" | "adDismissed" | "adFailedToLoad" | "adFailedToShow",
    listenerFunc: (data: Record<string, unknown>) => void,
  ): Promise<PluginListenerHandle>
}

const AndroidAds = registerPlugin<AndroidAdsPlugin>("TrucoAds")
const MATCH_COUNT_STORAGE_KEY = "truco-raiz.ads.eligible-match-count.v1"
const LAST_SHOWN_STORAGE_KEY = "truco-raiz.ads.last-interstitial-at.v1"

let initializationPromise: Promise<void> | null = null
let listenersPromise: Promise<PluginListenerHandle[]> | null = null
let privacyOptionsRequired = false
const privacyOptionsListeners = new Set<(required: boolean) => void>()

function isAndroid() {
  return Capacitor.getPlatform() === "android"
}

export async function isDebugBuild() {
  if (isAndroid()) {
    try {
      return (await AndroidAds.isDebugBuild()).enabled
    } catch {
      // Fail closed in the Android app if the native build type is unavailable.
      return false
    }
  }

  return !Capacitor.isNativePlatform() && import.meta.env.DEV
}

function readNumber(key: string, fallback: number) {
  if (typeof window === "undefined") return fallback
  const value = Number(window.localStorage.getItem(key))
  return Number.isFinite(value) && value >= 0 ? value : fallback
}

function writeNumber(key: string, value: number) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, String(value))
  }
}

function updatePrivacyOptionsRequired(status: AndroidAdsStatus) {
  privacyOptionsRequired = status.privacyOptionsRequired
  privacyOptionsListeners.forEach((listener) => listener(privacyOptionsRequired))
}

async function installListeners() {
  if (!isAndroid()) return []
  if (!listenersPromise) {
    listenersPromise = Promise.all([
      AndroidAds.addListener("adDismissed", () => {
        void AndroidAds.preloadInterstitial()
      }),
      AndroidAds.addListener("adFailedToShow", () => {
        void AndroidAds.preloadInterstitial()
      }),
      AndroidAds.addListener("sdkInitialized", (data) => {
        updatePrivacyOptionsRequired(data as AndroidAdsStatus)
      }),
    ])
  }
  return listenersPromise
}

export async function initializeAndroidAds() {
  if (!isAndroid()) return
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await installListeners()
      const status = await AndroidAds.initialize()
      updatePrivacyOptionsRequired(status)
      if (status.initialized) {
        const preloadStatus = await AndroidAds.preloadInterstitial()
        updatePrivacyOptionsRequired(preloadStatus)
      }
    })().catch((error) => {
      initializationPromise = null
      throw error
    })
  }
  await initializationPromise
}

export function subscribeToPrivacyOptionsRequirement(listener: (required: boolean) => void) {
  privacyOptionsListeners.add(listener)
  listener(privacyOptionsRequired)
  return () => {
    privacyOptionsListeners.delete(listener)
  }
}

export async function showAndroidPrivacyOptions() {
  if (!isAndroid()) return false
  const status = await AndroidAds.showPrivacyOptions()
  updatePrivacyOptionsRequired(status)
  return true
}

function openWebFallback(url: string) {
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer")
  }
}

export async function openPrivacyPolicy() {
  if (!isAndroid()) {
    openWebFallback("https://danielhenriquelima.com.br/truco-raiz/privacidade/")
    return
  }
  await AndroidAds.openPrivacyPolicy()
}

export async function openSupport() {
  if (!isAndroid()) {
    openWebFallback("https://danielhenriquelima.com.br/truco-raiz/suporte/")
    return
  }
  await AndroidAds.openSupport()
}

export async function maybeShowInterstitialAfterMatch(input: {
  venueId?: string
  outcome: "win" | "loss"
}) {
  if (!isAndroid()) return false

  const eligibleMatchCount = readNumber(MATCH_COUNT_STORAGE_KEY, 0)
  const lastShownAtValue = readNumber(LAST_SHOWN_STORAGE_KEY, 0)
  const lastShownAt = lastShownAtValue > 0 ? lastShownAtValue : null
  const decision = decideInterstitialAfterMatch({
    venueId: input.venueId,
    eligibleMatchCount,
    now: Date.now(),
    lastShownAt,
  })

  const cooldownRemainingMs = lastShownAt === null
    ? 0
    : Math.max(0, INTERSTITIAL_COOLDOWN_MS - (Date.now() - lastShownAt))
  console.info(`[TrucoAds] decisão pós-partida ${JSON.stringify({
    venueId: input.venueId,
    outcome: input.outcome,
    eligibleMatchCount,
    nextCount: eligibleMatchCount + 1,
    lastShownAt,
    shouldCount: decision.shouldCount,
    shouldShow: decision.shouldShow,
    cooldownRemainingMs,
  })}`)

  if (!decision.shouldCount) return false

  const nextCount = eligibleMatchCount + 1
  writeNumber(MATCH_COUNT_STORAGE_KEY, nextCount)
  if (!decision.shouldShow) return false

  await initializeAndroidAds()
  const status = await AndroidAds.getStatus()
  updatePrivacyOptionsRequired(status)
  console.info(`[TrucoAds] status antes de exibir ${JSON.stringify(status)}`)
  if (!status.ready) return false

  const result = await AndroidAds.showInterstitial()
  console.info(`[TrucoAds] resultado da exibição ${JSON.stringify(result)}`)
  if (result.shown) {
    writeNumber(LAST_SHOWN_STORAGE_KEY, Date.now())
    return true
  }
  return false
}

export const androidAdsPolicy = {
  matchesBetweenInterstitials: MATCHES_BETWEEN_INTERSTITIALS,
  cooldownMs: INTERSTITIAL_COOLDOWN_MS,
}
