import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties } from "react"
import * as THREE from "three"
import tableTopGhibliishUrl from "../assets/boteco/table-top-ghibliish.png"
import tableTopManecoWoodUrl from "../assets/boteco/table-top-maneco-wood.png"
import tableTopSteelPatioUrl from "../assets/boteco/table-top-steel-patio.png"
import tableTopWoodStreetUrl from "../assets/boteco/table-top-wood-street.png"
import type { SpeechBubbleState } from "../app/gameSessionHelpers"
import type { TableSceneModel } from "./tableSceneModel"

interface GameTableSceneProps {
  model: TableSceneModel
  speechBubble?: SpeechBubbleState | null
  dealAnimationNonce?: number
  style?: CSSProperties
}

export function GameTableScene({
  model,
  speechBubble,
  dealAnimationNonce,
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
      ...getPlayedCardOverlayPosition(slot.playerId),
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
  const illustratedTableUrl =
    illustratedTableAsset === "maneco-wood"
      ? tableTopManecoWoodUrl
      : illustratedTableAsset === "wood-street"
        ? tableTopWoodStreetUrl
        : illustratedTableAsset === "steel-patio"
          ? tableTopSteelPatioUrl
          : tableTopGhibliishUrl
  const tableScale = illustratedTableScale ?? 1
  const tableOffsetX = illustratedTableOffsetX ?? 0
  const tableOffsetY = illustratedTableOffsetY ?? 0
  const [animatingCards, setAnimatingCards] = useState<AnimatedCard[]>([])
  const [clearingCards, setClearingCards] = useState<ClearingCard[]>([])
  const [dealingCards, setDealingCards] = useState<DealingCard[]>([])
  const [isDealing, setIsDealing] = useState(false)
  const previousCardsRef = useRef<Record<number, string | null>>({})
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
          new THREE.PlaneGeometry(1.05, 1.38),
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
      const nextKey = slot.card ? `${slot.card.rank}-${slot.card.suit}` : null
      const previousKey = previousCardsRef.current[slot.playerId] ?? null
      nextPreviousCards[slot.playerId] = nextKey

      if (!slot.card && previousKey) {
        const [rank, suit] = previousKey.split("-")
        const previousSymbol = getSuitSymbol(suit)
        const from = getPlayedCardOverlayPosition(slot.playerId)
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
        }, 240)

        animationTimeoutsRef.current.push(clearInitId, clearStartId, clearEndId)
        continue
      }

      if (!slot.card || nextKey === previousKey) {
        continue
      }

      const card = slot.card
      const from = getHandOverlayPosition(slot.playerId, 1)
      const to = getPlayedCardOverlayPosition(slot.playerId)
      const animationKey = `${slot.playerId}-${nextKey}`

      const initId = window.setTimeout(() => {
        setAnimatingCards((current) => [
          ...current.filter((item) => item.key !== animationKey),
          {
            key: animationKey,
            rank: card.rank,
            suit: card.suit,
            suitSymbol: card.suitSymbol,
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

      const endId = window.setTimeout(() => {
        setAnimatingCards((current) => current.filter((item) => item.key !== animationKey))
      }, 360)

      animationTimeoutsRef.current.push(initId, startId, endId)
    }

    previousCardsRef.current = nextPreviousCards

    return () => {
      for (const timeoutId of animationTimeoutsRef.current) {
        window.clearTimeout(timeoutId)
      }
      animationTimeoutsRef.current = []
    }
  }, [model.slots])

  useEffect(() => {
    if (!dealAnimationNonce) {
      return
    }

    const dealTimeouts: number[] = []
    const order = [3, 4, 1, 2]
    const cardsToDeal = order.flatMap((playerId) =>
      Array.from({ length: 3 }, (_, index) => ({ playerId, index }))
    )

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
      const to = getHandOverlayPosition(playerId, index)
      const delay = sequenceIndex * 78

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
      }, delay + 420)

      dealTimeouts.push(initId, startId, endId)
    })

    const finishId = window.setTimeout(() => {
      setIsDealing(false)
    }, cardsToDeal.length * 78 + 460)
    dealTimeouts.push(finishId)

    return () => {
      for (const timeoutId of dealTimeouts) {
        window.clearTimeout(timeoutId)
      }
      setDealingCards([])
      setIsDealing(false)
    }
  }, [dealAnimationNonce])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          overflow: "hidden",
          background: usesIllustratedTable
            ? usesSteelPatioTable
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
                ? "none"
                : "drop-shadow(0 18px 26px rgba(0,0,0,0.34))",
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
        {model.centerDeck.show ? (
          <>
            <CodeCard
              left="50%"
              top="50.6%"
              rotation={90}
              rank={model.centerDeck.vira?.rank}
              suit={model.centerDeck.vira?.suit}
              suitSymbol={model.centerDeck.vira?.suitSymbol}
              scale={0.82}
            />
            {[2, 1, 0].map((layer) => (
              <CodeCard
                key={`center-deck-${layer}`}
                left={`calc(50% + ${layer * 0.45}px)`}
                top={`calc(50% - ${layer * 0.55}px)`}
                rotation={0}
                scale={0.8}
                faceDown
                opacity={0.98 - layer * 0.08}
              />
            ))}
          </>
        ) : null}

        {!isDealing && overlaySlots.map((slot) =>
          Array.from({ length: Math.min(slot.handCount, 3) }, (_, index) => {
            const stackPosition = getHandOverlayPosition(slot.playerId, index)

            return (
              <CodeCard
                key={`hand-${slot.playerId}-${index}`}
                left={stackPosition.left}
                top={stackPosition.top}
                rotation={stackPosition.rotation}
                scale={0.88}
                faceDown
              />
            )
          })
        )}

        {!isDealing && overlaySlots
          .filter((slot) => {
            if (!slot.card) return false

            const currentKey = `${slot.playerId}-${slot.card.rank}-${slot.card.suit}`
            return !animatingCards.some((item) => item.key === currentKey)
          })
          .map((slot) => (
            <CodeCard
              key={`played-${slot.playerId}`}
              left={slot.left}
              top={slot.top}
              rotation={0}
              highlight={slot.highlight}
              rank={slot.card?.rank}
              suit={slot.card?.suit}
              suitSymbol={slot.card?.suitSymbol}
            />
          ))}

        {animatingCards.map((card) => (
          <CodeCard
            key={card.key}
            left={card.stage === "from" ? card.from.left : card.to.left}
            top={card.stage === "from" ? card.from.top : card.to.top}
            rotation={card.stage === "from" ? card.from.rotation : 0}
            transition="left 360ms cubic-bezier(0.22, 0.9, 0.24, 1), top 360ms cubic-bezier(0.22, 0.9, 0.24, 1), transform 360ms cubic-bezier(0.22, 0.9, 0.24, 1)"
            rank={card.rank}
            suit={card.suit}
            suitSymbol={card.suitSymbol}
            highlight={card.highlight}
          />
        ))}

        {clearingCards.map((card) => (
          <CodeCard
            key={card.key}
            left={card.stage === "from" ? card.from.left : card.to.left}
            top={card.stage === "from" ? card.from.top : card.to.top}
            rotation={card.stage === "from" ? 0 : card.to.rotation}
            transition="left 220ms cubic-bezier(0.4, 0, 0.2, 1), top 220ms cubic-bezier(0.4, 0, 0.2, 1), transform 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms cubic-bezier(0.4, 0, 0.2, 1)"
            rank={card.rank}
            suit={card.suit}
            suitSymbol={card.suitSymbol}
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
            transition="left 360ms cubic-bezier(0.22, 0.9, 0.24, 1), top 360ms cubic-bezier(0.22, 0.9, 0.24, 1), transform 360ms cubic-bezier(0.22, 0.9, 0.24, 1), opacity 360ms cubic-bezier(0.22, 0.9, 0.24, 1)"
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

function getHandLayout(playerId: number): {
  x: number
  y: number
  rotation: number
  axis: "x" | "y"
} {
  switch (playerId) {
    case 3:
      return { x: 0, y: 1.72, rotation: Math.PI, axis: "x" }
    case 2:
      return { x: -2.18, y: 0, rotation: Math.PI / 2, axis: "y" }
    case 4:
      return { x: 2.18, y: 0, rotation: -Math.PI / 2, axis: "y" }
    default:
      return { x: 0, y: -1.72, rotation: 0, axis: "x" }
  }
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

function getPlayedCardOverlayPosition(playerId: number): { left: string; top: string } {
  const position = getPlayedCardPosition(playerId)

  return {
    left: `${((position.x + 2.8) / 5.6) * 100}%`,
    top: `${((2 - position.y) / 4) * 100}%`,
  }
}

function getClearingCardOverlayPosition(
  playerId: number
): { left: string; top: string; rotation: number } {
  const direction = (() => {
    switch (playerId) {
      case 3:
        return { x: 0, y: -0.18, rotation: -8 }
      case 2:
        return { x: 0.18, y: 0, rotation: 8 }
      case 4:
        return { x: -0.18, y: 0, rotation: -8 }
      default:
        return { x: 0, y: 0.18, rotation: 8 }
    }
  })()

  const position = getPlayedCardPosition(playerId)

  return {
    left: `${((position.x + direction.x + 2.8) / 5.6) * 100}%`,
    top: `${((2 - (position.y + direction.y)) / 4) * 100}%`,
    rotation: direction.rotation,
  }
}

function getHandOverlayPosition(
  playerId: number,
  index: number
): { left: string; top: string; rotation: number } {
  const layout = getHandLayout(playerId)
  const spread = index * 0.55

  if (layout.axis === "x") {
    return {
      left: `${((layout.x + spread / 10 + 2.8) / 5.6) * 100}%`,
      top: `${((2 - layout.y) / 4) * 100}%`,
      rotation: (layout.rotation * 180) / Math.PI,
    }
  }

  return {
    left: `${((layout.x + 2.8) / 5.6) * 100}%`,
    top: `${((2 - (layout.y + spread / 10)) / 4) * 100}%`,
    rotation: (layout.rotation * 180) / Math.PI,
  }
}

interface AnimatedCard {
  key: string
  rank: string
  suit: string
  suitSymbol: string
  highlight: boolean
  from: {
    left: string
    top: string
    rotation: number
  }
  to: {
    left: string
    top: string
  }
  stage: "from" | "to"
}

interface ClearingCard {
  key: string
  rank: string
  suit: string
  suitSymbol: string
  from: {
    left: string
    top: string
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
}: CodeCardProps) {
  const width = 64 * scale
  const height = 96 * scale
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
        borderRadius: "9px",
        overflow: "hidden",
        background: faceDown
          ? "linear-gradient(180deg, #7c2d12 0%, #92400e 100%)"
          : "linear-gradient(180deg, #fffdf5 0%, #f4ecd8 100%)",
        border: "1px solid rgba(120,82,48,0.35)",
        boxShadow: highlight
          ? "0 0 0 3px rgba(250,204,21,0.85), 0 10px 20px rgba(0,0,0,0.22)"
          : "0 8px 16px rgba(0,0,0,0.18)",
        color: suitColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: faceDown ? "7px" : "6px 7px",
        boxSizing: "border-box",
        transition,
        opacity,
      }}
    >
      {faceDown ? (
        <>
          <div
            style={{
              flex: 1,
              borderRadius: "7px",
              border: "2px solid rgba(255,244,214,0.45)",
              background:
                "radial-gradient(circle at center, rgba(245,158,11,0.65) 0%, rgba(124,45,18,0.15) 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "8px",
                borderRadius: "5px",
                border: "1px solid rgba(255,244,214,0.35)",
                background:
                  "repeating-linear-gradient(45deg, rgba(255,244,214,0.16) 0 6px, rgba(124,45,18,0.16) 6px 12px)",
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: "20px", fontWeight: 800, lineHeight: 1 }}>{rank}</div>
          <div style={{ fontSize: "34px", lineHeight: 1, alignSelf: "center" }}>{suitSymbol}</div>
          <div
            style={{
              fontSize: "20px",
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
          left: playerId === 2 ? "18%" : playerId === 4 ? "82%" : "50%",
          bottom: playerId === 3 ? "-8px" : playerId === 1 ? "-8px" : "calc(50% - 7px)",
          top: playerId === 2 || playerId === 4 ? "calc(50% - 7px)" : undefined,
          right: playerId === 4 ? "-8px" : undefined,
        }}
      />
    </div>
  )
}
