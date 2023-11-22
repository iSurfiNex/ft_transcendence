import { Toast, Popover } from 'bootstrap'

export const initPopover = (scope) => {
    if (scope !== document)
        scope = scope.shadowRoot
    if (!scope) {
        console.warn('Invalid scope for Popover initialization')
        return
    }
    [...scope.querySelectorAll('[data-bs-toggle="popover"]')].map(el => new Popover(el))
}
