/*
    Asset Allocation
*/

class AssetClass {
    constructor() {
        this.full_name = null
        this.parentname = null
        this.name = null
        this.allocation = null
        this.stocks = null
    }

    get fullname() {
        return this.full_name
    }
    
    set fullname(value) {
        this.full_name = value

        //
        let parts = value.split(':')
        let lastIndex = parts.length - 1
        this.name = parts[lastIndex]
        parts.splice(lastIndex, 1)

        this.parentname = parts.join(':')
    }
}

class AssetAllocationEngine {
    constructor() {

    }

    /**
     * Import Asset Allocation definition.
     * @param {str} text Contents of the definition file.
     */
    importDefinition(text) {
        // parse and save into the storage.
        let aa = {}
        console.log(aa)
        let index = {}
        // console.log(index)

        let lines = text.split('\n')
        for(let i = 0; i < lines.length; i++) {
            let line = lines[i]
            let assetClass = this.parseLine(line)
            if (!assetClass) continue

            // add to index
            index[assetClass.fullname] = assetClass
            
            // console.log(assetClass)
        }
        
        console.log(index)
    }

    /**
     * Parse one raw line from the definition file.
     * @param {string} line 
     * @returns AssetClass instance
     */
    parseLine(line) {
        let parts = this.splitLine(line)
        if (!parts || !parts.length) return

        let ac = new AssetClass()
        // let assetClass = parts[0]
        // console.log(assetClass)
        ac.fullname = parts[0]

        // let percent = parts[1]
        // console.log(percent)
        ac.allocation = parts[1]

        let stocksLine = null
        if (parts.length > 2) {
            stocksLine = parts[2]
            ac.stocks = stocksLine.split(' ')
        }

        return ac
    }

    /**
     * Splits the definition line into sections
     * @param {str} line 
     */
    splitLine(line) {
        if (line.startsWith(';')) return

        // parse line
        line = line.trim()
        // asset class, percentage, symbols
        let parts = line.split('  ')
        // console.log(parts)
        // Clean up blank sections
        let i = 0
        while (i < parts.length) {
            let part = parts[i]
            if (part === "") {
                parts.splice(i, 1)
            } else {
                i++
            }
        }
        return parts
    }
}

export const engine = new AssetAllocationEngine()