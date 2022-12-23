/*
    Asset Allocation
*/
import appService from '../appService'
import { AssetClass, AssetClassDefinition } from './AssetClass'
//import jsyaml from 'js-yaml'
import numeral from 'numeral'
import toml from 'toml'
import { AccountService } from './accountsService'
import { SettingKeys, settings } from './settings'

// constants

export const NUMBER_FORMAT = '0,0.00'

/**
 * loadDefinition = loads the pre-set definition
 */
class AssetAllocationEngine {
  assetClassIndex: Record<string, AssetClass>
  stockIndex: Record<string, string>

  constructor() {
    this.assetClassIndex = {}
    this.stockIndex = {}
  }

  async loadFullAssetAllocation(): Promise<AssetClass[]> {
    // aa definition

    let assetClasses = await this.loadDefinition()
    if (!assetClasses.length) return []

    this.assetClassIndex = this.buildAssetClassIndex(assetClasses)

    // build the stock index
    this.stockIndex = this.buildStockIndex(assetClasses)

    await this.loadCurrentValues()

    // Sum the balances for groups.
    this.sumGroupBalances(this.assetClassIndex)

    // validation, check the allocation for groups, compare to sum of children's
    // this.validate(this.assetClassIndex);

    // calculate offsets
    this.calculateOffsets(this.assetClassIndex)

    // Format numbers for output. Now done in the view.
    // this.formatNumbers(this.assetClassIndex)

    // convert to array for display in a table
    let result: AssetClass[] = Object.values(this.assetClassIndex)

    return result
  }

  buildAssetClassIndex(assetClasses: AssetClass[]): Record<string, AssetClass> {
    let index: Record<string, AssetClass> = {}

    for (let i = 0; i < assetClasses.length; i++) {
      let ac = assetClasses[i]
      index[ac.fullname] = ac
    }

    return index
  }

  /**
   * Build the index of stocks for easy retrieval.
   * @param {Array} asetClasses
   */
  buildStockIndex(asetClasses: AssetClass[]): Record<string, string> {
    let index: Record<string, string> = {}

    for (let i = 0; i < asetClasses.length; i++) {
      let assetClass = asetClasses[i]
      if (!assetClass.symbols) continue

      let stocks = assetClass.symbols
      for (let j = 0; j < stocks.length; j++) {
        let stock = stocks[j]

        index[stock] = assetClass.fullname
      }
    }
    return index
  }

  calculateOffsets(dictionary: Record<string, AssetClass>) {
    let root = dictionary['Allocation']
    let total = root.currentValue

    // toFixed returns a string.

    Object.values(dictionary).forEach((ac) => {
      // calculate current allocation
      ac.currentAllocation = (ac.currentValue * 100) / total

      // diff
      ac.diff = ac.currentAllocation - ac.allocation

      // diff %
      ac.diffPerc = (ac.diff * 100) / ac.allocation

      ac.allocatedValue = (ac.allocation * total) / 100

      ac.diffAmount = ac.currentValue - ac.allocatedValue
    })
  }

  cleanBlankArrayItems(array: any[]) {
    let i = 0
    while (i < array.length) {
      let part = array[i]
      if (part === '') {
        array.splice(i, 1)
      } else {
        i++
      }
    }
    return array
  }

  /**
   * Deletes all data in Asset Allocation storage (table).
   */
  async emptyData() {
    return appService.db.assetAllocation.clear()
  }

  findChildren(dictionary: object, parent: AssetClass) {
    let children: AssetClass[] = []

    Object.values(dictionary).forEach((val) => {
      // console.log(key); // the name of the current key.
      // console.log(val); // the value of the current key.
      if (parent.fullname === val.parentName) {
        children.push(val)
      }
    })

    return children
  }

  /**
   * Formats the array of Asset Classes (the end result) for txt output.
   * The output can be stored for historical purposes, compared, etc.
   * @param {Array} rows
   */
  formatAllocationRowsForTxtExport(rows: AssetClass[]) {
    let outputRows = []
    outputRows.push(
      'Asset Class       Allocation Current  Diff.  Diff.%  Alloc.Val.  Curr. Val.  Difference'
    )

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]

      /*
            {"name": "Asset Class", "width": 22},
            {"name": "alloc.", "width": 5},
            {"name": "cur.al.", "width": 6},
            {"name": "diff.", "width": 6},
            {"name": "al.val.", "width": 8},
            {"name": "value", "width": 8},
            {"name": "loc.cur.", "width": 13},
            {"name": "diff", "width": 8}
      */
      let space = ''
      for (let i = row.depth * 2; i > 0; i--) {
        space += ' '
      }
      // let name = row.name.padStart(22, ' ')
      let firstCol = (space + row.name).padEnd(20, ' ')

