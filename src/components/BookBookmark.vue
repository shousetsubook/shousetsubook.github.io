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
                visibility: this.$store.getters['book/isBookmarked'] ? 'visible' : 'hidden',
            }
        }
    },

    created() {
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
        } else {
            // the next animation frame takes a really long time for long books, so use this to render it when the page repaints
            requestAnimationFrame(() => {
                var title = document.getElementById("title");
                if (title == null) {
                    console.log("Book doesn't have a title for some reason...")
                } else {
                    title.scrollIntoView();
                    this.pxPosition = window.scrollX + title.getBoundingClientRect().left;
                }
            })
        }
    },

    mounted() {
        window.addEventListener('mousedown', (e) => {
            var target = e.target as HTMLElement;
            var originalTarget = target;
            var bubble = target;
            while (bubble.parentElement != null) {
                if (bubble.classList.contains('paragraph')) {
                    break;
                }
                bubble = bubble.parentElement;
            }
            if (bubble.parentElement == null) {
                // target not a bookmarkable element, or any of its ancestors
                return
            }
            target = bubble;
            if (!target.id.startsWith('BookParagraph')) {
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
                var nodeIndex: number = Array.prototype.indexOf.call(originalTarget.childNodes, textNode);
                if (nodeIndex == -1) {
                    return;
                }
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