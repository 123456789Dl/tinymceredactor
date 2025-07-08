export const SELECTED_TEMPLATE = "selectedTemplate"
export const TEMPLATES = "templates"
export const ADD_TEMPLATES = "addTemplates"
export const DELETE_TEMPLATES = "deleteTemplates"
export const CHANGE_TEMPLATE = "changeTemplate"

class Store {
    constructor() {
        this.listeners = {}
        this.selectedTemplate = null
        this.selectOptionState = new Map()
        this.templates = new Map()
    }

    selectTemplate(data, type) {
        if (type === SELECTED_TEMPLATE) {
            if (this.selectedTemplate) {
                this.selectedTemplate.isSelected = false
            }
            if (data) {
                this.selectedTemplate = data
                this.selectedTemplate.isSelected = true
                this.listeners[type]?.forEach(fn => fn(data))
            }
        } else if (type === ADD_TEMPLATES) {
            const { value, index, key, isSelected } = data
            this.templates.set(key, { value: value, index: index, key: key, isSelected: isSelected || false })
            this.listeners[type]?.forEach(fn => fn(this.templates))
        } else if (type === DELETE_TEMPLATES) {
            this.listeners[type]?.forEach(fn => fn(this.templates))
        } else if (type === CHANGE_TEMPLATE) {
            this.listeners[type]?.forEach(fn => fn(this.templates))
        }
    }

    subscribe(callback, type = SELECTED_TEMPLATE) {
        if (!this.listeners[type]) {
            this.listeners[type] = []
        }
        this.listeners[type].push(callback)

        if (type === SELECTED_TEMPLATE && this.selectedTemplate) {
            callback(this.selectedTemplate)
        } else if ((type === ADD_TEMPLATES || type === DELETE_TEMPLATES) && this.templates) {
            callback(this.templates)
        }
    }

    addTemplate = () => {
        const templatesLn = this.templates.size
        const templateKey = `template${templatesLn}`
        this.selectTemplate({
            key: templateKey,
            value: "template",
            index: templatesLn,
            isSelected: false
        }, ADD_TEMPLATES)
    }

    deleteTemplate = () => {
        if (this.selectedTemplate?.key) {
            this.templates.delete(this.selectedTemplate.key)
            this.selectTemplate(null, DELETE_TEMPLATES)
            this.selectedTemplate = null
            this.selectTemplate(this.selectedTemplate, SELECTED_TEMPLATE)
        }
    }


    changeTemplate = (newKey, data = null) => {
        const templateToChange = this.selectedTemplate
        this.templates.delete(this.selectedTemplate.key)
        if (data) {
            this.selectTemplate({ ...templateToChange, key: newKey, value: data.value }, ADD_TEMPLATES)
        } else {
            this.selectTemplate({ ...templateToChange, key: newKey}, ADD_TEMPLATES)
        }

        this.selectedTemplate = this.templates.get(newKey)

        this.selectTemplate(null, CHANGE_TEMPLATE)
    }

    setSelectedOptions = (key, value) => {
        this.selectOptionState.set(key, value)
    }

    getSelectedOptions = () => this.selectOptionState

    unsubscribe(callback, type = SELECTED_TEMPLATE) {
        this.listeners[type] = this.listeners[type].filter(fn => fn !== callback)
    }
}


export const GlobalStore = new Store() 