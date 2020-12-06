<template>
    <div
        v-bind:id="paragraphId"
        v-html="text.content"
        v-bind:style="jisageStyle"
        class="paragraph"
    ></div>
</template>

<script>
export default {
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
}
</script>

<style scoped>
    .paragraph {
        text-align:justify;
        word-wrap:break-word;
        background-color:rgb(241, 237, 212);
    }
</style>