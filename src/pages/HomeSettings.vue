<template>
    <q-page padding class="text-colour2">
        <toolbar title="Home Settings" />

        <div>Show Cards:</div>

        <q-list>
            <q-item>
                <q-checkbox v-model="_showFavourites" label="Favourites" />
            </q-item>
            <q-item>
                <q-checkbox v-model="_showForecast" label="Financial Forecast" />
            </q-item>
            <q-item>
                <q-checkbox v-model="_showJournal" label="Journal" />
            </q-item>
            <q-item>
                <q-checkbox v-model="_showScheduled" label="Scheduled Transactions" />
            </q-item>
            <q-item>
                <q-checkbox v-model="_showSync" label="Synchronization" />
            </q-item>
        </q-list>

        <!-- FAB -->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab color="accent" text-color="secondary" @click="onFab">
                <check-icon />
            </q-btn>
        </q-page-sticky>
    </q-page>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, Ref } from 'vue';
import { CardNames, SettingKeys, settings } from '../lib/settings'
import Toolbar from '../components/CashierToolbar.vue'
import { Check as CheckIcon } from 'lucide-vue-next'

const router = useRouter()
const _showFavourites: Ref<boolean> = ref(false)
const _showForecast: Ref<boolean> = ref(false)
const _showJournal: Ref<boolean> = ref(false)
const _showScheduled: Ref<boolean> = ref(false)
const _showSync: Ref<boolean> = ref(false)

onMounted(async () => {
    //
    await loadSettings()
})

async function loadSettings() {
    var visibleCardNamesSetting: string = await settings.get(SettingKeys.visibleCards)
    var cardNames: Array<string>

    if (visibleCardNamesSetting == null) {
        // show all cards by default
        cardNames = Object.values(CardNames)
    } else {
        cardNames = visibleCardNamesSetting.split(',')
    }

    // mark checked the ones that are visible
    if (cardNames.indexOf(CardNames.FavouritesCard) != -1) {
        _showFavourites.value = true
    }
    if (cardNames.indexOf(CardNames.ForecastCard) != -1) {
        _showForecast.value = true
    }
    if (cardNames.indexOf(CardNames.JournalCard) != -1) {
        _showJournal.value = true
    }
    if (cardNames.indexOf(CardNames.ScheduledXactCard) != -1) {
        _showScheduled.value = true
    }
    if (cardNames.indexOf(CardNames.SyncCard) != -1) {
        _showSync.value = true
    }
}

async function onFab() {
    await saveSettings()
}

async function saveSettings() {
    var visibleNames = []

    if (_showFavourites.value) visibleNames.push(CardNames.FavouritesCard)
    if (_showForecast.value) visibleNames.push(CardNames.ForecastCard)
    if (_showJournal.value) visibleNames.push(CardNames.JournalCard)
    if (_showScheduled.value) visibleNames.push(CardNames.ScheduledXactCard)
    if (_showSync.value) visibleNames.push(CardNames.SyncCard)

    await settings.set(SettingKeys.visibleCards, visibleNames.join(','))

    router.back()
}
</script>