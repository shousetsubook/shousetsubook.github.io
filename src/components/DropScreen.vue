<template>
    <div class="drop-wrapper"
    @dragover.stop.prevent="onFileDragover"
    @dragleage.stop.prevent="onFileDragleave"
    @drop.stop.prevent="onFileDrop"
    >
    <div class="welcome-wrapper">
        <h1 v-if="!isLoaded" class="welcome">{{message}}</h1>
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

    data() {
        return {
            isDraggingFile: false,
            message:"Drag and drop unzipped Aozora Bunko text file",
        }
    },

    computed: {
        isLoaded() { return this.$store.getters['book/isLoaded']},
    },

    methods: {
        onFileDragover() {
            this.isDraggingFile = true;
        },
        onFileDragleave() {
            this.isDraggingFile = false;
        },
        onFileDrop(e :DragEvent) {
            this.isDraggingFile = false;
            this.message = "loading"
            if (e.dataTransfer) {
                for (var i = 0; i < e.dataTransfer.files.length; i++) {
                    var file = e.dataTransfer.files[i];
                    this.$store.dispatch({
                        type: 'book/loadFromFile',
                        file: file,
                        encoding: 'shift-jis',
                    })
                }
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