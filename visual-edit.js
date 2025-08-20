// Visual Edit Beta
let visualEditMode = false
let visualEditFrame = null
let editableElements = []
let currentEditingElement = null
const visualChanges = []

function startVisualEdit() {
  const htmlInput = document.getElementById("html-input").value
  if (!htmlInput.trim()) {
    alert("Please paste HTML code first and analyze it")
    return
  }

  if (typeof window.textNodes === "undefined" || window.textNodes.length === 0) {
    alert("Please analyze HTML first by going to 'Paste HTML' tab and clicking 'Analyze HTML'")
    return
  }

  console.log("Starting visual edit with", window.textNodes.length, "text nodes")

  visualEditMode = true
  createVisualEditFrame(htmlInput)

  document.getElementById("start-visual-edit").style.display = "none"
  document.getElementById("exit-visual-edit").style.display = "inline-flex"
  document.getElementById("save-visual-changes").style.display = "inline-flex"
}

function createVisualEditFrame(htmlContent) {
  const container = document.getElementById("visual-edit-container")

  const customCSS = document.getElementById("custom-css").value
  let styledHTML = htmlContent

  if (customCSS.trim()) {
    const cssTag = `<style>${customCSS}</style>`
    if (styledHTML.includes("</head>")) {
      styledHTML = styledHTML.replace("</head>", cssTag + "</head>")
    } else {
      styledHTML = cssTag + styledHTML
    }
  }

  container.innerHTML = `
    <div class="visual-edit-status" id="visual-edit-status">
      <div class="status-indicator">
        <i class='bx bx-edit'></i>
        Visual Edit Mode Active
      </div>
      <div style="font-size: 0.75rem; color: rgb(var(--muted-foreground)); margin-top: 0.25rem;">
        Click on highlighted text to edit • ${window.textNodes.length} editable elements found
      </div>
    </div>
    <div class="visual-edit-frame-container">
      <iframe class="visual-edit-frame" id="visual-edit-frame" srcdoc="${escapeHTML(styledHTML)}"></iframe>
      <div class="visual-edit-overlay" id="visual-edit-overlay"></div>
    </div>
  `

  visualEditFrame = document.getElementById("visual-edit-frame")

  visualEditFrame.onload = () => {
    console.log("Iframe loaded, setting up visual editing")
    setTimeout(() => {
      const iframeDoc = visualEditFrame.contentDocument || visualEditFrame.contentWindow.document
      const contentHeight = Math.max(
        iframeDoc.body.scrollHeight,
        iframeDoc.body.offsetHeight,
        iframeDoc.documentElement.clientHeight,
        iframeDoc.documentElement.scrollHeight,
        iframeDoc.documentElement.offsetHeight,
      )

      visualEditFrame.style.height = contentHeight + "px"
      visualEditFrame.style.overflow = "auto"

      const frameContainer = document.querySelector(".visual-edit-frame-container")
      frameContainer.style.maxHeight = "70vh"
      frameContainer.style.overflow = "auto"
      frameContainer.style.position = "relative"

      setupVisualEditing()
    }, 500)
  }
}

function setupVisualEditing() {
  const iframe = visualEditFrame
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  const overlay = document.getElementById("visual-edit-overlay")

  editableElements = []

  console.log("Setting up editing for", window.textNodes.length, "text nodes")

  window.textNodes.forEach((textNode, index) => {
    const textNodeElements = findSpecificTextNodes(iframeDoc, textNode.originalText)

    textNodeElements.forEach((nodeInfo, nodeIndex) => {
      editableElements.push({
        element: nodeInfo.parentElement,
        textNode: nodeInfo.textNode,
        textNodeIndex: index,
        nodeIndex: nodeIndex,
        originalText: textNode.originalText,
        currentText: textNode.text,
        uniqueId: `${index}-${nodeIndex}`,
      })
    })
  })

  console.log("Found", editableElements.length, "editable elements in iframe")

  createEditableHighlights(iframe, overlay)
}

function findSpecificTextNodes(doc, text) {
  const walker = doc.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        return node.textContent.trim() === text.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
      },
    },
    false,
  )

  const results = []
  let node

  while ((node = walker.nextNode())) {
    results.push({
      textNode: node,
      parentElement: node.parentElement,
    })
  }

  return results
}

