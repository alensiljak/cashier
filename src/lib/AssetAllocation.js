/*
    Asset Allocation
*/
import appService from "../appService";
import { settings, SettingKeys } from "./Configuration";
import AssetClass from "./AssetClass";

/**
 * loadDefinition = loads the pre-set definition
 *
 */
class AssetAllocationEngine {
  constructor() {
    this.assetClassIndex = null
    this.stockIndex = null
  }

  async loadFullAssetAllocation() {
    // aa definition

    let assetClasses = await this.loadDefinition();
    this.assetClassIndex = this.buildAssetClassIndex(assetClasses)

    // build the stock index
    this.stockIndex = this.buildStockIndex(assetClasses)

    // load current balances from accounts
    // add the account balances to asset classes
    let invAccounts = await this.getInvestmentAccounts()
    await invAccounts.each(account => {
      let amount = parseFloat(account.currentBalance)
      // amount = amount.toFixed(2)

      let commodity = account.currency
      // now get the asset class for this commodity
      let assetClassName = this.stockIndex[commodity]
      let assetClass = this.assetClassIndex[assetClassName]

      if (typeof assetClass.currentBalance === "undefined") {
        assetClass.currentBalance = 0
      }
      assetClass.currentBalance += amount
    })
    // todo Sum the balances for groups.

    // todo calculate offsets
    
    return this.assetClassIndex
  }

  buildAssetClassIndex(assetClasses) {
    let index = {}

    for(let i = 0; i < assetClasses.length; i++) {
      let ac = assetClasses[i]
      index[ac.fullname] = ac
    }

    return index
  }

  buildStockIndex(asetClasses) {
    let index = {}

    for(let i = 0; i < asetClasses.length; i++) {
      let assetClass = asetClasses[i]
      if (!assetClass.stocks) continue

      let stocks = assetClass.stocks
      for(let j = 0; j < stocks.length; j++) {
        let stock = stocks[j]
        
        index[stock] = assetClass.fullname
      }
    }
    return index
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
   * Get all the investment accounts in a dictionary.
   * Start from the investment root setting, and include the commodity.
   * @returns Promise with investment accounts collection
   */
  async getInvestmentAccounts() {
    // get the root investment account.
    let rootAccount = await settings.get(
      SettingKeys.assetAllocationInvestmentRootAccount
    );

    if (!rootAccount) {
      throw 'Root investment account not set!'
    }

    // let accounts =
    return appService.db.accounts
      .where('name')
      .startsWithIgnoreCase(rootAccount);
    // accounts.each(account => {
    //   console.log(account);
    // });
    // for(let i = 0; i < accounts.length; i++) {
    //     let account = accounts[i]
    //     console.log(account)
    // }
    // return accounts;
  }

  /**
   * Import Asset Allocation definition.
   * @param {str} text Contents of the definition file.
   * @returns Dictionary of asset classes with allocations and stocks
   */
  importDefinition(text) {
    if (!text) return;

    // parse and save into the storage.
    // let aa = {};
    // console.log(aa);
    // let index = {}; // index for all asset classes.
    let assetClasses = [];
    // let stockIndex = {}; // index for stock symbols and the corresponding asset class.

    let lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let assetClass = this.parseLine(line);
      if (!assetClass) continue;

      // add to index
      //   index[assetClass.fullname] = assetClass;
      assetClasses.push(assetClass);

      // index stocks
      //   if (assetClass.stocks) {
      //     for (let s = 0; s < assetClass.stocks.length; s++) {
      //       let symbol = assetClass.stocks[s];
      //       stockIndex[symbol] = assetClass.fullname;
      //     }
      //   }
    }

    // persist?
    // stockIndex
    // return index
    // return settings.set(SettingKeys.assetAllocationDefinition, index);
    return appService.db.assetAllocation.bulkPut(assetClasses);
  }

  /**
   * Load the asset allocation definition from persistence.
   * @returns Array of asset class records
   */
  async loadDefinition() {
    return appService.db.assetAllocation.toArray();
  }

  /**
   * Parse and store the current balances ("l b ^Assets:Inv --flat -X EUR")
   * in the allocation object.
   * @param {str} text
   */
  async importCurrentBalances(text) {
    // load current allocation
    // let aa = await this.loadDefinition()
    // let accounts = await this.getInvestmentAccounts()
    let currentArray = this.parseCurrentBalancesFile(text);

    // assign values
    for (let i = 0; i < currentArray.length; i++) {
      let row = currentArray[i];
      // account name
      let accountName = row[0];
      // balance
      let balance = row[1];
      balance = balance.replace(",", "");
      let currency = row[2];

      // Save to existing accounts
      let account = await appService.db.accounts.get(accountName);
      if (!account) {
        throw "Invalid account " + accountName;
      }
      account.currentBalance = balance;
      account.currentCurrency = currency;

      await appService.db.accounts.put(account);
    }
  }

  parseCurrentBalancesFile(text) {
    let result = [];

    let lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let parts = line.split("  ");
      parts = this.cleanBlankArrayItems(parts)
      if (parts.length === 0) continue;

      let amountParts = parts[0].split(" ");
      amountParts = this.cleanBlankArrayItems(amountParts)

      let amountString = amountParts[0];
      let currency = amountParts[1];
      let accountName = parts[1];

      result.push([accountName, amountString, currency]);
    }

    return result;
  }

  /**
   * Parse one raw line from the definition file.
   * @param {string} line
   * @returns AssetClass instance
   */
  parseLine(line) {
    let parts = this.splitLine(line);
    if (!parts || !parts.length) return;

    let ac = new AssetClass();
    // let assetClass = parts[0]
    // console.log(assetClass)
    ac.fullname = parts[0];

    // let percent = parts[1]
    // console.log(percent)
    ac.allocation = parts[1];

    let stocksLine = null;
    if (parts.length > 2) {
      stocksLine = parts[2];
      ac.stocks = stocksLine.split(" ");
    }

    return ac;
  }

  /**
   * Splits the definition line into sections
   * @param {str} line
   */
  splitLine(line) {
    if (line.startsWith(";")) return;

    // parse line
    line = line.trim();
    // asset class, percentage, symbols
    let parts = line.split("  ");

    // Clean up blank sections
    parts = this.cleanBlankArrayItems(parts);

    return parts;
  }
}

export const engine = new AssetAllocationEngine();
