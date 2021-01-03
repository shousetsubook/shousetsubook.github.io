<template>
<div class="the-book-wrapper" v-bind:class="cursor ? cursorClass : ''">
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
import { TextComponent } from '@/store/book'


export default Vue.extend({
    data: function() {
        return {
            cursor: false,
            cursorClass: 'cursor',
            position: 0,
            encoding: 'shift-jis',
        }
    },

    name: 'TheBook',

    components: {
        BookBookmark: BookBookmark,
        BookParagraph: BookParagraph,
        BookHeader: BookHeader,
        BookLineBreak: BookLineBreak,
    },

    created: function() :void {
        window.addEventListener('keypress', (e) :void => {
            if (e.code == 'KeyM') {
                console.log('m pressed')
                this.cursor = !this.cursor
                console.log(this.cursor)
            }
        });
    },

    computed: {
        cursorStyle(): Partial<CSSStyleDeclaration> {
            if (this.cursor) {
                return {cursor: 'url("../assets/cursor.png") 16 16, auto'}
            }
            return {cursor: 'url(cursor.png)'}
        },
        isLoaded: function() :boolean {
            return this.$store.getters['book/isLoaded']
        },
        title: function () :string {
            return this.$store.getters['book/title']
        },
        author: function() :string {
            return this.$store.getters['book/author']
        },
        textComponents: function() :Array<TextComponent> {
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

.cursor {
    cursor: url("../assets/cursor.png") 16 16, auto;
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