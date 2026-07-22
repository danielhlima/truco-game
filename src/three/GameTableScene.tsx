import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties } from "react"
import * as THREE from "three"
import cardFaceAgedPaperUrl from "../assets/cards/card-face-aged-paper.png"
import cardBackAgedPhotoUrl from "../assets/cards/card-back-aged-photo.png"
import tableTopAdegaJucaBigodeUrl from "../assets/boteco/table-top-adega-juca-bigode.png"
import tableTopArenaNacionalUrl from "../assets/boteco/table-top-arena-nacional.png"
import tableTopCasinoMeMaiorUrl from "../assets/boteco/table-top-casino-me-maior.png"
import tableTopCentroConvencoesPrefeituraUrl from "../assets/boteco/table-top-centro-convencoes-prefeitura.png"
import tableTopCentroAmericanoTruqueiroMedelinUrl from "../assets/boteco/table-top-centro-americano-truqueiro-medelin.png"
import tableTopGhibliishUrl from "../assets/boteco/table-top-ghibliish.png"
import tableTopGaragemNorteUrl from "../assets/boteco/table-top-garagem-norte.png"
import tableTopGinasioEstadualManecoFileUrl from "../assets/boteco/table-top-ginasio-estadual-maneco-file.png"
import tableTopHotelTrucoSegoviaEspanhaUrl from "../assets/boteco/table-top-hotel-truco-segovia-espanha.png"
import tableTopManecoWoodUrl from "../assets/boteco/table-top-maneco-wood.png"
import tableTopOrbitaDaLuaUrl from "../assets/boteco/table-top-orbita-da-lua.png"
import tableTopQuintalDaLesteUrl from "../assets/boteco/table-top-quintal-da-leste.png"
import tableTopSalaoDaSulUrl from "../assets/boteco/table-top-salao-da-sul.png"
import tableTopSteelPatioUrl from "../assets/boteco/table-top-steel-patio.png"
import tableTopSubsoloDoCentroUrl from "../assets/boteco/table-top-subsolo-do-centro.png"
import tableTopTremJacaUrl from "../assets/boteco/table-top-trem-jaca.png"
import tableTopWoodStreetUrl from "../assets/boteco/table-top-wood-street.png"
import tableTopZeCatingaPhotoUrl from "../assets/boteco/table-top-ze-catinga-photo.png"
import type { SpeechBubbleState } from "../app/gameSessionHelpers"
import type { TableSceneModel } from "./tableSceneModel"

const ILLUSTRATED_TABLE_ASSET_URLS: Record<string, string> = {
  "ze-catinga-photo": tableTopZeCatingaPhotoUrl,
  "maneco-wood": tableTopManecoWoodUrl,
  "trem-jaca": tableTopTremJacaUrl,
  "adega-juca-bigode": tableTopAdegaJucaBigodeUrl,
  "arena-nacional": tableTopArenaNacionalUrl,
  "casino-me-maior": tableTopCasinoMeMaiorUrl,
  "centro-americano-truqueiro-medelin": tableTopCentroAmericanoTruqueiroMedelinUrl,
  "hotel-truco-segovia-espanha": tableTopHotelTrucoSegoviaEspanhaUrl,
  "orbita-da-lua": tableTopOrbitaDaLuaUrl,
  "garagem-norte": tableTopGaragemNorteUrl,
  "quintal-da-leste": tableTopQuintalDaLesteUrl,
  "subsolo-do-centro": tableTopSubsoloDoCentroUrl,
  "salao-da-sul": tableTopSalaoDaSulUrl,
  "centro-convencoes-prefeitura": tableTopCentroConvencoesPrefeituraUrl,
  "ginasio-estadual-maneco-file": tableTopGinasioEstadualManecoFileUrl,
  "wood-street": tableTopWoodStreetUrl,
  "steel-patio": tableTopSteelPatioUrl,
}

const CODE_CARD_WIDTH = 56
const CODE_CARD_HEIGHT = 80.64

interface GameTableSceneProps {
  model: TableSceneModel
  speechBubble?: SpeechBubbleState | null
  dealAnimationNonce?: number
  animationsEnabled?: boolean
  style?: CSSProperties
}

