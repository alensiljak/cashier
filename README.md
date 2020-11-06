# cashier

https://cashier.alensiljak.eu.org/

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

### Maintenance

Updating libraries: list outdated with `yarn outdated`.

### Building

Build the release version with `yarn build`. Or `yarn run build`?

### Deployment

Using Netlify to serve HTTPS site, as required by PWA specs. The [base url](https://cashier-pwa.netlify.com/) is on Netlify.

The automatic deployment is triggered when the Release branch is updated.

The manual deployment is done with `netlify-cli` (installed from NPM), using `netlify deploy` from the root project directory. This requires netlify.toml. Otherwise, run from dist/pwa directory.


## Cashier Ecosystem

Here is the description on how to set up Cashier on Android. It demonstrates the main principles on any platform.

Open https://cashier.alensiljak.eu.org in the browser. Use "Add to Home screen" or "Install" options to add the app.

Set up synchronization with [cashiersync](https://gitlab.com/alensiljak/cashier-sync):

- Install Termux
  - install python and ledger packages
  - install cashiersync with pip
- clone or create folders for the ledger book and prices
- set up .ledgerrc in the home directory, to point to the book and prices files
- add the Termux shortcuts for updating the data (pull)
- add the Termux shortcut to run cashiersync