function createEditableHighlights(iframe, overlay) {
  overlay.innerHTML = ""

  editableElements.forEach((editableEl, index) => {
    const element = editableEl.element

    const highlight = document.createElement("div")
    highlight.className = "editable-highlight"
    highlight.style.position = "absolute"
    highlight.style.backgroundColor = "rgba(59, 130, 246, 0.2)"
    highlight.style.border = "2px solid rgb(59, 130, 246)"
    highlight.style.cursor = "pointer"
    highlight.style.borderRadius = "4px"
    highlight.style.zIndex = "1000"
    highlight.dataset.index = index
    highlight.dataset.uniqueId = editableEl.uniqueId

    const tooltip = document.createElement("div")
    tooltip.className = "edit-tooltip"
    tooltip.textContent = `Click to edit: "${editableEl.originalText.substring(0, 30)}${editableEl.originalText.length > 30 ? "..." : ""}"`
    tooltip.style.position = "absolute"
    tooltip.style.backgroundColor = "rgb(var(--background))"
    tooltip.style.color = "rgb(var(--foreground))"
    tooltip.style.padding = "4px 8px"
    tooltip.style.borderRadius = "4px"
    tooltip.style.fontSize = "12px"
    tooltip.style.border = "1px solid rgb(var(--border))"
    tooltip.style.display = "none"
    tooltip.style.zIndex = "1001"
    tooltip.style.whiteSpace = "nowrap"

    const updatePosition = () => {
      const range = iframe.contentDocument.createRange()
      range.selectNodeContents(editableEl.textNode)
      const rect = range.getBoundingClientRect()

      highlight.style.left = rect.left + "px"
      highlight.style.top = rect.top + "px"
      highlight.style.width = Math.max(rect.width, 20) + "px"
      highlight.style.height = Math.max(rect.height, 20) + "px"

      tooltip.style.left = rect.left + "px"
      tooltip.style.top = rect.top - 35 + "px"
    }

    updatePosition()

    highlight.addEventListener("mouseenter", () => {
      tooltip.style.display = "block"
    })

    highlight.addEventListener("mouseleave", () => {
      tooltip.style.display = "none"
    })

    highlight.addEventListener("click", (e) => {
      e.stopPropagation()
      const range = iframe.contentDocument.createRange()
      range.selectNodeContents(editableEl.textNode)
      const rect = range.getBoundingClientRect()
      startInlineEdit(editableEl, highlight, rect)
    })

    overlay.appendChild(highlight)
    overlay.appendChild(tooltip)

    highlight.updatePosition = updatePosition
  })

  console.log("Created", editableElements.length, "highlight overlays with individual text node positioning")
}

function startInlineEdit(editableEl, highlight, rect) {
  if (currentEditingElement) {
    cancelInlineEdit()
  }

  currentEditingElement = editableEl
  highlight.classList.add("editing")

  const editor = document.createElement("div")
  editor.className = "inline-editor"
  editor.style.left = rect.left + "px"
  editor.style.top = rect.bottom + 10 + "px"

  const input = document.createElement("input")
  input.type = "text"
  input.value = editableEl.currentText
  input.id = "inline-input"

  const saveButton = document.createElement("button")
  saveButton.className = "button"
  saveButton.innerHTML = `<i class='bx bx-check'></i> Save`
  saveButton.style.pointerEvents = "auto"
  saveButton.style.cursor = "pointer"

  const cancelButton = document.createElement("button")
  cancelButton.className = "button button-secondary"
  cancelButton.innerHTML = `<i class='bx bx-x'></i> Cancel`
  cancelButton.style.pointerEvents = "auto"
  cancelButton.style.cursor = "pointer"

  const actionsDiv = document.createElement("div")
  actionsDiv.className = "inline-editor-actions"
  actionsDiv.appendChild(saveButton)
  actionsDiv.appendChild(cancelButton)

  editor.appendChild(input)
  editor.appendChild(actionsDiv)

  saveButton.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    saveInlineEdit()
  })

  cancelButton.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    cancelInlineEdit()
  })

  document.getElementById("visual-edit-overlay").appendChild(editor)

  input.focus()
  input.select()

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      saveInlineEdit()
    } else if (e.key === "Escape") {
      e.preventDefault()
      cancelInlineEdit()
    }
  })

  console.log("Created inline editor with fixed positioning")
}

