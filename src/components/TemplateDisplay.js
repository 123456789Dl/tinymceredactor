import { CHANGE_TEMPLATE, GlobalStore } from "../store/store.js"

class TemplateDisplay extends HTMLElement {
    constructor() {
        super()

        this.attachShadow({ mode: 'open' })
        this.eventListenersList = []

        this.shadowRoot.innerHTML = `
        <style>
            .template-display {
                padding: 5px;
                width: 100%;
            }
        </style>
        <input class="template-display"></input>`
    }

    customAddEventListener = (element, event, callback) => {
        element.addEventListener(event, callback)

        this.eventListenersList.push({
            element,
            event,
            callback
        })
    }

    removeEventListeners = () => {
        this.eventListenersList.forEach(el => {
            if (el && el.element) {
                el.element.removeEventListener(el.event, el.callback)
            }
        })
    }

    saveTemplateDisplay = (value) => {
        GlobalStore.changeTemplate(value)
    }

    onStoreChanged = (template) => {
        const templateDisplay = this.shadowRoot.querySelector(".template-display")
        templateDisplay.value = template?.key ?? ""

        this.customAddEventListener(templateDisplay, "blur", (event) => {
            this.saveTemplateDisplay(templateDisplay.value)
        })

        templateDisplay.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault()
                templateDisplay.blur()
            }
        })
        
    }

    connectedCallback() {
        GlobalStore.subscribe(this.onStoreChanged)
    }

    disconnectedCallback() {
        GlobalStore.unsubscribe(this.onStoreChanged)
        this.removeEventListeners()
    }
}

customElements.define("template-display", TemplateDisplay)