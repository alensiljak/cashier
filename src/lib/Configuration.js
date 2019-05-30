/*
    Various configuration-related things
*/
import db from '../dataStore'
import { Setting } from '../model'


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


export const SettingKeys = {
    get favouriteAccounts() {
        return "favouriteAccounts"
    },
    get syncServerUrl() {
        return "syncServerUrl"
    },
    rootInvestmentAccount: 'aa.rootAccount',
    assetAllocationDefinition: 'aa.definition'
}


class Settings {
    /**
     * 
     * @param {any} key 
     * @returns Promise with the Setting object
     */
    get(key) {
        return db.settings.get(key).then(setting => {
            if (!setting) return null

            let value = null
            try {
                value = JSON.parse(setting.value)
            } catch(e) {
                value = setting.value
            }
            
            return value
        })
    }

    set(key, value) {
        let jsonValue = JSON.stringify(value)
        let setting = new Setting(key, jsonValue)
        
        return db.settings.put(setting)
    }
}

let settings = new Settings()
export { settings }
