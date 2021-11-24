# cashier

https://cashier.alensiljak.eu.org/

is a PWA GUI application for [Ledger-cli](https://ledger-cli.org). It is intended to be used for entering transactions and previewing balances. The accounts and balances can be imported from Ledger to establish baselines and the entered transactions can be exported to be merged into the main ledger file.

See the [TODO](TODO) file for the list of features, technical issues, brainstorming ideas, and priorities.

[![Netlify Status](https://api.netlify.com/api/v1/badges/2d57ffbd-b4be-4eb4-b56b-f1aefc285364/deploy-status)](https://app.netlify.com/sites/cashier-pwa/deploys)

# Features

- Balance Sheet
- Transaction entry and editing
- Register
- Data Transfer
  - import/export
  - synchronization with cashier-sync

# Development

Run the dev server `yarn serve` or `yarn dev` and open the browser on http://localhost:8080.

## Maintenance

Updating libraries: list outdated with `yarn outdated`.

## Building

Build the release version with `yarn build` (this is the equivalent of `yarn run build`).

## Deployment

Using Netlify to serve HTTPS site, as required by PWA specs. The [base url](https://cashier-pwa.netlify.com/) is on Netlify.

The automatic deployment is triggered when the Release branch is updated.

The manual deployment is done using `netlify-cli` (an NPM package installed globally). Run `netlify deploy` from the root project directory. This requires netlify.toml. Otherwise, run from dist/pwa directory.
To deploy the Prod version, run `netlify deploy --prod`.

# Cashier Ecosystem

Here is the description on how to set up Cashier on Android. It demonstrates the main principles on any platform.

Open https://cashier.alensiljak.eu.org in the browser. Use "Add to Home screen" or "Install" options to add the app.

Set up synchronization with [cashiersync](https://gitlab.com/alensiljak/cashier-sync):

- Install Termux
  - install python and ledger packages
  - install cashier sync, `pip install cashiersync`
- git clone or manually create folders for the ledger book and prices
- set up .ledgerrc in the home directory, to point to the book and prices files
- add the Termux shortcuts for updating the data (git pull)
- add the Termux shortcut to run cashiersync

To transfer the transactions from the mobile device to desktop:

- add lazygit and a shortcut for opening it in the book directory. This can be used to commit the transactions directly on the mobile device.
- transfer files via pCloud export
