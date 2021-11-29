/*
    Asset Allocation
*/
import appService from "../appService";
import AssetClass from "./AssetClass";
import jsyaml from 'js-yaml'
// import numeral from 'numeral'
var numeral = require("numeral")

/**
 * loadDefinition = loads the pre-set definition
 *
 */
class AssetAllocationEngine {
  constructor() {
    this.assetClassIndex = null;
    this.stockIndex = null;
  }

  async loadFullAssetAllocation() {
    // aa definition

    let assetClasses = await this.loadDefinition();
    this.assetClassIndex = this.buildAssetClassIndex(assetClasses);

    // build the stock index
    this.stockIndex = this.buildStockIndex(assetClasses);

    await this.loadCurrentValues();

    // Sum the balances for groups.
    this.sumGroupBalances(this.assetClassIndex);

    // validation, check the allocation for groups, compare to sum of children's
    // this.validate(this.assetClassIndex);

    // calculate offsets
    this.calculateOffsets(this.assetClassIndex);

    // format numbers for output
    this.formatNumbers(this.assetClassIndex);

    // convert to array for display in a table
    let result = Object.values(this.assetClassIndex);

    return result;
  }

  buildAssetClassIndex(assetClasses) {
    let index = {};

    for (let i = 0; i < assetClasses.length; i++) {
      let ac = assetClasses[i];
      index[ac.fullname] = ac;
    }

    return index;
  }

  /**
   * Build the index of stocks for easy retrieval.
   * @param {Array} asetClasses
   */
  buildStockIndex(asetClasses) {
    let index = {};

    for (let i = 0; i < asetClasses.length; i++) {
      let assetClass = asetClasses[i];
      if (!assetClass.symbols) continue;

      let stocks = assetClass.symbols;
      for (let j = 0; j < stocks.length; j++) {
        let stock = stocks[j];

        index[stock] = assetClass.fullname;
      }
    }
    return index;
  }

  calculateOffsets(dictionary) {
    let root = dictionary["Allocation"];
    let total = root.currentValue;

    // toFixed returns a string.

    Object.values(dictionary).forEach(ac => {
      // calculate current allocation
      ac.currentAllocation = (ac.currentValue * 100) / total;

      // diff
      ac.diff = ac.currentAllocation - ac.allocation;

      // diff %
      ac.diffPerc = (ac.diff * 100) / ac.allocation;

      ac.allocatedValue = (ac.allocation * total) / 100;

      ac.diffAmount = ac.currentValue - ac.allocatedValue;
    });
  }

  cleanBlankArrayItems(array) {
    let i = 0;
    while (i < array.length) {
      let part = array[i];
      if (part === "") {
        array.splice(i, 1);
      } else {
        i++;
      }
    }
    return array;
  }

    /**
   * Deletes all data in Asset Allocation storage (table).
   */
  async emptyData() {
    return appService.db.assetAllocation.clear();
  }

  findChildren(dictionary, parent) {
    let children = [];

    Object.values(dictionary).forEach(val => {
      // console.log(key); // the name of the current key.
      // console.log(val); // the value of the current key.
      if (parent.fullname === val.parentName) {
        children.push(val);
      }
    });

    return children;
  }

  /**
   * Formats the array of Asset Classes (the end result) for txt output.
   * The output can be stored for historical purposes, compared, etc.
   * @param {Array} rows
   */
  formatAllocationRowsForTxtExport(rows) {
    let outputRows = [];
    outputRows.push(
      "Asset Class       Allocation Current  Diff.  Diff.%  Alloc.Val.  Curr. Val.  Difference"
    );

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];

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
      let space = "";
      for (let i = row.depth * 2; i > 0; i--) {
        space += " ";
      }
      // let name = row.name.padStart(22, ' ')
      let firstCol = (space + row.name).padEnd(20, " ");
      let alloc = row.allocation.padStart(6, " ");
      let curAl = row.currentAllocation.padStart(6, " ");
      let diff = row.diff.padStart(5, " ");
      let diffPerc = row.diffPerc.padStart(6, " ");
      let alVal = row.allocatedValue.padStart(10, " ");
      let value = row.currentValue.padStart(10, " ");
      // let locCur =
      let diffAmt = row.diffAmount.padStart(10, " ");

