<template>
    <q-page padding class="text-colour2">
        <!-- toolbar -->
        <q-header elevated class="glossy">
            <q-toolbar class="text-colour2">
                <q-btn flat dense round aria-label="Menu" @click="toggleDrawer">
                    <icon-menu />
                </q-btn>

                <q-toolbar-title>Delete Postings</q-toolbar-title>
                <q-space />

                <q-btn flat round dense @click="onSaveClicked">
                    <icon-check />
                </q-btn>
            </q-toolbar>
        </q-header>

        <!-- Postings list -->
        <q-list separator>
            <q-item v-for="(post, index) in postings" :key="index" v-ripple clickable class="list-item">
                <q-item-section>{{ post.account }}</q-item-section>
                <q-item-section>
                    {{ post.amount }}
                </q-item-section>
                <q-item-section>
                    {{ post.currency }}
                </q-item-section>
                <q-item-section side>
                    <Trash2 color="darkred" @click="onDeletePostingClicked(index)" />
                </q-item-section>
            </q-item>

        </q-list>

        <!-- floating action button -->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
                <Check />
            </q-btn>
        </q-page-sticky>

    </q-page>
    <!-- Delete posting confirmation dialog -->
    <q-dialog v-model="deletePostingConfirmationVisible" persistent content-class="bg-blue-grey-10">
        <q-card class="bg-negative text-amber-2">
            <q-card-section class="row items-center">
                <span>Do you want to delete the posting?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn v-close-popup flat label="No" color="accent" />
                <q-btn v-close-popup flat label="Yes" color="accent" @click="onDeletePostingConfirmed" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
import { Check, Trash2 } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { Posting } from 'src/model';
import { useMainStore } from 'src/store/mainStore';
import { Ref, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import useNotifications from 'src/lib/CashierNotification'

const router = useRouter()
const mainStore = useMainStore()
const store = useStore()
const { tx } = storeToRefs(mainStore)
const Notification = useNotifications()

const postingIndexToDelete = ref(-1)
const deletePostingConfirmationVisible = ref(false)

const postings: Ref<Posting[]> = ref([])

onMounted(async () => {
    // load postings
    loadPostings()
})

function deletePosting(index: number) {
    tx.value?.postings.splice(index, 1)
}

function loadPostings() {
    postings.value = tx.value.postings
}

/**
 * The user requested to delete a posting
 * @param index index of the Posting that was clicked
 */
function onDeletePostingClicked(index: number) {
    postingIndexToDelete.value = index
    deletePostingConfirmationVisible.value = true
}

function onDeletePostingConfirmed() {
    deletePosting(postingIndexToDelete.value)
}

function onFabClicked() {
    //   onSaveClicked()
    save()
    router.back()

}

function save() {
    // save the postings into the local store
    tx.value.postings = postings.value

    // Notification.positive('Posting deleted')
}

</script>