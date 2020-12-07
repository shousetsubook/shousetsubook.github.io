<template>
<div
    class="bookmark"
    :style="bookmarkPos"
    :id="'bookmark-'+bookmarkId"
></div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'BookBookmark',
    
    data: function () {
        return {
            pxPosition: 0,
            paragraphIndex: 0,
            nodeIndex: 0,
            charIndex: 0,
        }
    },

    methods: {
        getBookmarkId: function(paragraphIndex :number, nodeIndex :number, charIndex :number) :string {
            if (paragraphIndex + nodeIndex + charIndex) {
                return 'p' + paragraphIndex + 'n' + nodeIndex + 'c' + charIndex;
            } else {
                return 'p' + this.paragraphIndex + 'n' + this.nodeIndex + 'c' + this.charIndex;
            }
        },

        createBookmarkFromTextNode: function(textNode :Node, paragraphIndex :number, nodeIndex :number, charIndex :number): DocumentFragment {
            let sliceUntilBookmark :Text
            let bookmarkCharNode :Text
            let sliceAfterBookmark :Text
            let fragment :DocumentFragment = document.createDocumentFragment();

            if (textNode !== null && textNode.textContent !== null) {
                sliceUntilBookmark = document.createTextNode(textNode.textContent.slice(0, charIndex));
                bookmarkCharNode = document.createTextNode(textNode.textContent[charIndex]);
                sliceAfterBookmark = document.createTextNode(textNode.textContent.slice(charIndex+1));

                let newBookmark :Element = document.createElement('span');
                newBookmark.id = 'p' + paragraphIndex + 'n' + nodeIndex + 'c' + charIndex;
                newBookmark.appendChild(bookmarkCharNode);
                fragment.appendChild(sliceUntilBookmark);
                fragment.appendChild(newBookmark);
                fragment.appendChild(sliceAfterBookmark);
            } else {
                console.log('textNode or textNode.textContent is null in createBookmarkFromtextNode')
            }
            return fragment
        },
        moveBookmark: function(bookmarkId='') {
            if (bookmarkId === '') {
                bookmarkId = 'p' + this.paragraphIndex + 'n' + this.nodeIndex + 'c' + this.charIndex;
            }
            var bookmark = document.getElementById(bookmarkId);
            var domRect :DOMRect
            if (bookmark !== null) {
                domRect = bookmark.getBoundingClientRect();
                var bookmarkLeft = domRect.left + window.scrollX;
                this.pxPosition = bookmarkLeft;
            } else {
                console.log("Couldn't move bookmark")
            }
        },
        resetHash: function () {
            let temp = location.hash
            location.hash = ''
            location.hash = temp
        },

        bookmark: function () {
            var selObj = window.getSelection();
            if (selObj !== null && selObj.toString() && selObj.getRangeAt(0).startContainer.nodeType === Node.TEXT_NODE) {
                var oldBookmark = document.getElementById(this.bookmarkId)
                if (oldBookmark) {
                    oldBookmark.removeAttribute('id')
                    oldBookmark.removeAttribute('style')
                }
                

                var range = selObj.getRangeAt(0);
                var textNode = range.startContainer;
                var parentNode = textNode.parentNode;
                if (parentNode === null) {
                    console.log('Selected Element is a root node, stopping bookmark function')
                    return
                }
                var offset = range.startOffset;

                // get indexes of bookmark (paragraph, node, character)
                var bubble = textNode.parentElement
                while (bubble !== null && !bubble.classList.contains('text-component')) {
                    if (bubble.parentElement == null) {
                        break
                    }
                    bubble = bubble.parentElement;
                }
                if (bubble === null || bubble.id === null) {
                    console.log('Could not find bookmark')
                    return
                }
                var paragraphIndexMatch = bubble.id.match(/(\d+)/);
                if (paragraphIndexMatch === null) {
                    console.log('Could not find parent paragraph element from selection')
                    return
                }
                this.paragraphIndex = parseInt(paragraphIndexMatch[0]);
                this.nodeIndex = Array.prototype.indexOf.call(parentNode.childNodes, textNode);
                this.charIndex = offset;

                var bookmarkId = 'p' + this.paragraphIndex + 'n' + this.nodeIndex + 'c' + this.charIndex;
                var fragment = this.createBookmarkFromTextNode(textNode, this.paragraphIndex, this.nodeIndex, this.charIndex);
                location.hash = bookmarkId
                parentNode.replaceChild(fragment, textNode);

                this.moveBookmark(bookmarkId);
                selObj.removeAllRanges();

            }
        }
    },

    computed: {
        bookmarkPos(): Object {
            return {
                color: this.pxPosition + 'px'
            }
        },
        bookmarkId(): string {
            return 'p' + this.paragraphIndex + 'n' + this.nodeIndex + 'c' + this.charIndex
        }
    },

    mounted() {
        var self = this
        if (location.hash) {
            var indices = location.hash.match(/^#p(\d+)n(\d+)c(\d+)$/)
            if (indices) {
                this.paragraphIndex = parseInt(indices[1]);
                this.nodeIndex = parseInt(indices[2]);
                this.charIndex = parseInt(indices[3]);
                var bookmarkId = 'BookParagraph-' + this.paragraphIndex
                var bookmarkedParagraph = document.getElementById(bookmarkId);
                if (bookmarkedParagraph === null) {
                    console.log('Count not find element with Id' + bookmarkId)
                    return
                }
                var bookmarkedNode = bookmarkedParagraph.childNodes[this.nodeIndex];
                if (bookmarkedNode === null) {
                    console.log('Invalid bookmark location')
                    return
                }
                var fragment = this.createBookmarkFromTextNode(bookmarkedNode, this.paragraphIndex, this.nodeIndex, this.charIndex);
                bookmarkedNode.replaceWith(fragment);
            }
            this.moveBookmark();
        }
        window.addEventListener('keydown', function(e) {
            if (e.code === 'Space' || e.code === ' ') {
                self.bookmark()
            }
        });
        this.resetHash();
    }
    
});
</script>

<style scoped>
.bookmark {
    margin-top: -9vh;
    color: rgb(255, 255, 255);
    padding: 1vh;
    height:7vh;
    position: absolute;
    pointer-events: none;
    font-size: 5vh;
    width: 3px;
    background-color:rgb(45, 82, 185);
}
</style>