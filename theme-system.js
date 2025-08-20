// Theme System
class ThemeSystem {
  constructor() {
    this.themes = new Map()
    this.currentTheme = "default"
    this.init()
  }

  init() {
    this.loadBuiltInThemes()

    this.loadSavedThemes()

    const savedTheme = localStorage.getItem("blastbox-current-theme") || "default"
    this.applyTheme(savedTheme)

    this.setupThemeSelector()

    this.updateThemesList()
  }

  loadBuiltInThemes() {
    this.themes.set("default", {
      name: "Default Dark",
      description: "The original BlastBox dark theme",
      author: "BlastBox",
      version: "1.0.0",
      colors: {
        background: "14 17 22",
        foreground: "230 230 230",
        card: "26 29 36",
        "card-foreground": "230 230 230",
        popover: "26 29 36",
        "popover-foreground": "230 230 230",
        primary: "34 211 238",
        "primary-foreground": "14 17 22",
        secondary: "42 47 58",
        "secondary-foreground": "230 230 230",
        muted: "42 47 58",
        "muted-foreground": "156 163 175",
        accent: "34 211 238",
        "accent-foreground": "14 17 22",
        destructive: "127 29 29",
        "destructive-foreground": "248 250 252",
        border: "42 47 58",
        input: "42 47 58",
        ring: "14 165 233",
        search: "26 29 36 / 50%",
      },
    })

    this.themes.set("light", {
      name: "Light Mode",
      description: "Clean light theme for daytime coding",
      author: "BlastBox",
      version: "1.0.0",
      colors: {
        background: "255 255 255",
        foreground: "15 23 42",
        card: "248 250 252",
        "card-foreground": "15 23 42",
        popover: "255 255 255",
        "popover-foreground": "15 23 42",
        primary: "59 130 246",
        "primary-foreground": "248 250 252",
        secondary: "241 245 249",
        "secondary-foreground": "15 23 42",
        muted: "241 245 249",
        "muted-foreground": "100 116 139",
        accent: "59 130 246",
        "accent-foreground": "248 250 252",
        destructive: "239 68 68",
        "destructive-foreground": "248 250 252",
        border: "226 232 240",
        input: "255 255 255",
        ring: "59 130 246",
        search: "241 245 249 / 80%",
      },
    })

    this.themes.set("purple", {
      name: "Purple Haze",
      description: "Vibrant purple theme for creative minds",
      author: "BlastBox",
      version: "1.0.0",
      colors: {
        background: "17 12 28",
        foreground: "230 230 250",
        card: "30 20 45",
        "card-foreground": "230 230 250",
        popover: "30 20 45",
        "popover-foreground": "230 230 250",
        primary: "147 51 234",
        "primary-foreground": "248 250 252",
        secondary: "45 35 65",
        "secondary-foreground": "230 230 250",
        muted: "45 35 65",
        "muted-foreground": "156 163 175",
        accent: "168 85 247",
        "accent-foreground": "248 250 252",
        destructive: "239 68 68",
        "destructive-foreground": "248 250 252",
        border: "55 48 107",
        input: "45 35 65",
        ring: "147 51 234",
        search: "30 20 45 / 50%",
      },
    })

    this.themes.set("green", {
      name: "Forest Green",
      description: "Nature-inspired green theme",
      author: "BlastBox",
      version: "1.0.0",
      colors: {
        background: "12 20 12",
        foreground: "240 253 244",
        card: "20 30 20",
        "card-foreground": "240 253 244",
        popover: "20 30 20",
        "popover-foreground": "240 253 244",
        primary: "34 197 94",
        "primary-foreground": "12 20 12",
        secondary: "35 55 35",
        "secondary-foreground": "240 253 244",
        muted: "35 55 35",
        "muted-foreground": "156 163 175",
        accent: "74 222 128",
        "accent-foreground": "12 20 12",
        destructive: "239 68 68",
        "destructive-foreground": "248 250 252",
        border: "45 75 45",
        input: "35 55 35",
        ring: "34 197 94",
        search: "20 30 20 / 50%",
      },
    })

    this.themes.set("orange", {
      name: "Sunset Orange",
      description: "Warm orange theme for cozy coding",
      author: "BlastBox",
      version: "1.0.0",
      colors: {
        background: "28 17 12",
        foreground: "253 244 240",
        card: "45 30 20",
        "card-foreground": "253 244 240",
        popover: "45 30 20",
        "popover-foreground": "253 244 240",
        primary: "249 115 22",
        "primary-foreground": "28 17 12",
        secondary: "65 45 35",
        "secondary-foreground": "253 244 240",
        muted: "65 45 35",
        "muted-foreground": "156 163 175",
        accent: "251 146 60",
        "accent-foreground": "28 17 12",
        destructive: "239 68 68",
        "destructive-foreground": "248 250 252",
        border: "107 75 55",
        input: "65 45 35",
        ring: "249 115 22",
        search: "45 30 20 / 50%",
      },
    })
  }