export function GameTableScene({
  model,
  speechBubble,
  dealAnimationNonce,
  animationsEnabled = true,
  style,
}: GameTableSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const dynamicGroupRef = useRef<THREE.Group | null>(null)
  const tableMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null)
  const borderMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const badgeMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null)

  const overlaySlots = useMemo(() => {
    return model.slots.map((slot) => ({
      ...slot,
      ...getPlayedCardOverlayPose(slot.playerId),
    }))
  }, [model.slots])

  const {
    accentColor,
    backgroundColor,
    badgeColor,
    illustratedTableAsset,
    illustratedTableOffsetX,
    illustratedTableOffsetY,
    illustratedTableScale,
    railColor,
    tableColor,
    tableKind,
  } = model.theme
  const usesIllustratedTable = tableKind === "steel"
  const usesSteelPatioTable = illustratedTableAsset === "steel-patio"
  const usesPhotoTable = illustratedTableAsset === "ze-catinga-photo"
  const usesTransparentTableCutout =
    illustratedTableAsset === "ze-catinga-photo" ||
    illustratedTableAsset === "ginasio-estadual-maneco-file" ||
    illustratedTableAsset === "arena-nacional" ||
    illustratedTableAsset === "casino-me-maior" ||
    illustratedTableAsset === "centro-americano-truqueiro-medelin" ||
    illustratedTableAsset === "hotel-truco-segovia-espanha" ||
    illustratedTableAsset === "orbita-da-lua"
  const illustratedTableUrl = illustratedTableAsset
    ? ILLUSTRATED_TABLE_ASSET_URLS[illustratedTableAsset] ?? tableTopGhibliishUrl
    : tableTopGhibliishUrl
  const tableScale = illustratedTableScale ?? 1
  const tableOffsetX = illustratedTableOffsetX ?? 0
  const tableOffsetY = illustratedTableOffsetY ?? 0
  const sceneWarmGlowStrength = model.theme.sceneWarmGlowStrength ?? 0.16
  const sceneVignetteStrength = model.theme.sceneVignetteStrength ?? 0.24
  const [animatingCards, setAnimatingCards] = useState<AnimatedCard[]>([])
  const [animatingVira, setAnimatingVira] = useState<AnimatedViraCard | null>(null)
  const [shownViraKey, setShownViraKey] = useState<string | null>(null)
  const [clearingCards, setClearingCards] = useState<ClearingCard[]>([])
  const [dealingCards, setDealingCards] = useState<DealingCard[]>([])
  const [isDealing, setIsDealing] = useState(false)
  const previousCardsRef = useRef<Record<number, string | null>>({})
  const previousViraAnimationKeyRef = useRef<string | null>(null)
  const animationTimeoutsRef = useRef<number[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 640
    const height = container.clientHeight || 420
    const aspect = width / height

    const scene = new THREE.Scene()
    scene.background = null

    const camera = new THREE.OrthographicCamera(-3.2 * aspect, 3.2 * aspect, 3.2, -3.2, 0.1, 100)
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight("#ffffff", 1.25)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(accentColor, 0.8, 12)
    pointLight.position.set(0, 0, 4)
    scene.add(pointLight)

    const warmLight = new THREE.PointLight("#f59e0b", tableKind === "steel" ? 0.85 : 0.4, 14)
    warmLight.position.set(-2.8, 2.4, 5)
    scene.add(warmLight)

    const tableGeometry = new THREE.PlaneGeometry(5.6, 3.6)
    const tableMaterial = new THREE.MeshStandardMaterial({
      color: tableColor,
      roughness: tableKind === "steel" ? 0.6 : 0.92,
      metalness: tableKind === "steel" ? 0.18 : 0.05,
      transparent: true,
      opacity: tableKind === "steel" ? 0.08 : 1,
    })
    const table = new THREE.Mesh(tableGeometry, tableMaterial)
    scene.add(table)

    const borderGeometry = new THREE.PlaneGeometry(5.84, 3.84)
    const borderMaterial = new THREE.MeshBasicMaterial({
      color: railColor,
      transparent: true,
      opacity: tableKind === "steel" ? 0.05 : 1,
    })
    const border = new THREE.Mesh(borderGeometry, borderMaterial)
    border.position.z = -0.005
    scene.add(border)

    const badgeGeometry = new THREE.CircleGeometry(0.62, 48)
    const badgeMaterial = new THREE.MeshStandardMaterial({
      color: badgeColor,
      roughness: 0.7,
      metalness: 0.08,
    })
    const badge = new THREE.Mesh(badgeGeometry, badgeMaterial)
    badge.position.set(0, 0, 0.01)
    scene.add(badge)

    const dynamicGroup = new THREE.Group()
    scene.add(dynamicGroup)

    renderer.render(scene, camera)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    dynamicGroupRef.current = dynamicGroup
    tableMaterialRef.current = tableMaterial
    borderMaterialRef.current = borderMaterial
    badgeMaterialRef.current = badgeMaterial

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return

      const nextWidth = entry.contentRect.width || 640
      const nextHeight = entry.contentRect.height || 420
      const nextAspect = nextWidth / nextHeight

      camera.left = -3.2 * nextAspect
      camera.right = 3.2 * nextAspect
      camera.top = 3.2
      camera.bottom = -3.2
      camera.updateProjectionMatrix()

      renderer.setSize(nextWidth, nextHeight)
      renderer.render(scene, camera)
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      renderer.dispose()
      tableGeometry.dispose()
      tableMaterial.dispose()
      borderGeometry.dispose()
      borderMaterial.dispose()
      badgeGeometry.dispose()
      badgeMaterial.dispose()
      container.innerHTML = ""
    }
  }, [accentColor, badgeColor, railColor, tableColor, tableKind])

  useEffect(() => {
    const scene = sceneRef.current
    const camera = cameraRef.current
    const renderer = rendererRef.current
    const dynamicGroup = dynamicGroupRef.current
    const tableMaterial = tableMaterialRef.current
    const borderMaterial = borderMaterialRef.current
    const badgeMaterial = badgeMaterialRef.current

    if (!scene || !camera || !renderer || !dynamicGroup) return

    scene.background = null

    if (tableMaterial) {
      tableMaterial.color.set(model.theme.tableColor)
      tableMaterial.roughness = model.theme.tableKind === "steel" ? 0.6 : 0.92
      tableMaterial.metalness = model.theme.tableKind === "steel" ? 0.18 : 0.05
      tableMaterial.opacity = model.theme.tableKind === "steel" ? 0.08 : 1
    }

    if (borderMaterial) {
      borderMaterial.color.set(model.theme.railColor)
      borderMaterial.opacity = model.theme.tableKind === "steel" ? 0.05 : 1
    }

    if (badgeMaterial) {
      badgeMaterial.color.set(model.theme.badgeColor)
    }

    while (dynamicGroup.children.length > 0) {
      const child = dynamicGroup.children[0]
      dynamicGroup.remove(child)
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose())
        } else {
          child.material.dispose()
        }
      }
    }

    for (const slot of model.slots) {
      if (slot.card) {
        const playedPosition = getPlayedCardPosition(slot.playerId)
        const glow = new THREE.Mesh(
          new THREE.PlaneGeometry(1.176, 1.5456),
          new THREE.MeshBasicMaterial({
            color: slot.highlight ? model.theme.activeSlotColor : model.theme.emptySlotColor,
            transparent: true,
            opacity: slot.highlight ? 0.16 : 0.08,
            side: THREE.DoubleSide,
          })
        )
        glow.position.set(playedPosition.x, playedPosition.y, 0.015)
        dynamicGroup.add(glow)
      }
    }

    renderer.render(scene, camera)
  }, [model])

  useEffect(() => {
    const nextPreviousCards: Record<number, string | null> = {}

    for (const timeoutId of animationTimeoutsRef.current) {
      window.clearTimeout(timeoutId)
    }
    animationTimeoutsRef.current = []

    for (const slot of model.slots) {
      const nextKey = getSlotCardKey(slot)
      const previousKey = previousCardsRef.current[slot.playerId] ?? null
      nextPreviousCards[slot.playerId] = nextKey

      if (!slot.card && previousKey) {
        const covered = previousKey === "covered"
        const [rank, suit] = covered ? ["", ""] : previousKey.split("-")
        const previousSymbol = getSuitSymbol(suit)
        const from = getPlayedCardOverlayPose(slot.playerId)
        const to = getClearingCardOverlayPosition(slot.playerId)
        const clearingKey = `clear-${slot.playerId}-${previousKey}`

        const clearInitId = window.setTimeout(() => {
          setClearingCards((current) => [
            ...current.filter((item) => item.key !== clearingKey),
            {
              key: clearingKey,
              rank,
              suit,
              suitSymbol: previousSymbol,
              covered,
              from,
              to,
              stage: "from",
            },
          ])
        }, 0)

        const clearStartId = window.setTimeout(() => {
          setClearingCards((current) =>
            current.map((item) =>
              item.key === clearingKey
                ? {
                    ...item,
                    stage: "to",
                  }
                : item
            )
          )
        }, 24)

        const clearEndId = window.setTimeout(() => {
          setClearingCards((current) => current.filter((item) => item.key !== clearingKey))
        }, 480)

        animationTimeoutsRef.current.push(clearInitId, clearStartId, clearEndId)
        continue
      }

      if (!slot.card || nextKey === previousKey) {
        continue
      }

      const card = slot.card
      const from = getPlayAnimationOrigin(slot.playerId)
      const to = getPlayedCardOverlayPose(slot.playerId)
      const animationKey = `${slot.playerId}-${nextKey}`

      const initId = window.setTimeout(() => {
        setAnimatingCards((current) => [
          ...current.filter((item) => item.key !== animationKey),
          {
            key: animationKey,
            rank: card.rank ?? "",
            suit: card.suit ?? "",
            suitSymbol: card.suitSymbol ?? "",
            covered: !!card.covered,
            highlight: slot.highlight,
            from,
            to,
            stage: "from",
          },
        ])
      }, 0)

      const startId = window.setTimeout(() => {
        setAnimatingCards((current) =>
          current.map((item) =>
            item.key === animationKey
              ? {
                  ...item,
                  stage: "to",
                }
              : item
            )
        )
      }, 24)

      const settleId = window.setTimeout(() => {
        setAnimatingCards((current) =>
          current.map((item) =>
            item.key === animationKey
              ? {
                  ...item,
                  stage: "settle",
                }
              : item
          )
        )
      }, 360)

      const endId = window.setTimeout(() => {
        setAnimatingCards((current) => current.filter((item) => item.key !== animationKey))
      }, 420)

      animationTimeoutsRef.current.push(initId, startId, settleId, endId)
    }

    previousCardsRef.current = nextPreviousCards

    return () => {
      for (const timeoutId of animationTimeoutsRef.current) {
        window.clearTimeout(timeoutId)
      }
      animationTimeoutsRef.current = []
    }
  }, [model.slots])

  const vira = model.centerDeck.vira
  const viraKey =
    model.centerDeck.show && vira ? `${vira.rank}-${vira.suit}` : null
  const shouldDelayDealForVira = model.centerDeck.show && !!viraKey
  const tableHasPlayedCards = model.slots.some((slot) => !!slot.card)

  useEffect(() => {
    if (!viraKey || !vira) {
      previousViraAnimationKeyRef.current = null
      setAnimatingVira(null)
      setShownViraKey(null)
      return
    }

    if (!animationsEnabled || tableHasPlayedCards) {
      setAnimatingVira(null)
      setShownViraKey(viraKey)
      return
    }

    const animationKey = `${dealAnimationNonce ?? 0}:${viraKey}`
    if (previousViraAnimationKeyRef.current === animationKey) {
      setShownViraKey(viraKey)
      return
    }

    previousViraAnimationKeyRef.current = animationKey
    setShownViraKey(null)

    const viraAnimationCard = {
      key: `vira-${animationKey}`,
      rank: vira.rank,
      suit: vira.suit,
      suitSymbol: vira.suitSymbol,
      from: getViraAnimationOrigin(),
      to: getViraOverlayPose(),
      stage: "from" as const,
    }

    const initId = window.setTimeout(() => {
      setAnimatingVira(viraAnimationCard)
    }, 0)

    const startId = window.setTimeout(() => {
      setAnimatingVira((current) =>
        current?.key === viraAnimationCard.key
          ? {
              ...current,
              stage: "to",
            }
          : current
      )
    }, 24)

    const finishId = window.setTimeout(() => {
      setShownViraKey(viraKey)
      setAnimatingVira(null)
    }, 520)

    return () => {
      window.clearTimeout(initId)
      window.clearTimeout(startId)
      window.clearTimeout(finishId)
    }
  }, [
    animationsEnabled,
    dealAnimationNonce,
    tableHasPlayedCards,
    vira?.rank,
    vira?.suit,
    vira?.suitSymbol,
    viraKey,
  ])

  useEffect(() => {
    if (!dealAnimationNonce || !animationsEnabled) {
      return
    }

    const dealTimeouts: number[] = []
    const order = [3, 4, 1, 2]
    const cardsToDeal = order.flatMap((playerId) =>
      Array.from({ length: 3 }, (_, index) => ({ playerId, index }))
    )
    const dealIntroDelay = shouldDelayDealForVira ? 520 : 0

    const resetId = window.setTimeout(() => {
      previousCardsRef.current = {}
      setAnimatingCards([])
      setClearingCards([])
      setDealingCards([])
      setIsDealing(true)
    }, 0)
    dealTimeouts.push(resetId)

    cardsToDeal.forEach(({ playerId, index }, sequenceIndex) => {
      const key = `deal-${dealAnimationNonce}-${playerId}-${index}`
      const from = { left: "50%", top: "50%", rotation: 0 }
      const to = getDealAnimationTargetPosition(playerId, index)
      const delay = dealIntroDelay + sequenceIndex * 78

      const initId = window.setTimeout(() => {
        setDealingCards((current) => [
          ...current.filter((item) => item.key !== key),
          {
            key,
            from,
            to,
            stage: "from",
          },
        ])
      }, delay)

      const startId = window.setTimeout(() => {
        setDealingCards((current) =>
          current.map((item) =>
            item.key === key
              ? {
                  ...item,
                  stage: "to",
                }
              : item
          )
        )
      }, delay + 24)

      const endId = window.setTimeout(() => {
        setDealingCards((current) => current.filter((item) => item.key !== key))
      }, delay + 840)

      dealTimeouts.push(initId, startId, endId)
    })

    const finishId = window.setTimeout(() => {
      setIsDealing(false)
    }, dealIntroDelay + cardsToDeal.length * 78 + 900)
    dealTimeouts.push(finishId)

    return () => {
      for (const timeoutId of dealTimeouts) {
        window.clearTimeout(timeoutId)
      }
      setDealingCards([])
      setIsDealing(false)
    }
  }, [
    animationsEnabled,
    dealAnimationNonce,
    shouldDelayDealForVira,
  ])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          overflow: "hidden",
          background: usesIllustratedTable
            ? usesTransparentTableCutout
              ? "transparent"
              : usesSteelPatioTable
              ? "#3b2a1f"
              : "#d1d5db"
            : backgroundColor,
        }}
      >
        {usesIllustratedTable ? (
          <img
            src={illustratedTableUrl}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transformOrigin: "center center",
              transform: `translate(${tableOffsetX}%, ${tableOffsetY}%) scale(${tableScale})`,
              filter: usesSteelPatioTable
                ? "contrast(1.04) saturate(0.96)"
                : usesPhotoTable
                  ? "contrast(1.06) saturate(1.02) drop-shadow(0 18px 26px rgba(0,0,0,0.32))"
                  : "contrast(1.03) saturate(0.98) drop-shadow(0 18px 26px rgba(0,0,0,0.34))",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at center, ${tableColor} 0%, ${backgroundColor} 100%)`,
            }}
          />
        )}

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              `radial-gradient(circle at center, rgba(255,244,214,0.08) 0%, rgba(255,244,214,0.04) 28%, rgba(17,12,9,${Math.max(sceneVignetteStrength - 0.12, 0.04)}) 62%, rgba(8,6,5,${sceneVignetteStrength}) 100%)`,
            }}
          />

        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "-6%",
            right: "-6%",
            top: "-10%",
            height: "28%",
            background:
              `radial-gradient(ellipse at top, rgba(255,214,140,${sceneWarmGlowStrength}) 0%, rgba(255,214,140,${Math.max(sceneWarmGlowStrength - 0.08, 0.02)}) 34%, rgba(255,214,140,0) 74%)`,
            pointerEvents: "none",
          }}
        />
      </div>

      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", borderRadius: "20px", overflow: "hidden" }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        {model.centerDeck.show && vira && shownViraKey === viraKey && !animatingVira ? (
          <ViraCardOverlay vira={vira} />
        ) : null}

        {animatingVira ? (
          <ViraCardOverlay
            vira={animatingVira}
            left={animatingVira.stage === "from" ? animatingVira.from.left : animatingVira.to.left}
            top={animatingVira.stage === "from" ? animatingVira.from.top : animatingVira.to.top}
            rotation={
              animatingVira.stage === "from"
                ? animatingVira.from.rotation
                : animatingVira.to.rotation
            }
            transition="left 480ms cubic-bezier(0.22, 0.9, 0.24, 1), top 480ms cubic-bezier(0.22, 0.9, 0.24, 1), transform 480ms cubic-bezier(0.22, 0.9, 0.24, 1)"
          />
        ) : null}

        {!isDealing && overlaySlots
          .filter((slot) => {
            if (!slot.card) return false

            const currentKey = `${slot.playerId}-${getSlotCardKey(slot)}`
            return !animatingCards.some(
              (item) => item.key === currentKey && item.stage !== "settle"
            )
          })
          .map((slot) => (
            <CodeCard
              key={`played-${slot.playerId}`}
              left={slot.left}
              top={slot.top}
              rotation={slot.rotation}
              highlight={slot.highlight}
              rank={slot.card?.rank}
              suit={slot.card?.suit}
              suitSymbol={slot.card?.suitSymbol}
              faceDown={!!slot.card?.covered}
            />
          ))}

        {animatingCards.map((card) => (
          <CodeCard
            key={card.key}
            left={card.stage === "from" ? card.from.left : card.to.left}
            top={card.stage === "from" ? card.from.top : card.to.top}
            rotation={card.stage === "from" ? card.from.rotation : card.to.rotation}
            transition="left 360ms cubic-bezier(0.22, 0.9, 0.24, 1), top 360ms cubic-bezier(0.22, 0.9, 0.24, 1), transform 360ms cubic-bezier(0.22, 0.9, 0.24, 1), box-shadow 180ms ease-out"
            rank={card.rank}
            suit={card.suit}
            suitSymbol={card.suitSymbol}
            faceDown={card.covered}
            highlight={card.highlight}
            settled={card.stage === "settle"}
          />
        ))}

        {clearingCards.map((card) => (
          <CodeCard
            key={card.key}
            left={card.stage === "from" ? card.from.left : card.to.left}
            top={card.stage === "from" ? card.from.top : card.to.top}
            rotation={card.stage === "from" ? card.from.rotation : card.to.rotation}
            transition="left 440ms cubic-bezier(0.4, 0, 0.2, 1), top 440ms cubic-bezier(0.4, 0, 0.2, 1), transform 440ms cubic-bezier(0.4, 0, 0.2, 1), opacity 440ms cubic-bezier(0.4, 0, 0.2, 1)"
            rank={card.rank}
            suit={card.suit}
            suitSymbol={card.suitSymbol}
            faceDown={card.covered}
            opacity={card.stage === "from" ? 1 : 0}
            scale={card.stage === "from" ? 1 : 0.86}
          />
        ))}

        {dealingCards.map((card) => (
          <CodeCard
            key={card.key}
            left={card.stage === "from" ? card.from.left : card.to.left}
            top={card.stage === "from" ? card.from.top : card.to.top}
            rotation={card.stage === "from" ? card.from.rotation : card.to.rotation}
            transition="left 720ms cubic-bezier(0.22, 0.9, 0.24, 1), top 720ms cubic-bezier(0.22, 0.9, 0.24, 1), transform 720ms cubic-bezier(0.22, 0.9, 0.24, 1), opacity 720ms cubic-bezier(0.22, 0.9, 0.24, 1)"
            faceDown
            opacity={card.stage === "from" ? 0.92 : 1}
            scale={0.84}
          />
        ))}

        {speechBubble ? (
          <SpeechBubbleOverlay
            playerId={speechBubble.playerId}
            text={speechBubble.text}
          />
        ) : null}
      </div>
    </div>
  )
}

function getPlayedCardPosition(playerId: number): { x: number; y: number } {
  switch (playerId) {
    case 3:
      return { x: 0, y: 0.8 }
    case 2:
      return { x: -0.95, y: 0 }
    case 4:
      return { x: 0.95, y: 0 }
    default:
      return { x: 0, y: -0.8 }
  }
}

function getPlayedCardRotation(playerId: number): number {
  switch (playerId) {
    case 3:
      return -5
    case 2:
      return 4
    case 4:
      return -4
    default:
      return 3
  }
}

function getPlayedCardOverlayPose(
  playerId: number
): { left: string; top: string; rotation: number } {
  const position = getPlayedCardPosition(playerId)

  return {
    left: `${((position.x + 2.8) / 5.6) * 100}%`,
    top: `${((2 - position.y) / 4) * 100}%`,
    rotation: getPlayedCardRotation(playerId),
  }
}

function getClearingCardOverlayPosition(
  playerId: number
): { left: string; top: string; rotation: number } {
  switch (playerId) {
    case 3:
      return { left: "50%", top: "-18%", rotation: -22 }
    case 2:
      return { left: "-18%", top: "50%", rotation: 22 }
    case 4:
      return { left: "118%", top: "50%", rotation: -22 }
    default:
      return { left: "50%", top: "118%", rotation: 22 }
  }
}

function getDealAnimationTargetPosition(
  playerId: number,
  index: number
): { left: string; top: string; rotation: number } {
  const spread = index * 6

  switch (playerId) {
    case 3:
      return { left: `${44 + spread}%`, top: "-18%", rotation: 180 }
    case 2:
      return { left: "-18%", top: `${44 + spread}%`, rotation: 90 }
    case 4:
      return { left: "118%", top: `${44 + spread}%`, rotation: -90 }
    default:
      return { left: `${44 + spread}%`, top: "118%", rotation: 0 }
  }
}

function getPlayAnimationOrigin(playerId: number): {
  left: string
  top: string
  rotation: number
} {
  switch (playerId) {
    case 3:
      return { left: "50%", top: "-10%", rotation: 180 }
    case 2:
      return { left: "-10%", top: "50%", rotation: 90 }
    case 4:
      return { left: "110%", top: "50%", rotation: -90 }
    default:
      return { left: "50%", top: "110%", rotation: 0 }
  }
}

function getViraOverlayPose(): { left: string; top: string; rotation: number } {
  return { left: "clamp(92px, 23%, 28%)", top: "76%", rotation: -7 }
}

function getViraAnimationOrigin(): { left: string; top: string; rotation: number } {
  return { left: "50%", top: "50%", rotation: -28 }
}

function getSlotCardKey(slot: TableSceneModel["slots"][number]): string | null {
  if (!slot.card) {
    return null
  }

  if (slot.card.covered) {
    return "covered"
  }

  return `${slot.card.rank}-${slot.card.suit}`
}

interface ViraCardData {
  rank: string
  suit: string
  suitSymbol: string
}

interface AnimatedViraCard extends ViraCardData {
  key: string
  from: {
    left: string
    top: string
    rotation: number
  }
  to: {
    left: string
    top: string
    rotation: number
  }
  stage: "from" | "to"
}

interface AnimatedCard {
  key: string
  rank: string
  suit: string
  suitSymbol: string
  covered: boolean
  highlight: boolean
  from: {
    left: string
    top: string
    rotation: number
  }
  to: {
    left: string
    top: string
    rotation: number
  }
  stage: "from" | "to" | "settle"
}

interface ClearingCard {
  key: string
  rank: string
  suit: string
  suitSymbol: string
  covered: boolean
  from: {
    left: string
    top: string
    rotation: number
  }
  to: {
    left: string
    top: string
    rotation: number
  }
  stage: "from" | "to"
}

interface DealingCard {
  key: string
  from: {
    left: string
    top: string
    rotation: number
  }
  to: {
    left: string
    top: string
    rotation: number
  }
  stage: "from" | "to"
}

interface CodeCardProps {
  left: string
  top: string
  rotation: number
  scale?: number
  highlight?: boolean
  faceDown?: boolean
  rank?: string
  suit?: string
  suitSymbol?: string
  transition?: string
  opacity?: number
  settled?: boolean
}

function ViraCardOverlay({
  vira,
  left,
  top,
  rotation,
  transition,
}: {
  vira: ViraCardData
  left?: string
  top?: string
  rotation?: number
  transition?: string
}) {
  const pose = getViraOverlayPose()

  return (
    <div
      style={{
        position: "absolute",
        left: left ?? pose.left,
        top: top ?? pose.top,
        width: "80.8px",
        height: "107.2px",
        transform: `translate(-50%, -50%) rotate(${rotation ?? pose.rotation}deg)`,
        transition,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          transform: "translate(-50%, 0)",
          padding: "2px 7px",
          borderRadius: "999px",
          background: "rgba(29, 18, 10, 0.8)",
          border: "1px solid rgba(245, 218, 169, 0.58)",
          color: "#f8ead2",
          fontSize: "10px",
          fontWeight: 900,
          letterSpacing: "0.08em",
          lineHeight: 1,
          textTransform: "uppercase",
          boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
        }}
      >
        Vira
      </div>
      <CodeCard
        left="50%"
        top="60%"
        rotation={0}
        scale={0.86}
        rank={vira.rank}
        suit={vira.suit}
        suitSymbol={vira.suitSymbol}
        highlight
      />
    </div>
  )
}

function CodeCard({
  left,
  top,
  rotation,
  scale = 1,
  highlight = false,
  faceDown = false,
  rank,
  suit,
  suitSymbol,
  transition,
  opacity = 1,
  settled = false,
}: CodeCardProps) {
  const width = CODE_CARD_WIDTH * scale
  const height = CODE_CARD_HEIGHT * scale
  const suitColor = suit === "copas" || suit === "ouros" ? "#b91c1c" : "#1f2937"

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        borderRadius: "10.4px",
        overflow: "hidden",
        background: faceDown
          ? `center / cover no-repeat url(${cardBackAgedPhotoUrl})`
          : `center / cover no-repeat url(${cardFaceAgedPaperUrl})`,
        border: "1px solid rgba(120,82,48,0.35)",
        boxShadow: faceDown
          ? "0 8px 16px rgba(0,0,0,0.2)"
          : settled
            ? "0 12px 20px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.1)"
            : highlight
              ? "0 10px 20px rgba(0,0,0,0.24)"
              : "0 8px 16px rgba(0,0,0,0.18)",
        color: suitColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: faceDown ? "5.6px" : "4.8px 5.6px",
        boxSizing: "border-box",
        transition,
        opacity,
      }}
    >
      {faceDown ? null : (
        <>
          <div style={{ fontSize: "16.8px", fontWeight: 800, lineHeight: 1 }}>{rank}</div>
          <div style={{ fontSize: "28.8px", lineHeight: 1, alignSelf: "center" }}>{suitSymbol}</div>
          <div
            style={{
              fontSize: "16.8px",
              fontWeight: 800,
              lineHeight: 1,
              alignSelf: "flex-end",
              transform: "rotate(180deg)",
            }}
          >
            {rank}
          </div>
        </>
      )}
    </div>
  )
}

function getSuitSymbol(suit: string): string {
  switch (suit) {
    case "copas":
      return "♥"
    case "ouros":
      return "♦"
    case "espada":
      return "♠"
    case "paus":
      return "♣"
    default:
      return "?"
  }
}

function getSpeechBubbleOverlayPosition(playerId: number): { left: string; top: string } {
  switch (playerId) {
    case 3:
      return { left: "50%", top: "11%" }
    case 2:
      return { left: "16%", top: "40%" }
    case 4:
      return { left: "84%", top: "40%" }
    default:
      return { left: "50%", top: "74%" }
  }
}

function SpeechBubbleOverlay({
  playerId,
  text,
}: {
  playerId: number
  text: string
}) {
  const { left, top } = getSpeechBubbleOverlayPosition(playerId)

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        transform: "translate(-50%, -50%)",
        padding: "10px 14px",
        borderRadius: "18px",
        background: "#fffdf5",
        border: "2px solid rgba(68, 64, 60, 0.82)",
        color: "#1f2937",
        fontSize: "18px",
        fontWeight: 900,
        letterSpacing: "0.04em",
        boxShadow: "0 12px 22px rgba(0,0,0,0.22)",
        whiteSpace: "nowrap",
        animation: "speech-pop 180ms ease-out",
      }}
    >
      {text}

      <div
        style={{
          position: "absolute",
          width: "14px",
          height: "14px",
          background: "#fffdf5",
          borderRight: "2px solid rgba(68, 64, 60, 0.82)",
          borderBottom: "2px solid rgba(68, 64, 60, 0.82)",
          transform: "translateX(-50%) rotate(45deg)",
          left: playerId === 2 ? "24%" : playerId === 4 ? "76%" : "50%",
          bottom: "-8px",
          top: undefined,
          right: undefined,
        }}
      />
    </div>
  )
}
