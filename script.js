// Main Script
window.textNodes = []
const modifiedHTML = ""

function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active")
  })
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active")
  })

  document.getElementById(tabName + "-tab").classList.add("active")
  event.target.classList.add("active")
}

function extractTextNodes(htmlString) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, "text/html")
  const textNodes = []

  function traverse(node, path = []) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim()
      if (text && text.length > 0) {
        const parent = node.parentElement
        if (parent && !["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
          textNodes.push({
            text: text,
            originalText: text,
            path: path.join(" > "),
            parentTag: parent.tagName.toLowerCase(),
            parentAttributes: Array.from(parent.attributes).reduce((acc, attr) => {
              acc[attr.name] = attr.value
              return acc
            }, {}),
            node: node,
          })
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase()
      if (!["script", "style", "noscript"].includes(tagName)) {
        const newPath = [...path, tagName]
        for (const child of node.childNodes) {
          traverse(child, newPath)
        }
      }
    }
  }

  traverse(doc.documentElement)
  return textNodes
}

function analyzeHTML() {
  const htmlInput = document.getElementById("html-input").value
  if (!htmlInput.trim()) {
    alert("Please paste the HTML")
    return
  }

  try {
    window.textNodes = extractTextNodes(htmlInput)
    renderTextNodes()
    enableVisualEditAfterAnalysis()
    showTab("edit")
    document.querySelector("[onclick=\"showTab('edit')\"]").classList.add("active")
  } catch (error) {
    alert("Error while parsing program: " + error.message)
  }
}

function enableVisualEditAfterAnalysis() {
  const visualEditContainer = document.getElementById("visual-edit-container")
  visualEditContainer.innerHTML = `
    <div class="alert alert-success">
      <i class='bx bx-check-circle'></i> HTML analyzed successfully! ${window.textNodes.length} editable text elements found.
      <br><br>
      <button class="btn btn-primary" onclick="startVisualEdit()" id="start-visual-edit">
        <i class='bx bx-edit'></i> Start Visual Editing
      </button>
      <button class="btn btn-secondary" onclick="exitVisualEdit()" style="margin-left: 10px; display: none;" id="exit-visual-edit">
        <i class='bx bx-x'></i> Exit Visual Edit
      </button>
      <button class="btn btn-success" onclick="saveVisualChanges()" style="margin-left: 10px; display: none;" id="save-visual-changes">
        <i class='bx bx-save'></i> Save Changes
      </button>
    </div>
    
    <div class="visual-edit-controls" style="margin-top: 15px;">
      <h4>Optional CSS Styling</h4>
      <textarea id="custom-css" placeholder="Enter custom CSS here..." class="input" style="min-height: 100px; margin-bottom: 10px;"></textarea>
      <div style="margin-bottom: 10px;">
        <input type="file" id="css-file-input" accept=".css" onchange="loadCSSFile(event)" class="input">
        <label for="css-file-input" style="margin-left: 10px;">Or upload CSS file</label>
      </div>
      <button class="btn btn-secondary" onclick="applyCSSToPreview()">
        <i class='bx bx-palette'></i> Apply CSS to Preview
      </button>
    </div>
  `
}

function startVisualEdit() {
  document.getElementById("visual-edit-preview").style.display = "block"
  document.getElementById("exit-visual-edit").style.display = "inline"
  document.getElementById("save-visual-changes").style.display = "inline"
  const previewFrame = document.getElementById("visual-preview-frame")
  previewFrame.innerHTML = document.getElementById("html-input").value
}

function exitVisualEdit() {
  document.getElementById("visual-edit-preview").style.display = "none"
  document.getElementById("exit-visual-edit").style.display = "none"
  document.getElementById("save-visual-changes").style.display = "none"
}

function saveVisualChanges() {
  const previewFrame = document.getElementById("visual-preview-frame")
  const modifiedHTML = previewFrame.innerHTML
  document.getElementById("output-html").value = modifiedHTML
}

function loadCSSFile(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      document.getElementById("custom-css").value = e.target.result
    }
    reader.readAsText(file)
  }
}

function applyCSSToPreview() {
  const customCSS = document.getElementById("custom-css").value
  const previewFrame = document.getElementById("visual-preview-frame")
  const styleElement = document.createElement("style")
  styleElement.type = "text/css"
  styleElement.innerHTML = customCSS
  previewFrame.appendChild(styleElement)
}

function renderTextNodes() {
  const container = document.getElementById("text-nodes-container")

  if (window.textNodes.length === 0) {
    container.innerHTML = '<div class="alert alert-info">No editable texts found</div>'
    return
  }

  container.innerHTML = `
                <div class="alert alert-success">
                    Found ${window.textNodes.length} text items for editing
                </div>
            `

  window.textNodes.forEach((node, index) => {
    const div = document.createElement("div")
    div.className = "text-item"
    div.innerHTML = `
        <div class="text-item-header">
            ${index + 1} <i class='bx bx-wifi-0'></i><i class='bx bx-wifi-0'></i><i class='bx bx-wifi-0'></i> <strong>${node.parentTag}</strong> - ${node.path}
        </div>
        <div class="text-item-original">
            Previous: "${node.originalText}" <i class='bx bxs-edit-alt'></i>
        </div>
        <input type="text" class="input" value="${node.text}" 
               onchange="updateTextNode(${index}, this.value)"
               placeholder="Enter new text...">
    `
    container.appendChild(div)
  })
}

function updateTextNode(index, newText) {
  window.textNodes[index].text = newText
  updatePreview()
}

function updatePreview() {
  const container = document.getElementById("preview-container")
  const changes = window.textNodes.filter((node) => node.text !== node.originalText)

  if (changes.length === 0) {
    container.innerHTML = '<div class="alert alert-info">No changes to preview</div>'
    return
  }

  container.innerHTML = `
                <div class="alert alert-success">
                    Preview ${changes.length} changes:
                </div>
            `

  changes.forEach((node) => {
    const div = document.createElement("div")
    div.className = "preview-diff"
    div.innerHTML = `
                    <div><strong>${node.parentTag}</strong> - ${node.path}</div>
                    <div style="margin-top: 0.5rem;">
                        <span class="diff-original">${node.originalText}</span>
                        →
                        <span class="diff-new">${node.text}</span>
                    </div>
                `
    container.appendChild(div)
  })

  generateModifiedHTML()
}

function generateModifiedHTML() {
  const originalHTML = document.getElementById("html-input").value
  let modifiedHTML = originalHTML

  const sortedNodes = [...window.textNodes].sort((a, b) => b.originalText.length - a.originalText.length)

  sortedNodes.forEach((node) => {
    if (node.text !== node.originalText) {
      const regex = new RegExp(escapeRegExp(node.originalText), "g")
      modifiedHTML = modifiedHTML.replace(regex, node.text)
    }
  })

  document.getElementById("output-html").value = modifiedHTML
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function downloadHTML() {
  const modifiedHTML = document.getElementById("output-html").value
  if (!modifiedHTML.trim()) {
    alert("No modified HTML to download")
    return
  }

  const blob = new Blob([modifiedHTML], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "modified.html"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function copyToClipboard() {
  const textarea = document.getElementById("output-html")
  textarea.select()
  document.execCommand("copy")
  alert("Copied to clipboard!")
}