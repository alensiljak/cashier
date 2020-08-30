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
    if (!serverUrl) {
      throw "CashierSync URL not set."
    }
    if (serverUrl.endsWith("/")) {
      serverUrl = serverUrl.splice(0, serverUrl.length - 1);
    }
    this.serverUrl = serverUrl;
  }

  get(path) {
    let url = this.serverUrl + path;
    return axios.get(url);
  }

  /**
   * See if the server is running
   */
  async healthCheck() {
    let result = await this.get("/");
    return result.data;
  }

  /**
   * Retrieve the list of accounts
   * @returns array of Account objects
   */
  async readAccounts() {
    //let url = this.serverUrl + "/balance";
    let url = this.serverUrl + "/accounts";
    let response = await axios.get(url);
    let content = response.data;

    return content;
  }

   /**
   * Retrieve the account balances.
   * @returns array of Account objects
   */
  async readBalances() {
    let url = this.serverUrl + "/balance";
    let response = await axios.get(url);
    let content = response.data;

    return content;
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

  /**
   * Appends the given content to a file. Used to write the transactions to journal.
   * @param {string} filePath 
   * @param {string} content 
   */
  async append(filePath, content) {
    let url = `${this.serverUrl}/append`
    let response = await axios.post(url, {
      filePath: filePath,
      content: content
    })
    let result = response.data;
    return result;
  }

  /**
   * Pull from the remote repository. 
   * @param {string} repoPath The path to the repository.
   */
  async repoPull(repoPath) {
    let url = `${this.serverUrl}/repo/pull`
    let response = await axios.post(url, {
      repoPath: repoPath
    })
    let content = response.data;
    return content;
  }

  async repoCommit(repoPath, commitMessage) {
    let url = `${this.serverUrl}/repo/commit`
    let response = await axios.post(url, {
      repoPath: repoPath,
      commitMessage: commitMessage
    })
    let content = response.data;
    return content;
  }

  async repoPush(repoPath) {
    let url = `${this.serverUrl}/repo/push`
    let response = await axios.post(url, {
      repoPath: repoPath
    })
    let content = response.data;
    return content;
  }

  async repoStatus(repoPath) {
    let url = `${this.serverUrl}/repo/status`
    let params = { repoPath: repoPath }
    let response = await axios.get(url, { params: params })
    let result = response.data
    return result
  }

  /**
   * Shutdown CashierSync server from the client app.
   */
  shutdown() {
    let url = this.serverUrl + '/shutdown'
    return axios.get(url)
  }

  /**
   * Retrieves the list of historical transactions from ledger.
   * @param {string} accountName 
   * @param {*} dateFrom 
   * @param {*} dateTo 
   */
  // async transactions(accountName, dateFrom, dateTo) {

  // }
}
