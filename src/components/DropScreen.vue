<template>
    <div class="drop-wrapper"
    @dragover.stop.prevent="onFileDragover"
    @dragleage.stop.prevent="onFileDragleave"
    @drop.stop.prevent="onFileDrop"
    >
    <div class="welcome-wrapper">
        <h1 v-if="!isLoaded" class="welcome">Drag and drop unzipped Aozora Bunko text file</h1>
    </div>
    <TheBook v-if="isLoaded"/>
    </div>
</template>

<script lang="ts">
import TheBook from './TheBook.vue'
import Vue from 'vue'
export default Vue.extend({
    name: 'DropScreen',
    components: {
        TheBook
    },

    data: function() {
        return {
            isDraggingFile: false,
            bookBytes: new ArrayBuffer(0),
        }
    },

    computed: {
        isLoaded() { return this.$store.getters['book/isLoaded']},
    },

    methods: {
        onFileDragover: function() {
            this.isDraggingFile = true;
        },
        onFileDragleave: function() {
            this.isDraggingFile = false;
        },
        onFileDrop: function(e :DragEvent) {
            this.isDraggingFile = false;
            for (var i = 0; i < e.dataTransfer.files.length; i++) {
                var file = e.dataTransfer.files[i];
                this.$store.dispatch({
                    type: 'book/loadFromFile',
                    file: file,
                    encoding: 'shift-jis',
                })
            }
        },
    }
});
</script>

<style scoped>
.welcome {
    text-align:center;
    width:100%
}

.welcome-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    position:absolute;
}

.drop-wrapper {
    background-color:rgb(241, 237, 212);
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    position:absolute;
}

img {
    width: 100px;
    height: 100px;
}
</style>