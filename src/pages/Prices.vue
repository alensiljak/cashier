<template>
  <q-page padding class="text-amber-2">
    <toolbar :title="'Prices'" />

    <p>Prices:</p>
    <ul>
      <li>Add the commodities</li>
      <li>select the commodities you want to track the prices for</li>
      <li>select the source</li>
      <li>update prices</li>
      <li>export in ledger format</li>
    </ul>

    <div>
      <q-btn label="Get Commodities" @click="getCommodities" />
      <ul>
        <li v-for="commodity in commodities" :key="commodity.symbol">
          {{ commodity.symbol }}
          <!-- <q-btn label="download" @click="downloadPrice(commodity.symbol)" /> -->
        </li>
      </ul>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import appService from '../appService'
import Toolbar from '../components/CashierToolbar.vue'
import { Price } from '../model'
// import { morningstar } from '../lib/PriceDownloaderMorningstar'

const commodities: Ref<string[]> = ref([])

function getCommodities() {
  appService.getInvestmentCommodities().then((investmentCommodities) => {
    for (let i = 0; i < investmentCommodities.length; i++) {
      const price = new Price()
      price.symbol = investmentCommodities[i]
      commodities.value.push(price.currency as string)
    }
  })
}

    // downloadPrice(symbol) {
    // console.log(symbol)
    // let m = morningstar.download(symbol)
    // console.log(m)
    // },

</script>