  // Be careful: editing the rest of the code may break the functionality of themes from the official source created for the original code
  loadSavedThemes() {
    const savedThemes = localStorage.getItem("blastbox-custom-themes")
    if (savedThemes) {
      try {
        const themes = JSON.parse(savedThemes)
        Object.entries(themes).forEach(([key, theme]) => {
          this.themes.set(key, theme)
        })
      } catch (error) {
        console.error("Error loading saved themes:", error)
      }
    }
  }

  saveCustomThemes() {
    const customThemes = {}
    this.themes.forEach((theme, key) => {
      if (!["default", "light", "purple", "green", "orange"].includes(key)) {
        customThemes[key] = theme
      }
    })
    localStorage.setItem("blastbox-custom-themes", JSON.stringify(customThemes))
  }

  applyTheme(themeKey) {
    const theme = this.themes.get(themeKey)
    if (!theme) {
      console.error(`Theme "${themeKey}" not found`)
      return
    }

    const root = document.documentElement
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value)
    })

    this.currentTheme = themeKey
    localStorage.setItem("blastbox-current-theme", themeKey)

    const themeSelect = document.getElementById("theme-select")
    if (themeSelect) {
      themeSelect.value = themeKey
    }

    this.updateThemesList()
  }

  setupThemeSelector() {
    const themeSelect = document.getElementById("theme-select")
    if (!themeSelect) return

    themeSelect.innerHTML = ""

    this.themes.forEach((theme, key) => {
      const option = document.createElement("option")
      option.value = key
      option.textContent = theme.name
      themeSelect.appendChild(option)
    })

    themeSelect.value = this.currentTheme

    themeSelect.addEventListener("change", (e) => {
      this.applyTheme(e.target.value)
    })
  }

  updateThemesList() {
    const themesList = document.getElementById("themes-list")
    if (!themesList) return

    themesList.innerHTML = ""

    this.themes.forEach((theme, key) => {
      const themeCard = document.createElement("div")
      themeCard.className = `theme-card ${key === this.currentTheme ? "active" : ""}`

      const colorPreview = document.createElement("div")
      colorPreview.className = "theme-preview"

      const mainColors = ["primary", "secondary", "accent", "background", "foreground"]
      mainColors.forEach((colorKey) => {
        if (theme.colors[colorKey]) {
          const colorDiv = document.createElement("div")
          colorDiv.className = "theme-color"
          colorDiv.style.backgroundColor = `rgb(${theme.colors[colorKey]})`
          colorPreview.appendChild(colorDiv)
        }
      })

      themeCard.innerHTML = `
                <h4>${theme.name}</h4>
                <p>${theme.description}</p>
                <div class="theme-preview">${colorPreview.innerHTML}</div>
                <div class="theme-card-actions">
                    <button class="button" onclick="themeSystem.applyTheme('${key}')">
                        <i class='bx bx-check'></i> Apply
                    </button>
                    ${
                      !["default", "light", "purple", "green", "orange"].includes(key)
                        ? `
                        <button class="button button-secondary" onclick="themeSystem.editTheme('${key}')">
                            <i class='bx bx-edit'></i> Edit
                        </button>
                        <button class="button" style="background: rgb(var(--destructive));" onclick="themeSystem.deleteTheme('${key}')">
                            <i class='bx bx-trash'></i> Delete
                        </button>
                    `
                        : ""
                    }
                    <button class="button button-secondary" onclick="themeSystem.exportTheme('${key}')">
                        <i class='bx bx-export'></i> Export
                    </button>
                </div>
            `

      themesList.appendChild(themeCard)
    })
  }

  createNewTheme() {
    const themeEditor = document.getElementById("theme-editor")
    const themeNameInput = document.getElementById("theme-name")
    const themeJsonTextarea = document.getElementById("theme-json")

    themeEditor.style.display = "block"

    themeNameInput.value = ""

    const template = {
      name: "My Custom Theme",
      description: "A custom theme created by me",
      author: "User",
      version: "1.0.0",
      colors: {
        background: "14 17 22",
        foreground: "230 230 230",
        card: "26 29 36",
        "card-foreground": "230 230 230",
        popover: "26 29 36",
        "popover-foreground": "230 230 230",
        primary: "34 211 238",
        "primary-foreground": "14 17 22",
        secondary: "42 47 58",
        "secondary-foreground": "230 230 230",
        muted: "42 47 58",
        "muted-foreground": "156 163 175",
        accent: "34 211 238",
        "accent-foreground": "14 17 22",
        destructive: "127 29 29",
        "destructive-foreground": "248 250 252",
        border: "42 47 58",
        input: "42 47 58",
        ring: "14 165 233",
        search: "26 29 36 / 50%",
      },
    }

    themeJsonTextarea.value = JSON.stringify(template, null, 2)
    themeNameInput.focus()
  }

  editTheme(themeKey) {
    const theme = this.themes.get(themeKey)
    if (!theme) return

    const themeEditor = document.getElementById("theme-editor")
    const themeNameInput = document.getElementById("theme-name")
    const themeJsonTextarea = document.getElementById("theme-json")

    themeEditor.style.display = "block"

    themeNameInput.value = themeKey
    themeJsonTextarea.value = JSON.stringify(theme, null, 2)

    themeEditor.dataset.editingTheme = themeKey
  }

  saveTheme() {
    const themeNameInput = document.getElementById("theme-name")
    const themeJsonTextarea = document.getElementById("theme-json")
    const themeEditor = document.getElementById("theme-editor")

    const themeName = themeNameInput.value.trim()
    const themeJsonText = themeJsonTextarea.value.trim()

    if (!themeName) {
      alert("Please enter a theme name")
      return
    }

    let themeData
    try {
      themeData = JSON.parse(themeJsonText)
    } catch (error) {
      alert("Invalid JSON format. Please check your theme configuration.")
      return
    }

    if (!themeData.colors || typeof themeData.colors !== "object") {
      alert('Theme must have a "colors" object')
      return
    }

    const themeKey = themeName.toLowerCase().replace(/[^a-z0-9]/g, "-")

    const editingTheme = themeEditor.dataset.editingTheme
    if (editingTheme && editingTheme !== themeKey) {
      this.themes.delete(editingTheme)
    }

    this.themes.set(themeKey, themeData)
    this.saveCustomThemes()

    this.setupThemeSelector()
    this.updateThemesList()

    this.cancelThemeEdit()

    alert("Theme saved successfully!")
  }

  deleteTheme(themeKey) {
    if (confirm(`Are you sure you want to delete the theme "${this.themes.get(themeKey)?.name}"?`)) {
      this.themes.delete(themeKey)
      this.saveCustomThemes()

      if (this.currentTheme === themeKey) {
        this.applyTheme("default")
      }

      this.setupThemeSelector()
      this.updateThemesList()
    }
  }

  previewTheme() {
    const themeJsonTextarea = document.getElementById("theme-json")

    try {
      const themeData = JSON.parse(themeJsonTextarea.value)
      if (!themeData.colors) {
        alert('Theme must have a "colors" object')
        return
      }

      const root = document.documentElement
      Object.entries(themeData.colors).forEach(([property, value]) => {
        root.style.setProperty(`--${property}`, value)
      })

      alert('Theme preview applied! Click "Save Theme" to keep it or "Cancel" to revert.')
    } catch (error) {
      alert("Invalid JSON format. Please check your theme configuration.")
    }
  }

  cancelThemeEdit() {
    const themeEditor = document.getElementById("theme-editor")
    themeEditor.style.display = "none"
    delete themeEditor.dataset.editingTheme

    this.applyTheme(this.currentTheme)
  }

  exportTheme(themeKey) {
    const theme = this.themes.get(themeKey)
    if (!theme) return

    const dataStr = JSON.stringify(theme, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(dataBlob)
    link.download = `${themeKey}-theme.json`
    link.click()
  }

  exportCurrentTheme() {
    this.exportTheme(this.currentTheme)
  }

  importTheme(themeData, filename) {
    try {
      if (!themeData.colors || typeof themeData.colors !== "object") {
        throw new Error("Invalid theme format: missing colors object")
      }

      const themeKey = (filename?.replace(".json", "") || themeData.name || "imported-theme")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")

      if (this.themes.has(themeKey)) {
        if (!confirm(`Theme "${themeKey}" already exists. Do you want to overwrite it?`)) {
          return
        }
      }

      this.themes.set(themeKey, themeData)
      this.saveCustomThemes()

      this.setupThemeSelector()
      this.updateThemesList()

      alert(`Theme "${themeData.name || themeKey}" imported successfully!`)

      if (confirm("Do you want to apply this theme now?")) {
        this.applyTheme(themeKey)
      }
    } catch (error) {
      alert(`Error importing theme: ${error.message}`)
    }
  }
}

