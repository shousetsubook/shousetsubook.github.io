<template>
<div
    class="bookmark-indicator"
    :style="bookmarkStyle"
></div>
</template>

<script lang="ts">
import Vue from 'vue'
import { bookmarkFromHash, idFromBookmark } from '../helpers/bookmark'

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
        var bookmark = bookmarkFromHash(location.hash);
        if (bookmark.paragraph != null && (bookmark.paragraph + bookmark.character + bookmark.node > 0)) {
            this.$store.commit('book/loadBookmark', bookmark);
            this.$nextTick(function() {
                var id = idFromBookmark(bookmark);
                var bookmarkedChar = document.getElementById(id);
                if (bookmarkedChar != null) {
                    this.pxPosition = bookmarkedChar.getBoundingClientRect().left;
                    location.hash = "";
                    location.hash = id;
                }
            });
        }
        window.addEventListener('mousedown', (e) => {
            var target = e.target as HTMLElement
            if (target == null || target.id == null) {
                console.log('Invalid target. Logging event for debugging')
                console.log(e)
                return 
            }
            if (!target.classList.contains('paragraph')) {
                // can only bookmark when clicking on the text. Todo, get nearest paragraph of click
                return
            }
            if (!target.id.startsWith('BookParagraph')) {
                // TODO: try bubbling up before just exiting, could have clicked on a child node
                // https://github.com/shousetsubook/shousetsubook.github.io/blob/50bd35b2abbecb2e82c766088082a88d3450bc07/src/components/BookBookmark.vue#L105
                console.log("didn't click on what we expected. Logging target for debug info")
                console.log(target)
                return
            }
            var paragraphIndexMatch = target.id.match(/(\d+)/);
            if (paragraphIndexMatch == null) {
                console.log("couldn't get paragraph index from id. Logging target for debug info")
                console.log(target)
                return
            }
            var paragraphIndex = parseInt(paragraphIndexMatch[0]);

            this.$store.commit('book/removeBookmark');
            this.$nextTick(function() {
                var range: Range | CaretPosition;
                var offset: number;
                var textNode: Node;
                if (document.caretPositionFromPoint) {    // Firefox
                    range = document.caretPositionFromPoint(e.x,e.y) as CaretPosition;
                    textNode = range.offsetNode;
                    offset = range.offset;
                } else if (document.caretRangeFromPoint) {     // Chromium-based
                    range = document.caretRangeFromPoint(e.x,e.y) as Range;
                    textNode = range.startContainer;
                    offset = range.startOffset;
                } else {
                    console.log('unsupported browser')
                    return
                }
                var nodeIndex: number = Array.prototype.indexOf.call(target.childNodes, textNode);
                var bookmark = {
                    paragraph: paragraphIndex,
                    node: nodeIndex,
                    character: offset,
                }
                location.hash = idFromBookmark(bookmark);
                this.$store.commit('book/loadBookmark', bookmark);
                this.$nextTick(function() {
                    this.pxPosition = window.scrollX + e.x;
                })
                

            })
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