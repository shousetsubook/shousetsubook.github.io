<template>
<div
    class="bookmark"
    :style="bookmarkPos"
    :id="'bookmark-'+bookmarkId"
></div>
</template>

<script>
export default {
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
        createBookmarkFromTextNode: function(textNode, paragraphIndex, nodeIndex, charIndex) {
            var sliceUntilBookmark = document.createTextNode(textNode.textContent.slice(0, charIndex));
            var bookmarkCharNode = document.createTextNode(textNode.textContent[charIndex]);
            var sliceAfterBookmark = document.createTextNode(textNode.textContent.slice(charIndex+1));
            console.log(charIndex+1)
            console.log(textNode.textContent.slice(3+1))
            sliceAfterBookmark.textContent = 'しね'
            console.log(sliceAfterBookmark.textContent)
            var fragment = document.createDocumentFragment();
            var newBookmark = document.createElement('span');
            newBookmark.id = 'p' + paragraphIndex + 'n' + nodeIndex + 'c' + charIndex;
            newBookmark.appendChild(bookmarkCharNode);
            newBookmark.style.backgroundColor = 'red'
            fragment.appendChild(sliceUntilBookmark);
            fragment.appendChild(newBookmark);
            fragment.appendChild(sliceAfterBookmark);
            return fragment
        },

        bookmark: function () {
            var selObj = window.getSelection();
            if (selObj.toString() && selObj.getRangeAt(0).startContainer.nodeType === Node.TEXT_NODE) {
                var oldBookmark = document.getElementById(this.bookmarkId)
                if (oldBookmark) {
                    oldBookmark.removeAttribute('id')
                    oldBookmark.removeAttribute('style')
                }
                

                var range = selObj.getRangeAt(0);
                var textNode = range.startContainer;
                var parentNode = textNode.parentNode;
                var offset = range.startOffset;

                // get indexes of bookmark (paragraph, node, character)
                var bubble = textNode.parentElement
                while (!bubble.classList.contains('text-component')) {
                    bubble = bubble.parentElement;
                }
                this.paragraphIndex = parseInt(bubble.id.match(/\d+/));
                this.nodeIndex = Array.prototype.indexOf.call(parentNode.childNodes, textNode);
                this.charIndex = offset;

                var bookmarkId = 'p' + this.paragraphIndex + 'n' + this.nodeIndex + 'c' + this.charIndex;
                var fragment = this.createBookmarkFromTextNode(textNode, this.paragraphIndex, this.nodeIndex, this.charIndex);
                parentNode.replaceChild(fragment, textNode);

                var domRect = document.getElementById(bookmarkId).getBoundingClientRect();

                var bookmarkLeft = domRect.left + window.scrollX;
                this.pxPosition = bookmarkLeft;
                location.hash = bookmarkId

                selObj.removeAllRanges();

            }
        }
    },

    computed: {
        bookmarkPos: function () {
            return {
                left: this.pxPosition + 'px'
            }
        },
        bookmarkId: function() {
            return 'p' + this.paragraphIndex + 'n' + this.nodeIndex + 'c' + this.charIndex
        }
    },

    mounted() {
        var self = this
        if (location.hash) {
            var indices = location.hash.match(/^#p(\d+)n(\d+)c(\d+)$/)
            if (indices) {
                this.paragraphIndex = indices[1];
                this.nodeIndex = indices[2];
                this.charIndex = indices[3];
                var bookmarkedParagraph = document.getElementById('BookParagraph-' + this.paragraphIndex);
                var bookmarkedNode = bookmarkedParagraph.childNodes[this.nodeIndex];
                var fragment = this.createBookmarkFromTextNode(bookmarkedNode, this.paragraphIndex, this.nodeIndex, this.charIndex);
                bookmarkedNode.replaceWith(fragment);
            }
        }
        window.addEventListener('keydown', function(e) {
            if (e.code === 'Space' || e.code === ' ') {
                self.bookmark()
            }
        });
    }
    
}
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