const themeSystem = new ThemeSystem()

function showTab(tabName) {
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((content) => content.classList.remove("active"))

  const tabs = document.querySelectorAll(".tab")
  tabs.forEach((tab) => tab.classList.remove("active"))

  const selectedContent = document.getElementById(`${tabName}-tab`)
  if (selectedContent) {
    selectedContent.classList.add("active")
  }

  const selectedTab = document.querySelector(`[onclick="showTab('${tabName}')"]`)
  if (selectedTab) {
    selectedTab.classList.add("active")
  }
}

function openThemeManager() {
  const modal = document.getElementById("theme-modal")
  const themeGrid = document.getElementById("theme-grid")

  themeGrid.innerHTML = ""
  themeGrid.className = "theme-grid"

  themeSystem.themes.forEach((theme, key) => {
    const themeCard = document.createElement("div")
    themeCard.className = `theme-card ${key === themeSystem.currentTheme ? "active" : ""}`
    themeCard.onclick = () => {
      themeSystem.applyTheme(key)
      closeThemeManager()
    }

    const colorPreview = document.createElement("div")
    colorPreview.className = "theme-preview"

    const mainColors = ["primary", "secondary", "accent", "background", "foreground"]
    mainColors.forEach((colorKey) => {
      if (theme.colors[colorKey]) {
        const colorDiv = document.createElement("div")
        colorDiv.className = "theme-color"
        colorDiv.style.backgroundColor = `rgb(${theme.colors[colorKey]})`
        colorPreview.appendChild(colorDiv)
      }
    })

    themeCard.innerHTML = `
            <h4>${theme.name}</h4>
            <p>${theme.description}</p>
            ${colorPreview.outerHTML}
        `

    themeGrid.appendChild(themeCard)
  })

  modal.style.display = "flex"
}

function closeThemeManager() {
  const modal = document.getElementById("theme-modal")
  modal.style.display = "none"
}

function createNewTheme() {
  themeSystem.createNewTheme()
}

function exportCurrentTheme() {
  themeSystem.exportCurrentTheme()
}

function importThemeFile(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const themeData = JSON.parse(e.target.result)
      themeSystem.importTheme(themeData, file.name)
    } catch (error) {
      alert("Error reading theme file: Invalid JSON format")
    }
  }
  reader.readAsText(file)

  event.target.value = ""
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById("theme-modal")
  if (e.target === modal) {
    closeThemeManager()
  }
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeThemeManager()
  }
})