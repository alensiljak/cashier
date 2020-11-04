<template>
  <q-page padding class="bg-colour1 text-amber-2">
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

<script>
import appService from "../appService";
import { Price } from "../model";
// import { morningstar } from '../lib/PriceDownloaderMorningstar'
import Toolbar from '../components/Toolbar'

export default {
  components: {
    Toolbar
  },
  data() {
    return {
      commodities: []
    };
  },

  created() {
  },

  methods: {
    // downloadPrice(symbol) {
    // console.log(symbol)
    // let m = morningstar.download(symbol)
    // console.log(m)
    // },
    getCommodities() {
      appService.getInvestmentCommodities().then(commodities => {
        for (let i = 0; i < commodities.length; i++) {
          const price = new Price();
          price.symbol = commodities[i];
          this.commodities.push(price);
        }
      });
    }
  }
};
</script>
