# cashier

https://cashier.alensiljak.ml/

is a PWA GUI application for [Ledger-cli](https://ledger-cli.org). It is intended to be used for entering transactions or quickly previewing balances. The entered transactions can be exported and merged to the mail ledger file, and the accounts and balances can be imported from Ledger to establish baselines.

See the [TODO](TODO) file for the list of features, technical issues, brainstorming ideas, and priorities.

[![Netlify Status](https://api.netlify.com/api/v1/badges/2d57ffbd-b4be-4eb4-b56b-f1aefc285364/deploy-status)](https://app.netlify.com/sites/cashier-pwa/deploys)

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
