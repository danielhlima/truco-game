import { initLogger, getLogsAsText } from "../utils/logger"
import { playMatch } from "./playMatch"

initLogger()

const result = playMatch("PAULISTA")

console.log("Resultado final da partida:", result)

setTimeout(() => {
  renderLogPanel()
}, 100)

function renderLogPanel() {
  const existingPanel = document.getElementById("truco-log-panel")
  if (existingPanel) {
    existingPanel.remove()
  }

  const logs = getLogsAsText()

  const panel = document.createElement("div")
  panel.id = "truco-log-panel"
  panel.style.position = "fixed"
  panel.style.top = "10px"
  panel.style.right = "10px"
  panel.style.width = "420px"
  panel.style.maxHeight = "90vh"
  panel.style.background = "white"
  panel.style.border = "1px solid #ccc"
  panel.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"
  panel.style.zIndex = "999999"
  panel.style.padding = "12px"
  panel.style.fontFamily = "monospace"
  panel.style.overflow = "hidden"
  panel.style.display = "flex"
  panel.style.flexDirection = "column"

  const title = document.createElement("h3")
  title.textContent = "Log da partida"
  title.style.margin = "0 0 8px 0"

  const buttonRow = document.createElement("div")
  buttonRow.style.display = "flex"
  buttonRow.style.gap = "8px"
  buttonRow.style.marginBottom = "8px"

  const copyButton = document.createElement("button")
  copyButton.textContent = "Copiar log"
  copyButton.style.padding = "8px 12px"
  copyButton.style.cursor = "pointer"

  const closeButton = document.createElement("button")
  closeButton.textContent = "Fechar"
  closeButton.style.padding = "8px 12px"
  closeButton.style.cursor = "pointer"

  const textArea = document.createElement("textarea")
  textArea.value = logs
  textArea.readOnly = true
  textArea.style.width = "100%"
  textArea.style.height = "70vh"
  textArea.style.resize = "none"
  textArea.style.fontFamily = "monospace"
  textArea.style.fontSize = "12px"
  textArea.style.whiteSpace = "pre"
  textArea.style.boxSizing = "border-box"

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(logs)
      alert("Log copiado com sucesso!")
    } catch {
      textArea.focus()
      textArea.select()
      alert("Clipboard falhou. O texto foi selecionado para cópia manual.")
    }
  })

  closeButton.addEventListener("click", () => {
    panel.remove()
  })

  buttonRow.appendChild(copyButton)
  buttonRow.appendChild(closeButton)

  panel.appendChild(title)
  panel.appendChild(buttonRow)
  panel.appendChild(textArea)

  document.body.appendChild(panel)
}