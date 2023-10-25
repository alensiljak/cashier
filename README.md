# cashier

A mobile companion for Ledger-cli

Live app: https://cashier.alensiljak.eu.org/

Cashier is a PWA GUI assistant application for [Ledger-cli](https://ledger-cli.org). It can be used for entering transactions and viewing account balances. The focus is on use on a mobile device.
The accounts and balances can be imported from Ledger to establish baselines and the entered transactions can be exported to be merged into the main ledger file.

The app works completely offline, meaning **all** the data required for the functioning of the app is stored in a local database in a browser.

The existing data from your Ledger book can be populated by using [Cashier Server](https://github.com/alensiljak/cashier-server-rust). This will provide your ledger reports and balances to Cashier. Since Ledger-cli is **readonly**, your data is only ever read. Cashier or Cashier Ledger Server cannot write to a Ledger book.

The transactions entered in Cashier can be exported as a Ledger-formatted text and then appended to your Ledger book manually.

# Features

- Transaction entry and editing
- Scheduled Transactions
- Favourite accounts list
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

```bash
npm run dev
```

which is equivalent to `quasar dev --mode pwa`.

Then open the browser at http://localhost:9200

## Debugging

To debug with Firefox and VS Code, see

1. install Firefox debugger [extension](https://github.com/firefox-devtools/vscode-firefox-debug) in VS Code
2. create a launch configuration in vscode
3. run `"C:\Program Files\Firefox Developer Edition\firefox.exe" -start-debugger-server`

## WASM

Cashier is using `ledger-rs-lib` library in WASM.

Build with `wasm-pack build` to generate a package for use with bundlers. This will output the npm package contents it the pkg subfolder. Add this local path to the dev_dependencies.
Once the package is published, it will be linked from the NPM repository.

Use `vite-plugin-wasm` plugin.

Import from Wasm using:
```js
import * as ledger from 'ledger-rs-lib'
```

## Maintenance

Updating libraries: list outdated with `npm outdated`.

## Building

Build the release version with `npm run build`.
This is the equivalent of `quasar build --mode pwa`.

## Test

The testing is done with Playwright. Run the Dev server first, then trigger the tests with:

`npm run test`

or

`npx playwright test new-tx`

## Linter

eslint is used for linting.
The vite plugin is enabled. To disable ESLint, comment-out the eslint block in the quasar.config.js or
comment-out the lines inside it (warnings, errors).

ESLint itself is configured through .eslintrc.js cofiguration file.

## Deployment

### Test

`npx netlify deploy` deploys to a temporary url for testing.

### Production

Using Netlify to serve HTTPS site, as required by PWA specs. The [base url](https://cashier-pwa.netlify.com/) is on Netlify.

Manual deployment is done using `netlify-cli` package installed in the project.
Run `npm run deploy` from the root project directory. This requires netlify.toml. Otherwise, run from dist/pwa directory. To deploy the Prod version, run `npx netlify deploy --prod`.

# Cashier Ecosystem

Here is the description on how to set up Cashier on Android. It demonstrates the main principles on any platform.

Open https://cashier.alensiljak.eu.org in the browser. Use "Add to Home screen" or "Install" options to add the app.

Set up synchronization with [Ledger Server](https://github.com/alensiljak/cashier-server-rust):

## Cashier Server Setup

This is a description for Termux on Android but the principles apply to any environment.

1. install Termux
2. install ledger package (`pkg install ledger`)
3. install [Cashier server](https://github.com/alensiljak/cashier-server-rust): `cargo install cashier-server`
4. transfer (git clone, synchronize, or manually create files and folders) for the ledger book and prices to the device
5. make ledger functional: i.e. set up .ledgerrc in the home directory to point to the book and prices files
6. add the Termux shortcuts for updating the data (`git pull`, `lazygit`, `gitui`, etc.)
7. add a Termux shortcut to run Cashier Server

After this, Cashier Server should be able to run Ledger reports, as Termux applications are usually executed in the user's home directory.

## Data Transfer

To transfer the transactions from the mobile device to desktop you can use any of the following options:

- add lazygit and a shortcut for opening it in the book directory. This can be used to commit the transactions to a remote directory directly from a mobile device
- export the transactions file (in ledger format)
- transfer files via pCloud export