function saveInlineEdit() {
  if (!currentEditingElement) return

  const input = document.getElementById("inline-input")
  if (!input) return

  const newText = input.value

  currentEditingElement.textNode.textContent = newText
  currentEditingElement.currentText = newText

  window.textNodes[currentEditingElement.textNodeIndex].text = newText

  const existingChangeIndex = visualChanges.findIndex((change) => change.uniqueId === currentEditingElement.uniqueId)

  if (existingChangeIndex >= 0) {
    visualChanges[existingChangeIndex].newText = newText
  } else {
    visualChanges.push({
      textNodeIndex: currentEditingElement.textNodeIndex,
      uniqueId: currentEditingElement.uniqueId,
      originalText: currentEditingElement.originalText,
      newText: newText,
      element: currentEditingElement.element,
      textNode: currentEditingElement.textNode,
    })
  }

  setTimeout(() => {
    updateAllHighlights()
  }, 50)

  if (typeof window.updatePreview === "function") {
    window.updatePreview()
  }

  cancelInlineEdit()

  console.log("Saved change:", newText, "Total changes:", visualChanges.length)

  showChangesSavedFeedback()
}

function updateAllHighlights() {
  const highlights = document.querySelectorAll(".editable-highlight")
  const tooltips = document.querySelectorAll(".edit-tooltip")

  editableElements.forEach((editableEl, index) => {
    const highlight = highlights[index]
    const tooltip = tooltips[index]

    if (highlight && editableEl.textNode) {
      const range = document.createRange()
      range.selectNodeContents(editableEl.textNode)
      const rect = range.getBoundingClientRect()

      highlight.style.left = rect.left + "px"
      highlight.style.top = rect.top + "px"
      highlight.style.width = Math.max(rect.width, 20) + "px"
      highlight.style.height = Math.max(rect.height, 20) + "px"

      if (tooltip) {
        tooltip.style.left = rect.left + "px"
        tooltip.style.top = rect.top - 35 + "px"
        tooltip.textContent = `Click to edit: "${editableEl.currentText.substring(0, 30)}${editableEl.currentText.length > 30 ? "..." : ""}"`
      }
    }
  })

  console.log("Updated all highlight dimensions with precise text node positioning")
}

function exitVisualEdit() {
  visualEditMode = false
  currentEditingElement = null
  editableElements = []

  document.getElementById("start-visual-edit").style.display = "inline-flex"
  document.getElementById("exit-visual-edit").style.display = "none"
  document.getElementById("save-visual-changes").style.display = "none"

  hideVisualEditStatus()

  document.getElementById("visual-edit-container").innerHTML = `
        <div class="alert alert-info">
            Click "Start Visual Editing" to begin editing text directly on the page
        </div>
    `
}

function cancelInlineEdit() {
  const editor = document.querySelector(".inline-editor")
  if (editor) {
    if (editor.scrollListener && visualEditFrame && visualEditFrame.contentWindow) {
      visualEditFrame.contentWindow.removeEventListener("scroll", editor.scrollListener)
    }
    editor.remove()
  }

  const editingHighlight = document.querySelector(".editable-highlight.editing")
  if (editingHighlight) {
    editingHighlight.classList.remove("editing")
  }

  currentEditingElement = null
}

function loadCSSFile(event) {
  const file = event.target.files[0]
  if (file && file.type === "text/css") {
    const reader = new FileReader()
    reader.onload = (e) => {
      document.getElementById("custom-css").value = e.target.result
    }
    reader.readAsText(file)
  } else {
    alert("Please select a valid CSS file")
  }
}

function applyCSSToPreview() {
  if (visualEditMode && visualEditFrame) {
    const htmlInput = document.getElementById("html-input").value
    createVisualEditFrame(htmlInput)
  } else {
    alert("Please start Visual Edit mode first")
  }
}

function escapeHTML(html) {
  return html.replace(/"/g, "&quot;")
}

function showVisualEditStatus() {
  const status = document.getElementById("visual-edit-status")
  if (status) {
    status.classList.add("active")
  }
}

function hideVisualEditStatus() {
  const status = document.getElementById("visual-edit-status")
  if (status) {
    status.classList.remove("active")
  }
}

function showChangesSavedFeedback() {
  console.log("Changes saved feedback shown")
}

function saveVisualChanges() {
  console.log("Visual changes saved")
}

window.startVisualEdit = startVisualEdit
window.exitVisualEdit = exitVisualEdit
window.saveVisualChanges = saveVisualChanges
window.loadCSSFile = loadCSSFile
window.applyCSSToPreview = applyCSSToPreview
window.saveInlineEdit = saveInlineEdit
window.cancelInlineEdit = cancelInlineEdit
window.showChangesSavedFeedback = showChangesSavedFeedback
window.updateAllHighlights = updateAllHighlights
