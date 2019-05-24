/*
    Various configuration-related things
*/

/**
 * Contains all the values required for the selection mode to function.
 * When an object of this type exists in the state store, we are in selection mode.
 */
export class SelectionModeMetadata {
    constructor() {
        // The selection requestor. Can be used to explicitly name the origin and 
        // avoid confusion in unexpected navigation routes.
        this.origin = ''
        // The type of item being selected. Useful on return to the original entity.
        this.selectionType = null
        // The id of the selected item.
        this.selectedId = null
        // the route object to use when returning back from selection.
        this.originRoute = null
    }

}