<template>
    <q-card bordered>
        <q-card-section class="bg-primary q-pa-sm">
            <ChartColumnBig class="icon q-mr-sm" size=20 />
            <strong>Financial Forecast</strong>
            <span class="float-right">
                <q-btn flat round dense size="0.5rem">
                    <settings-icon class="icon q-mr-sm" size="20" @click="onSettingsClicked" />
                </q-btn>
            </span>
        </q-card-section>

        <q-card-section class="q-pa-sm">
            <div v-if="accountNames.length === 0">
                There are no accounts selected for forecasting
            </div>

            <p>incomplete!</p>
        </q-card-section>
    </q-card>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChartColumnBig, Settings as SettingsIcon } from 'lucide-vue-next'
import { Constants } from 'src/lib/settings';
import { Ref, ref } from 'vue';

const router = useRouter()

const accountNames: Ref<Array<string>> = ref([])
const forecastDays: Ref<number> = ref(Constants.ForecastDays)

function onSettingsClicked() {
    // open forecast settings
    router.push('/forecast-settings')
}
</script>