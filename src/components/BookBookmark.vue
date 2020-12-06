<template>
<div
    class="bookmark"
    :style="bookmarkPos"
    :id="'bookmark-'+position"
></div>
</template>

<script>
export default {
    name: 'BookBookmark',

    data: function () {
        return {
            position: 0,
        }
    },

    methods: {
        bookmark: function () {
            var selObj = window.getSelection();
            if (selObj.toString()) {
                var range = selObj.getRangeAt(0);
                var textNode = range.startContainer;
                var offset = range.startOffset;
                var bookmarkCharNode = document.createTextNode(textNode.textContent[offset]);
                var sliceUntilBookmark = document.createTextNode(textNode.textContent.slice(0, offset));
                var sliceAfterBookmark = document.createTextNode(textNode.textContent.slice(offset+1));
                var fragment = document.createDocumentFragment();
                var idSpan = document.createElement('span');
                idSpan.id = 'bookmark';
                idSpan.appendChild(bookmarkCharNode);
                idSpan.style.backgroundColor = 'red'
                fragment.appendChild(sliceUntilBookmark);
                fragment.appendChild(idSpan);
                fragment.appendChild(sliceAfterBookmark)

                textNode.parentNode.replaceChild(fragment, textNode)
            }
        }
    },

    computed: {
        bookmarkPos: function () {
            return {
                left: this.position + 'px'
            }
        }
    },

    mounted() {
        var self = this
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