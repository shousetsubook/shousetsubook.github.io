<template>
    <div
        v-bind:id="paragraphId"
        v-html="text.content"
        v-bind:style="jisageStyle"
        class="paragraph text-component"
    ></div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
    name: 'BookParagraph',
    props: ['text'],
    data: function () {
        return {
            paragraphId: this.text.index + '-paragraph',
            jisageStyle: {
                margin: this.text.jisage + "em 0 0 0"
            }
        }
    }
});
</script>

<style>
    .paragraph {
        text-align:justify;
        word-wrap:break-word;
        background-color:rgb(241, 237, 212);
    }

    .latin-long {
        text-orientation: sideways;
    }
</style>