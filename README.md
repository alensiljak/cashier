# cashier

https://cashier.alensiljak.ml/

Is a PWA GUI companion application for [Ledger-cli](https://ledger-cli.org). It is to be used for entering transactions or viewing balances. The entered transactions are to be exported and the accounts and balances would initially be imported from Ledger output.

This is the Cashier project implemented as a Progressive Web Application.

## Development 

Run the dev server `yarn serve` and open the browser on port 8080.
This will run the vue cli service.

## Packaging

Build with `yarn build`.

## Deployment

Using Netlify to server HTTPS site, as required by PWA.
The [base url](https://cashier-pwa.netlify.com/) is on Netlify.
