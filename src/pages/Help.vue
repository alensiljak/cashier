<template>
  <q-page padding class="text-colour2">
    <toolbar title="Help" />

    <p>Here are some basic instructions on how to set up Cashier.</p>

    <h4 class="q-my-sm text-center">Purpose</h4>
    <p>
      The goal of Cashier is to provide a quick way of creating Ledger-style
      transactions on any device and platform that can run a modern web browser.
      Other than that, it can also be used as a stand-alone personal finance
      app, although that is not it's primary goal.
    </p>
    <p>
      The target platforms include desktop and mobile devices as well as
      anything else.
    </p>

    <h4 class="q-my-sm text-center">Set-up with CashierSync</h4>
    <p>
      The backend functionality for Cashier is provided by CashierSync. It is a
      Python program that links Cashier to your Ledger-cli book. The flow of
      information is only book to Cashier and never directly from Cashier to the
      book. Cashier and CashierSync do not track you or store any of your data
      anywhere else other than on your device. To start:
    </p>
    <ol>
      <li>
        Install Python. On Android, the best option is to install it in Termux.
      </li>
      <li>Install CashierSync with "pip install cashiersync"</li>
      <li>
        Set up Ledger-cli so that it is accessible by CashierSync. For example,
        create .ledgerrc in your home directory, setting up your Ledger default
        settings, specifying files to use, date format, etc.
      </li>
      <li>Run "cashiersync"</li>
    </ol>
    <p>In Cashier,</p>
    <ol>
      <li>
        go to Sync Settings, enter the Server URL. This is the address
        CashierSync is using. The default is on the local machine but it is
        possible to use a remote machine. You can use a service like
        <a href="https://ngrok.com/">ngrok</a> or localtunnel to create a
        temporary public URL, for example.
      </li>
      <li>
        Click Sync to synchronize the account data with CashierSync. Note that
        this will only read your Ledger data and populate Cashier so that it is
        operational with your Accounts.
      </li>
    </ol>
    <p>
      CashierSync source code is available at
      <a href="https://github.com/alensiljak/cashier-server-rust">GitHub</a>
      and the package is available at Crates.io and can be installed with Cargo
      directly.
    </p>

    <h4 class="q-my-sm text-center">Write Cashier changes to your Book</h4>
    <p>
      To perform write operations to a Ledger book, there are several options
      available.
    </p>
    <ul>
      <li>
        On Android, you can use Termux with git, a text editor, and lazygit GUI.
        On the Export screen, the transactions in Ledger format can be copied to
        clipboard and then pasted into any text editor.
      </li>
      <li>
        You can export your transactions into a file and transfer it to the
        device where you can copy them to your book. Snapdrop.net is a practical
        service for transferring files on the same network.
      </li>
    </ul>
  </q-page>
</template>
<script lang="ts" setup>
import Toolbar from '../components/CashierToolbar.vue'
</script>