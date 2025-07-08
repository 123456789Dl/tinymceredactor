import { ADD_TEMPLATES, DELETE_TEMPLATES, GlobalStore, SELECTED_TEMPLATE } from "../store/store.js"

export class TemplateSelect extends HTMLElement {
    constructor() {
        super()

        this.attachShadow({ mode: 'open' })
        this.parent = null
        this.eventListenersList = []

        this.shadowRoot.innerHTML = `
        <style>
        .template-select {
        }

        .template-element {
            padding: 10px;
            color: white;
        }

        .template-element:hover {
            background-color: black ;
        }
        </style>
        <div class="template-select"></div>`
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

    updateView = (templates) => {
        this.parent.innerHTML = ""

        templates.forEach((value, key) => {
            this.parent.appendChild(this.createTemplate(key, value.index, value.isSelected))
        })

        const childDivs = this.parent.querySelectorAll("div")

        if (childDivs) {
            childDivs.forEach(div => {
                const currentTemplate = GlobalStore.templates.get(div.textContent)
                if (currentTemplate?.isSelected) {
                    div.style.backgroundColor = "black"
                }
            })
        }
    }

    createTemplate = (value, index, isSelected, type = "div") => {
        const childBlock = document.createElement("div")
        childBlock.textContent = value
        childBlock.id = `template-${index}`
        childBlock.className = "template-element"
        childBlock.style.backgroundColor = isSelected ? "black" : ""
        return childBlock
    }

    connectedCallback() {
        this.parent = this.shadowRoot.querySelector(".template-select")
        this.customAddEventListener(this.parent, "click", (event) => {
            const childDivs = this.parent.querySelectorAll("div")
            const selectedTemplateKey = event.target.textContent
            const selectedTemplate = GlobalStore.templates.get(selectedTemplateKey)
            selectedTemplate.isSelected = true
            GlobalStore.selectTemplate(selectedTemplate, SELECTED_TEMPLATE)

            if (childDivs) {
                childDivs.forEach(div => {
                    const currentTemplate = GlobalStore.templates.get(div.textContent)
                    div.style.backgroundColor = currentTemplate?.isSelected ? "black" : ""
                })
            }
        })
        GlobalStore.subscribe(this.updateView, ADD_TEMPLATES)
        GlobalStore.subscribe(this.updateView, DELETE_TEMPLATES)
    }

    disconnectedCallback() {
        this.removeEventListeners()
    }
}

customElements.define("template-select", TemplateSelect)