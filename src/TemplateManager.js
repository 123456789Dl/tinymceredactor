import { ADD_TEMPLATES, DELETE_TEMPLATES, GlobalStore, SELECTED_TEMPLATE } from "./store/store.js"

export const TemplateManager = {
    addTemplate() {
        GlobalStore.addTemplate()
    },
    deleteTemplate() {
        GlobalStore.deleteTemplate()
    },
    changeTemplate(newKey, data) {
        GlobalStore.changeTemplate(newKey, data)
    },
    subs(callback) {
        GlobalStore.subscribe(callback, ADD_TEMPLATES)
        GlobalStore.subscribe(callback, DELETE_TEMPLATES)
    },
    getTemplates() {
        return GlobalStore.templates
    },
    getSelected(callback) {
        GlobalStore.subscribe(callback, SELECTED_TEMPLATE)
    },
    setselectOptionState(key, value) {
        GlobalStore.setSelectedOptions(key, value)
    },
    getselectOptinState() {
        return GlobalStore.getSelectedOptions()
    },
}