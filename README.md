# cashier

https://cashier.alensiljak.ml/

is a PWA GUI application for [Ledger-cli](https://ledger-cli.org). It is intended to be used for entering transactions or quickly previewing balances. The entered transactions can be exported and merged to the mail ledger file, and the accounts and balances can be imported from Ledger to establish baselines.

See the [TODO](TODO) file for the list of features, technical issues, brainstorming ideas, and priorities.

## Features

- Balance Sheet
- Transaction entry and editing
- Register
- Data Transfer
  - import/export
  - synchronization with hledger-web

## Development 

Run the dev server `yarn serve` and open the browser on port 8080.

## Building

Build the release version with `yarn build`.

## Deployment

Using Netlify to serve HTTPS site, as required by PWA specs. The [base url](https://cashier-pwa.netlify.com/) is on Netlify.
