<template>
    <div>
        <h1>Data test</h1>

        <div class="row">
            <textarea v-bind="dummy">Some dummy text</textarea>
            <button type="button" v-on:click=saveData>Save some data</button>
        </div>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            something: 'nothing',
            dummy: null
        }
    },
    methods: {
        saveData() {
            console.log(this.dummy)
        }
    }
}
</script>
