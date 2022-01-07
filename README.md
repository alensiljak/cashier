# cashier

https://cashier.alensiljak.eu.org/

is a PWA GUI application for [Ledger-cli](https://ledger-cli.org). It is intended to be used for entering transactions and previewing balances. The accounts and balances can be imported from Ledger to establish baselines and the entered transactions can be exported to be merged into the main ledger file.

The app works completely offline, meaning **all** the data required for the functioning of the app is stored in a local database. In addition, it is *possible* to get the data from your Ledger book by using a separate component [cashier-sync](https://gitlab.com/alensiljak/cashiersync). The data flow is **one-way** only, from Ledger to Cashier. Cashier or Cashier Sync will never write to your Ledger book.
It is also possible to export the transactions from Cashier as Ledger files, which can be manually added to the main book.

See the [TODO](TODO) file for the historical list of features, technical issues, brainstorming ideas, and priorities. This was used as the base for the development.

# Features

- Transaction entry and editing
- Scheduled Transactions
- Balance Sheet
- Register
- Data Transfer
  - import/export
  - synchronization with cashier-sync
- Asset Allocation

# Development

Using pnpm package manage. Install globally `npm install -g pnpm`.
Run the dev server `pnpm serve` or `pnpm dev` and open the browser on http://localhost:8080.

## Maintenance

Updating libraries: list outdated with `pnpm outdated`.

## Building

Build the release version with `pnpm build` (this is the equivalent of `pnpm run build`).

## Deployment

Using Netlify to serve HTTPS site, as required by PWA specs. The [base url](https://cashier-pwa.netlify.com/) is on Netlify.

Automatic deployment is triggered when the Release branch is updated.

Manual deployment is done using `netlify-cli` (an NPM package installed globally - `pnpm i -g netlify-cli`).
Run `netlify deploy` from the root project directory. This requires netlify.toml. Otherwise, run from dist/pwa directory.
To deploy the Prod version, run `netlify deploy --prod`.

# Cashier Ecosystem

Here is the description on how to set up Cashier on Android. It demonstrates the main principles on any platform.

Open https://cashier.alensiljak.eu.org in the browser. Use "Add to Home screen" or "Install" options to add the app.

Set up synchronization with [cashiersync](https://gitlab.com/alensiljak/cashier-sync):

## Android

- Install Termux
- install ledger package (this seems to fail lately, you can use a linux distro in Termux, like Alpine or Arch)
- add the Termux shortcuts for updating the data (git pull)
- add the Termux shortcut to run cashiersync

## Set up

- install python
- install cashier sync with `pip install cashiersync`
- git clone or manually create folders for the ledger book and prices
- set up .ledgerrc in the home directory, to point to the book and prices files

## Data Transfer

To transfer the transactions from the mobile device to desktop:

- add lazygit and a shortcut for opening it in the book directory. This can be used to commit the transactions directly on the mobile device.
- export the transactions file (in ledger format)
- transfer files via pCloud export