      let display = numeral(row.allocation).format(NUMBER_FORMAT)
      let alloc = display.toString().padStart(6, ' ')

      display = numeral(row.currentAllocation).format(NUMBER_FORMAT)
      let curAl = display.toString().padStart(6, ' ')

      display = numeral(row.diff).format(NUMBER_FORMAT)
      let diff = display.toString().padStart(5, ' ')

      display = numeral(row.diffPerc).format(NUMBER_FORMAT)
      let diffPerc = display.toString().padStart(6, ' ')

      display = numeral(row.allocatedValue).format(NUMBER_FORMAT)
      let alVal = display.toString().padStart(10, ' ')

      display = numeral(row.currentValue).format(NUMBER_FORMAT)
      let value = display.toString().padStart(10, ' ')

      // let locCur =
      display = numeral(row.diffAmount).format(NUMBER_FORMAT)
      let diffAmt = display.toString().padStart(10, ' ')

      let output = `${firstCol}  ${alloc}  ${curAl}  ${diff}  ${diffPerc}  ${alVal}  ${value}  ${diffAmt}`

      outputRows.push(output)
    }
    let text = outputRows.join('\n')
    return text
  }

  // formatNumbers(dictionary: object) {
  //   let format = '0,0.00'

  //   Object.values(dictionary).forEach((ac: AssetClass) => {
  //     ac.currentAllocation = numeral(ac.currentAllocation).format(format)
  //     ac.currentValue = numeral(ac.currentValue).format(format)
  //     ac.allocatedValue = numeral(ac.allocatedValue).format(format)
  //     ac.diff = numeral(ac.diff).format(format)
  //     ac.diffPerc = numeral(ac.diffPerc).format(format)
  //     ac.diffAmount = numeral(ac.diffAmount).format(format)
  //   })
  // }

  /**
   * Update the current balances in the asset allocation.
   * @param {string} json
   */
  async importCurrentValuesJson(json: Record<string, string>) {
    const accounts = Object.keys(json)
    for (let i = 0; i < accounts.length; i++) {
      const key = accounts[i]

      // fix the balance
      let balance: string = json[key]
      balance = balance.replace(',', '')

      // extract the currency
      let parts = balance.split(' ')
      const amount = parts[0]
      const currency = parts[1]

      // Update existing account.
      let account = await appService.db.accounts.get(key)
      if (!account) {
        throw new Error('Invalid account ' + account.name)
      }
      account.currentValue = amount
      account.currentCurrency = currency

      await appService.db.accounts.put(account)
    }
  }

  async importTomlDefinition(content: string) {
    const parsed = toml.parse(content)
    //console.log('toml:', aa)

    // Convert to backward-compatible structure (tree -> list).
    let assetClasses = this.linearizeObject(parsed)

    // todo: use the tree structure directly, at some later point.

    let result = await this.validateAndSave(assetClasses)
    return result
  }

  /**
   * Do not use - the dependent js-yaml package is removed.
   * Imports Asset Allocation definition as YAML.
   * @param {string} content The content of the YAML definition file.
   */
  async importYamlDefinition(content: string) {
    let parsed: AssetClassDefinition = { allocation: 0, symbols: [] } //= jsyaml.load(content) as object

    // Convert to backward-compatible structure (tree -> list).
    let assetClasses = this.linearizeObject(parsed)

    // todo: use the tree structure directly, at some later point.

    let result = await this.validateAndSave(assetClasses)
    return result
  }

  /**
   * Convert a tree AA structure (object) into a list of Asset Classes.
   * This converts the new structure into the old.
   * @param {object} rootObject The Asset Allocation object
   */
  linearizeObject(
    rootObject: AssetClassDefinition,
    namespace = ''
  ): AssetClass[] {
    let result: AssetClass[] = []

    // only use the children.

    for (const propertyName in rootObject) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let child: AssetClassDefinition = rootObject[propertyName]

      // Only process the other definitions, not the properties (like allocation).
      // symbols is an array, which is also an object. Skip.
      if (!(typeof child == 'object') || child.constructor === Array) continue

      // convert to Asset Class
      let item = new AssetClass()
      item.allocation = child.allocation
      item.symbols = child.symbols
      // get the name
      if (namespace) {
        item.fullname = namespace + ':' + propertyName
      } else {
        item.fullname = propertyName
      }

      result.push(item)

      //console.log(`object: ${propertyName}`, child)

      // iterate
      let childNamespace = namespace
      if (namespace) {
        childNamespace += ':'
      }
      childNamespace += propertyName

      let children = this.linearizeObject(child, childNamespace)
      if (children.length) {
        result = result.concat(children)
      }
    }

    return result
  }

  /**
   * Used on import only!
   * Validates the asset allocation and stores it into the database.
   * @param {Array} assetClassArray
   */
  async validateAndSave(assetClassArray: AssetClass[]) {
    // Validate
    let assetClassIndex = this.buildAssetClassIndex(assetClassArray)
    let errors = this.validate(assetClassIndex)
    if (errors.length) throw 'Validation failed: ' + errors

    // persist
    return appService.db.assetAllocation.bulkPut(assetClassArray)
  }

  /**
   * Load current balances from accounts.
   * Add the account balances to asset classes.
   */
  async loadCurrentValues() {
    const acctSvc = new AccountService()
    const defaultCurrency = await settings.get(SettingKeys.currency)
    const invAccounts = await appService.loadInvestmentAccounts()

    await invAccounts.forEach((account) => {
      let amount = parseFloat(account.currentValue)
      if (!amount || isNaN(amount)) {
        console.warn(`Account ${account.name} has no current value set.`)
        amount = 0
      }

      const acctBalance = acctSvc.getAccountBalance(account, defaultCurrency)
      account.balance = acctBalance

      if (acctBalance.amount == 0) {
        // skip adding to the sum.
        return
      }

      let commodity = account.balance.currency
      // Now get the asset class for this commodity.
      let assetClassName = this.stockIndex[commodity]
      if (!assetClassName) {
        // console.debug(this.stockIndex)
        console.debug(account)
        throw new Error(`Asset class name not found for commodity ${commodity}`)
      }
      let assetClass = this.assetClassIndex[assetClassName]
      if (!assetClass) {
        throw new Error(`Asset class not found: ${assetClassName}`)
      }

      if (isNaN(assetClass.currentValue)) {
        // typeof assetClass.currentValue === 'undefined' ||
        assetClass.currentValue = 0
      }
      assetClass.currentValue += amount
    })
  }

  /**
   * Load the asset allocation definition from persistence.
   * @returns Array of asset class records
   */
  async loadDefinition(): Promise<AssetClass[]> {
    return appService.db.assetAllocation.toArray()
  }

  sumGroupBalances(acIndex: Record<string, AssetClass>) {
    let root = acIndex['Allocation']

    if (root == null) {
      throw new Error(
        'Asset Allocation not defined. Please import the definition file.'
      )
    }

    let sum = this.sumChildren(acIndex, root)

    root.currentValue = sum
  }

  sumChildren(dictionary: object, item: AssetClass) {
    // find all children
    let children = this.findChildren(dictionary, item)
    // console.log(children);
    if (children.length === 0) {
      return item.currentValue
    }

    let sum = 0
    for (let i = 0; i < children.length; i++) {
      let child: AssetClass = children[i]
      child.currentValue = this.sumChildren(dictionary, child)

      let amount = child.currentValue
      sum += amount
    }

    return sum
  }

  /**
   * Validate Asset Allocation.
   * Currently checks the definition by comparing group sums.
   */
  validate(assetClassList: Record<string, AssetClass>) {
    let errors: string[] = []
    let keys = Object.keys(assetClassList)

    keys.forEach((acName) => {
      let ac: AssetClass = assetClassList[acName]
      let result = this.validateGroupAllocation(ac, assetClassList)
      if (result) {
        errors.push(result)
      }
    })

    console.log('AA validation results: ', errors)

    return errors
  }

  /**
   * Validate that the group's allocation matches the sum of the children classes.
   * @param {AssetClass} assetClass
   */
  validateGroupAllocation(
    assetClass: AssetClass,
    list: Record<string, AssetClass>
  ) {
    let children = this.findChildren(list, assetClass)
    if (children.length === 0) return

    // sum the children's allocation.
    let sum = 0.0
    for (let i = 0; i < children.length; i++) {
      //sum += parseFloat(children[i].allocation)
      sum += children[i].allocation
    }

    //let equal = parseFloat(assetClass.allocation) === sum
    let equal = assetClass.allocation === sum

    if (!equal) {
      return (
        "- '" +
        assetClass.fullname +
        "' does not match the sum of child classes!\n"
      )
    }
  }
}

export const engine = new AssetAllocationEngine()
