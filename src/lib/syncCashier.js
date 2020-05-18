/*
Synchronization module for CashierSync.
*/
import axios from "axios";
import appService from "../appService";
import { settings, SettingKeys } from "./Configuration";
import { engine } from "./AssetAllocation";

/**
 * Cashier Sync class talks to CashierSync on the server. The methods here represent the methods
 * implemented by the server. This is a proxy class for fething Ledger data.
 */
export class CashierSync {
  constructor(serverUrl) {
    if (serverUrl.endsWith("/")) {
      serverUrl = serverUrl.splice(0, serverUrl.length - 1);
    }
    this.serverUrl = serverUrl;
  }

  get(path) {
    let url = this.serverUrl + path;
    return axios.get(url);
  }

  async healthCheck() {
    let result = await this.get("/");
    return result.data;
  }

  /**
   * Retrieve the list of accounts
   * @returns array of Account objects
   */
  async readAccounts() {
    let url = this.serverUrl + "/balance";
    let response = await axios.get(url);
    let content = response.data;

    return content;
  }

  /**
   * Imports the accounts from the JSON returned by readAccounts().
   * @param {string} accountsJson
   */
  async importAccounts(accountsJson) {
    let promise = appService.importBalanceSheet(accountsJson);

    return promise;
  }

  async readCurrentValues() {
    let rootAcct = await settings.get(SettingKeys.rootInvestmentAccount);
    let currency = await settings.get(SettingKeys.currency);

    let url = this.serverUrl + "/currentValues";

    let response = await axios.get(url, {
      params: {
        root: rootAcct,
        currency: currency
      }
    });
    let result = response.data;
    // console.log('response:', result)

    await engine.importCurrentValues(result);
    return "OK";
  }

  /**
   * Retrieves the Security Analysis from Cashier Sync.
   * @param {string} symbol 
   */
  async readSecurityAnalysis(symbol) {
    let currency = await settings.get(SettingKeys.currency);
    let url = this.serverUrl + '/securitydetails'

    let response = await axios.get(url, {
      params: {
        'symbol': symbol,
        'currency': currency
      }
    })
    let result = response.data
    return result
  }

  async readLots(symbol) {
    let url = this.serverUrl + '/lots'
    let params = { symbol: symbol }

    let response = await axios.get(url, { params: params })
    let result = response.data
    return result
  }
}
