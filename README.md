# cashier

A mobile companion for Ledger-cli

https://cashier.alensiljak.eu.org/

Cashier is a PWA GUI assistant application for [Ledger-cli](https://ledger-cli.org). It is intended to be used for entering transactions and previewing balances, mostly on a mobile device. 
The accounts and balances can be imported from Ledger to establish baselines and the entered transactions can be exported to be merged into the main ledger file.

The app works completely offline, meaning **all** the data required for the functioning of the app is stored in a local database in a browser. 

The existing data from your Ledger book can be populated by using [Cashier Ledger Server](https://github.com/MisterY/cashier-ledger-server-go). This will provide your ledger reports to Cashier. Since Ledger-cli is **readonly**, your data only is only read. Cashier or Cashier Ledger Server cannot write to your Ledger book.

The transactions entered in Cashier can be exported in Ledger format and appended to your Ledger book.

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

With the newer versions of node, you can use `corepack enable`.

`npm install`

Start the app in development mode (hot-code reloading, error reporting, etc.)

``` bash
npm run dev
```

which is equivalent to `quasar dev --mode pwa`.

Then open the browser at http://localhost:8080

## Debugging

To debug with Firefox and VS Code, see 

- install Firefox debugger [extension](https://github.com/firefox-devtools/vscode-firefox-debug) in VS Code
- create a launch configuration in vscode
- run `"C:\Program Files\Firefox Developer Edition\firefox.exe" -start-debugger-server`

## Maintenance

Updating libraries: list outdated with `npm outdated`.

## Building

Build the release version with `npm run build`.
This is the equivalent of `quasar build --mode pwa`.

## Deployment

### Test

`npx netlify deploy` deploys to a temporary url for testing.

### Production

Using Netlify to serve HTTPS site, as required by PWA specs. The [base url](https://cashier-pwa.netlify.com/) is on Netlify.

Manual deployment is done using `netlify-cli` package installed in the project.
Run `npm run deploy` from the root project directory. This requires netlify.toml. Otherwise, run from dist/pwa directory. To deploy the Prod version, run `npx netlify deploy --prod`.

## Linter

eslint is used for linting. 
The vite plugin is enabled. To disable ESLint, comment-out the eslint block in the quasar.config.js or
comment-out the lines inside it (warnings, errors).

ESLint itself is configured through .eslintrc.js cofiguration file.

# Cashier Ecosystem

Here is the description on how to set up Cashier on Android. It demonstrates the main principles on any platform.

Open https://cashier.alensiljak.eu.org in the browser. Use "Add to Home screen" or "Install" options to add the app.

Set up synchronization with [Ledger Server](https://github.com/MisterY/cashier-ledger-server-go):

## Android

- Install Termux
- install ledger package (this seems to fail lately, you can use a linux distro in Termux, like Alpine or Arch)
- add the Termux shortcuts for updating the data (git pull)
- add the Termux shortcut to run cashiersync

## Set up

- download Ledger Server from https://github.com/MisterY/cashier-ledger-server-go
- git clone or manually create folders for the ledger book and prices
- set up .ledgerrc in the home directory, to point to the book and prices files

## Data Transfer

To transfer the transactions from the mobile device to desktop:

- add lazygit and a shortcut for opening it in the book directory. This can be used to commit the transactions directly on the mobile device.
- export the transactions file (in ledger format)
- transfer files via pCloud export
