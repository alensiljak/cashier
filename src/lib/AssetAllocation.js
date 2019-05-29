/*
    Asset Allocation
*/
import appService from "../appService";
import { settings, SettingKeys } from "./Configuration";

class AssetClass {
  constructor() {
    this.full_name = null;
    this.parentname = null;
    this.name = null;
    this.allocation = null;
    this.stocks = null;
  }

  get fullname() {
    return this.full_name;
  }

  set fullname(value) {
    this.full_name = value;

    //
    let parts = value.split(":");
    let lastIndex = parts.length - 1;
    this.name = parts[lastIndex];
    parts.splice(lastIndex, 1);

    this.parentname = parts.join(":");
  }
}

class AssetAllocationEngine {
  constructor() {}

  /**
   * Get all the investment accounts in a dictionary.
   * Start from the investment root setting, and include the commodity.
   */
  async getInvestmentAccounts() {
    // get the root investment account.
    let rootAccount = await settings.get(
      SettingKeys.assetAllocationInvestmentRootAccount
    );

    let accounts = await appService.db.accounts
      .where("name")
      .startsWithIgnoreCase(rootAccount);
    accounts.each(account => {
      console.log(account);
    });
    // for(let i = 0; i < accounts.length; i++) {
    //     let account = accounts[i]
    //     console.log(account)
    // }
  }

  /**
   * Import Asset Allocation definition.
   * @param {str} text Contents of the definition file.
   * @returns Dictionary of asset classes with allocations and stocks
   */
  importDefinition(text) {
    if (!text) return;

    // parse and save into the storage.
    let aa = {};
    console.log(aa);
    let index = {}; // index for all asset classes.
    // let stockIndex = {}; // index for stock symbols and the corresponding asset class.

    let lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let assetClass = this.parseLine(line);
      if (!assetClass) continue;

      // add to index
      index[assetClass.fullname] = assetClass;

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
    return settings.set(SettingKeys.assetAllocationDefinition, index)
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
    // console.log(parts)
    // Clean up blank sections
    let i = 0;
    while (i < parts.length) {
      let part = parts[i];
      if (part === "") {
        parts.splice(i, 1);
      } else {
        i++;
      }
    }
    return parts;
  }
}

export const engine = new AssetAllocationEngine();