      let output = `${firstCol}  ${alloc}  ${curAl}  ${diff}  ${diffPerc}  ${alVal}  ${value}  ${diffAmt}`;

      outputRows.push(output);
    }
    let text = outputRows.join("\n");
    return text;
  }

  formatNumbers(dictionary) {
    let format = "0,0.00";

    Object.values(dictionary).forEach(ac => {
      ac.currentAllocation = numeral(ac.currentAllocation).format(format);

      ac.currentValue = numeral(ac.currentValue).format(format);

      ac.allocatedValue = numeral(ac.allocatedValue).format(format);

      ac.diff = numeral(ac.diff).format(format);

      ac.diffPerc = numeral(ac.diffPerc).format(format);

      ac.diffAmount = numeral(ac.diffAmount).format(format);
    });
  }

  /**
   * Update the current balances in the asset allocation.
   * @param {string} json 
   */
  async importCurrentValuesJson(json) {
    const accounts = Object.keys(json)
    for(let i = 0; i < accounts.length; i++) {
      const key = accounts[i]

      // fix the balance
      let balance = json[key]
      balance = balance.replace(",", "");

      // extract the currency
      let parts = balance.split(' ')
      const amount = parts[0]
      const currency = parts[1]

      // Update existing account.
      let account = await appService.db.accounts.get(key);
      if (!account) {
        // eslint-disable-next-line no-throw-literal
        throw "Invalid account " + accountName;
      }
      account.currentValue = amount;
      account.currentCurrency = currency;

      await appService.db.accounts.put(account);
    }
  }

  /**
   * Imports Asset Allocation definition as YAML
   * @param {string} content The content of the YAML definition file.
   */
  async importYamlDefinition(content) {
    var parsed = jsyaml.load(content)

    //var aa = parsed.Allocation
    // Convert to backward-compatible structure (tree -> list).
    var assetClasses = this.linearizeObject(parsed)

    // todo: use the tree structure directly, at some later point.

    var result = await this.validateAndSave(assetClasses)
    return result
  }

  /**
   * Convert a YAML tree AA structure into a list of Asset Classes.
   * This converts the new structure into the old.
   * @param {object} rootObject 
   */
  linearizeObject(rootObject, namespace = '') {
    var result = []

    // only use the children.

    for (const propertyName in rootObject) {
      var child = rootObject[propertyName]

      // symbols is an array, which is also an object. Skip.
      if(typeof child == "object" && child.constructor !== Array) {
        // convert to Asset Class
        var item = new AssetClass()
        item.allocation = child.allocation
        item.symbols = child.symbols
        // todo: get the name
        if(namespace) {
          item.fullname = namespace + ':' + propertyName
        } else {
          item.fullname = propertyName
        }

        result.push(item)

        //console.log(`object: ${propertyName}`, child)

        // iterate
        var childNamespace = namespace
        if (namespace) {
          childNamespace += ':'
        }
        childNamespace += propertyName

        var children = this.linearizeObject(child, childNamespace)
        if(children.length) {
          result = result.concat(children)
        }
      }
    }

    return result
  }

  // /**
  //  * Deprecated!
  //  * Import Asset Allocation definition.
  //  * @param {str} text Contents of the definition file.
  //  * @returns Dictionary of asset classes with allocations and stocks
  //  */
  // async importDefinition(text) {
  //   if (!text) return;

  //   // parse and save into the storage.
  //   const assetClasses = [];

  //   let lines = text.split("\n");
  //   for (let i = 0; i < lines.length; i++) {
  //     let line = lines[i];
  //     let assetClass = this.parseLine(line);
  //     if (!assetClass) continue;

  //     assetClasses.push(assetClass);
  //   }

  //   var result = await this.validateAndSave(assetClasses)
  //   return result
  // }

  /**
   * Used on import only!
   * @param {Array} assetClassArray 
   */
  async validateAndSave(assetClassArray) {
    // Validate
    let assetClassIndex = this.buildAssetClassIndex(assetClassArray);
    let errors = this.validate(assetClassIndex)
    if (errors.length) throw "Validation failed: " + errors

    // persist
    return appService.db.assetAllocation.bulkPut(assetClassArray);
  }

  async loadCurrentValues() {
    // load current balances from accounts
    // add the account balances to asset classes
    let invAccounts = await appService.getInvestmentAccounts();
    await invAccounts.each(account => {
      let amount = parseFloat(account.currentValue);
      // amount = amount.toFixed(2)

      let commodity = account.currency;
      // now get the asset class for this commodity
      let assetClassName = this.stockIndex[commodity];
      let assetClass = this.assetClassIndex[assetClassName];

      if (typeof assetClass.currentValue === "undefined") {
        assetClass.currentValue = 0;
      }
      assetClass.currentValue += amount;
    });
  }

  /**
   * Load the asset allocation definition from persistence.
   * @returns Array of asset class records
   */
  async loadDefinition() {
    return appService.db.assetAllocation.toArray();
  }

  // /**
  //  * Parse one raw line from the definition file.
  //  * @param {string} line
  //  * @returns AssetClass instance
  //  */
  // parseLine(line) {
  //   let parts = this.splitLine(line);
  //   if (!parts || !parts.length) return;

  //   let ac = new AssetClass();

  //   ac.fullname = parts[0];

  //   ac.allocation = parts[1];

  //   let stocksLine = null;
  //   if (parts.length > 2) {
  //     stocksLine = parts[2];
  //     ac.symbols = stocksLine.split(" ");
  //   }

  //   return ac;
  // }

  // /**
  //  * Splits the definition line into sections
  //  * @param {str} line
  //  */
  // splitLine(line) {
  //   if (line.startsWith(";")) return;

  //   // parse line
  //   line = line.trim();
  //   // asset class, percentage, symbols
  //   let parts = line.split("  ");

  //   // Clean up blank sections
  //   parts = this.cleanBlankArrayItems(parts);

  //   return parts;
  // }

  sumGroupBalances(acIndex) {
    let root = acIndex["Allocation"];

    if(root == null) {
      throw new Error('Asset Allocation not defined. Please import the definition file.')
    }

    let sum = this.sumChildren(acIndex, root);

    root.currentValue = sum;
  }

  sumChildren(dictionary, item) {
    // find all children
    let children = this.findChildren(dictionary, item);
    // console.log(children);
    if (children.length === 0) {
      return item.currentValue;
    }

    let sum = 0;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      child.currentValue = this.sumChildren(dictionary, child);

      let amount = child.currentValue;
      sum += amount;
    }

    return sum;
  }

  /**
   * Validate Asset Allocation.
   * Currently checks the definition by comparing group sums.
   */
  validate(assetClassList) {
    let errors = [];
    let keys = Object.keys(assetClassList);

    keys.forEach(acName => {
      let ac = assetClassList[acName];
      let result = this.validateGroupAllocation(ac, assetClassList);
      if (result) {
        errors.push(result);
      }
    });

    console.log("AA validation results: ", errors)
    
    return errors;
  }

  /**
   * Validate that the group's allocation matches the sum of the children classes.
   * @param {AssetClass} assetClass
   */
  validateGroupAllocation(assetClass, list) {
    // let key = assetClass.fullname
    let children = this.findChildren(list, assetClass);
    if (children.length === 0) return;

    // sum the children's allocation
    let sum = 0.0;
    for (let i = 0; i < children.length; i++) {
      sum += parseFloat(children[i].allocation);
    }

    let equal = parseFloat(assetClass.allocation) === sum;

    if (!equal) {
      return (
        "- '" +
        assetClass.fullname +
        "' does not match the sum of child classes!\n"
      );
    }
  }
}

export const engine = new AssetAllocationEngine();
