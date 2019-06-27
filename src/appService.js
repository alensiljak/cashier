/*
    Provide service layer for the application.

    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
*/
import db from "./dataStore";
import { Account, Transaction, Posting, Payee } from "./model";
import { Notify } from "quasar";
import { settings, SettingKeys } from "./lib/Configuration";

class AppService {
  createAccount(name) {
    let acc = new Account();
    acc.name = name;

    return db.accounts.add(acc);
  }

  addPayee(name) {
    let payee = new Payee(name);

    return db.payees.put(payee);
  }

  createTransaction() {
    var tx = new Transaction();
    tx.date = new Date().toISOString().substring(0, 10);

    tx.postings.push(new Posting());
    tx.postings.push(new Posting());

    return tx;
  }

  get db() {
    return db;
  }

  deleteAccount(name) {
    return db.accounts.delete(name);
  }

  deleteAccounts() {
    return db.accounts.clear();
  }

  deletePayees() {
    return db.payees.clear();
  }

  /**
   * Delete transaction and related postings.
   * @param {*} id
   */
  deleteTransaction(id) {
    return db.transaction("rw", db.transactions, db.postings, () => {
      // delete transaction record
      db.transactions.filter(tx => tx.id == id).delete();

      // delete postings
      db.postings.filter(value => value.transactionId == id).delete();
    });
  }

  /**
   * Delete all transactions.
   */
  deleteTransactions() {
    // also clear any remaining postings
    this.db.postings.clear();
    return this.db.transactions.clear();
  }

  /**
   * Returns all the register transactions as text,
   * ready to be exported as a file or copied as a string.
   */
  exportTransactions() {
    return db.transactions
      .orderBy("date")
      .toArray()
      .then(txs => {
        var output = "";

        for (let i = 0; i < txs.length; i++) {
          let tx = txs[i];
          // transaction
          output += tx.date;
          output += " " + tx.payee;
          output += "\n";
          // postings
          for (let j = 0; j < tx.postings.length; j++) {
            let p = tx.postings[j];
            if (!p.account) continue;

            output += "    ";
            output += p.account == null ? "" : p.account;
            if (p.amount) {
              output += "  ";
              output += p.amount == null ? "" : p.amount;
              output += " ";
              output += p.currency == null ? "" : p.currency;
            }
            output += "\n";
          }
          output += "\n";
        }
        return output;
      });
  }

  /**
   * Get all the investment accounts in a dictionary.
   * Start from the investment root setting, and include the commodity.
   * @returns Promise with investment accounts collection
   */
  async getInvestmentAccounts() {
    // get the root investment account.
    let rootAccount = await settings.get(SettingKeys.rootInvestmentAccount);

    if (!rootAccount) {
      throw "Root investment account not set!";
    }

    return this.db.accounts.where("name").startsWithIgnoreCase(rootAccount);
  }

  /**
   * Get all the investment commodities. These are commodities used in inv. accounts.
   */
  async getInvestmentCommodities() {
    // get all investment accounts, iterate to get unique commodities?
    let commodities = [];

    let accounts = await this.getInvestmentAccounts();
    await accounts.each(account => {
        // console.log("each");
        commodities.push(account.currency);
      })

    // keep only unique values
    commodities = [...new Set(commodities)];
    commodities.sort();

    // console.log("exiting");
    return commodities;
  }

  async importBalanceSheet(text) {
    if (!text) {
      let message = "No balance sheet selected."
      // Notify.create({ message: "No balance sheet selected." });
      throw message
      // return;
    }

    let accounts = [];
    let mainCurrency = await settings.get(SettingKeys.currency)
    let mainCurrencyAmount = null;
    let multicurrencyAccount = false;

    // read and parse the balance sheet string
    let lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      // console.log(lines[i]);
      let line = lines[i];
      let account = new Account();

      let balancePart = line.substring(0, 20);
      balancePart = balancePart.trim();
      // separate the currency
      let balanceParts = balancePart.split(" ");

      let amountPart = balanceParts[0];
      // clean-up the thousand-separators
      amountPart = amountPart.replace(/,/g, "");
      account.balance = parseFloat(amountPart);

      // currency
      let currencyPart = balanceParts[1];
      account.currency = currencyPart;

      let namePart = line.substring(21).trim();
      account.name = namePart;

      // If we have a currency but no account, it's a multicurrency account.
      if (!namePart) {
        if (currencyPart) {
          multicurrencyAccount = true;

          if (currencyPart === mainCurrency) {
            mainCurrencyAmount = account.balance;
          }
        }

        continue;
      }

      if (multicurrencyAccount) {
        // Use the main currency.
        account.currency = mainCurrency
        account.balance = mainCurrencyAmount

        // reset the indicator.
        multicurrencyAccount = false;
        mainCurrencyAmount = null;
      }

      // console.log(account)
      accounts.push(account);
    }

    return db.accounts.bulkPut(accounts);
  }

  importCommodities(text) {
    if (!text) {
      Notify.create({ message: "No data to import." });
      return;
    }

    let commodities = [];
    let lines = text.split("\n");

    for (let i = 0; i < lines.length - 1; i++) {
      let commodity = lines[i].trim();
      commodities.push(commodity);
    }

    // todo: save

    return commodities;
  }

  loadAccount(id) {
    return db.accounts.get(id);
  }

  /**
   * @returns Collection
   */
  loadAccounts() {
    return db.accounts.orderBy("name");
  }

  loadAssetClass(fullname) {
    return db.assetAllocation.get(fullname)
  }

  /**
   * Load single transaction with postings.
   * @param {int} id Transaction id
   * @returns Transaction with Postings
   */
  loadTransaction(id) {
    return db.transaction("r", db.transactions, db.postings, () => {
      return db.transactions.get(id).then(tx => {
        // todo load postings
        return db.postings
          .where({ transactionId: tx.id })
          .toArray()
          .then(postings => {
            // console.log('posting', postings)
            tx.postings = postings;
            return tx;
          });

        // return tx
      });
    });
  }

  saveAccount(account) {
    return db.accounts.put(account);
  }

  /**
   * Save the transaction to the database.
   * @param {Transaction} tx The transaction object
   */
  saveTransaction(tx) {
    if (tx.id === null) {
      // create a new id for the transaction
      tx.id = new Date().getTime();
      // set transaction id on postings
      for (let i = 0; i < tx.postings.length; i++) {
        tx.postings[i].transactionId = tx.id;
      }
      // tx.postings.forEach(p => p.transactionId == tx.id)
    }

    // save all items in a transaction
    return db.transaction("rw", db.transactions, db.postings, () => {
      db.postings.bulkPut(tx.postings);
      // tx.postings.forEach(posting => {
      //     db.postings.put(posting)
      // })

      return db.transactions.put(tx); // returns the transaction id
    });
  }
}

// export const appService = new AppService();
export default new AppService();
