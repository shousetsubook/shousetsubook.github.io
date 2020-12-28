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


    .sesame-vertical {
        font-style: normal;
        padding: 0 7px;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAAASklEQVRIie3RMQ2AQBQFwQEBFChAED7OBgYQhAV6HCCE6gRQfUjeKNhkiYj4pwEb9uIOC07cODBXxoxYcaFVhnSTDyzqStdEvPIAUCgF359HwAgAAAAASUVORK5CYII=') repeat-y;
    }

    .latin-long {
        text-orientation: sideways;
    }

</style>