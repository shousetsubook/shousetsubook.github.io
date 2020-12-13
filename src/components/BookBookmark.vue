<template>
<div
    class="bookmark-indicator"
    :style="bookmarkStyle"
></div>
</template>

<script lang="ts">
import Vue from 'vue'
//import { BOOKMARK_CLASS } from '../helpers/bookmark'

export default Vue.extend({
    name: 'BookBookmark',
    
    data() {
        return {
            pxPosition: 0,
        }
    },

    computed: {
        bookmarkStyle() :Partial<CSSStyleDeclaration> {
            return {
                left: this.pxPosition + 'px',
            }
        }
    },

    mounted() {
        window.addEventListener('click', (e) => {
            this.$store.dispatch('book/bookmarkClick',{e});
        })
    }

    
});

</script>

<style scoped>
.bookmark-indicator {
    margin-top: -9vh;
    color: rgb(255, 255, 255);
    padding: 1vh;
    height:7vh;
    position: absolute;
    pointer-events: none;
    font-size: 7vh;
    width: 3px;
    background-color:rgb(45, 82, 185);
}
</style>