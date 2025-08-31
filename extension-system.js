const extensionSystem = {
    extensions: [],

    init() {
        const saved = localStorage.getItem("extensions");
        this.extensions = saved ? JSON.parse(saved) : [];
        this.renderList();
    },

    renderList() {
        const container = document.getElementById("extensions-list");
        container.innerHTML = "";

        if (this.extensions.length === 0) {
            container.innerHTML = "<div class='alert alert-info'>No extensions installed</div>";
            return;
        }

        this.extensions.forEach((ext, i) => {
            const div = document.createElement("div");
            div.className = "extension-item";
            div.innerHTML = `
                <strong>${ext.name}</strong> 
                <span style="color:gray;">(${ext.src})</span>
                <label style="margin-left:1rem;">
                    <input type="checkbox" ${ext.enabled ? "checked" : ""} onchange="extensionSystem.toggle(${i}, this.checked)">
                    Enabled
                </label>
                <button class="button button-secondary" onclick="extensionSystem.remove(${i})"><i class='bx bx-trash'></i> Remove</button>
            `;
            container.appendChild(div);
        });
    },

    addNewExtension() {
        document.getElementById("extension-editor").style.display = "block";
    },

    saveExtension() {
        const name = document.getElementById("extension-name").value.trim();
        const src = document.getElementById("extension-url").value.trim();
        if (!name || !src) return alert("Please fill all fields");

        this.extensions.push({ name, src, enabled: true });
        localStorage.setItem("extensions", JSON.stringify(this.extensions));
        this.cancelExtensionEdit();
        this.renderList();
    },

    cancelExtensionEdit() {
        document.getElementById("extension-editor").style.display = "none";
        document.getElementById("extension-name").value = "";
        document.getElementById("extension-url").value = "";
    },

    toggle(index, enabled) {
        this.extensions[index].enabled = enabled;
        localStorage.setItem("extensions", JSON.stringify(this.extensions));
    },

    remove(index) {
        this.extensions.splice(index, 1);
        localStorage.setItem("extensions", JSON.stringify(this.extensions));
        this.renderList();
    },

    exportExtensions() {
        const data = JSON.stringify(this.extensions, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "extensions.json";
        a.click();
    }
};

function importExtensionsFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            extensionSystem.extensions = JSON.parse(e.target.result);
            localStorage.setItem("extensions", JSON.stringify(extensionSystem.extensions));
            extensionSystem.renderList();
        } catch (err) {
            alert("Invalid JSON file");
        }
    };
    reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => extensionSystem.init());
