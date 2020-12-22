<template>
<div class="the-book-wrapper">
    <div class="the-book">
        <BookBookmark/>
        <h1 id="title">{{title}}</h1>
        <h2>{{author}}</h2>
        <component
            v-bind:key="text.index"
            v-bind:id="text.textType + '-' + text.index"
            v-for="text in textComponents"
            v-bind:is="text.textType"
            v-bind:text="text"
        ></component>
    </div>
</div>
</template>

<script lang="ts">
import BookBookmark from './BookBookmark.vue'
import BookParagraph from './BookParagraph.vue'
import BookHeader from './BookHeader.vue'
import BookLineBreak from './BookLineBreak.vue'
import Vue from 'vue'
export default Vue.extend({
    name: 'TheBook',

    components: {
        BookBookmark: BookBookmark,
        BookParagraph: BookParagraph,
        BookHeader: BookHeader,
        BookLineBreak: BookLineBreak,
    },

    data: function() {
        return {
            position: 0,
            encoding: 'shift-jis',
        }
    },

    methods: {
    },

    computed: {
        isLoaded: function() {
            return this.$store.getters['book/isLoaded']
        },
        title: function () {
            return this.$store.getters['book/title']
        },
        author: function() {
            return this.$store.getters['book/author']
        },
        textComponents: function() {
            return this.$store.getters['book/textComponents']
        },
    },

});
</script>

<style scoped>
.the-book-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    position:absolute;
}

.the-book {
    -ms-writing-mode: tb-rl;
    writing-mode: tb-rl;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size:18px;
    height: 80vh;
}
</style>