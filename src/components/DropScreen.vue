<template>
    <div class="drop-wrapper"
    @dragover.stop.prevent="onFileDragover"
    @dragleage.stop.prevent="onFileDragleave"
    @drop.stop.prevent="onFileDrop"
    >
    <div class="welcome-wrapper">
        <h1 v-if="!isLoaded" class="welcome">Drag and drop unzipped Aozora Bunko text file</h1>
    </div>
    <TheBook :bookBytes=bookBytes v-if="isLoaded"/>
    </div>
</template>

<script>
import TheBook from './TheBook.vue'

export default {
    name: 'DropScreen',
    components: {
        TheBook
    },

    data: function() {
        return {
            test: 'Test',
            isDraggingFile: false,
            isLoaded: false,
            bookBytes: new ArrayBuffer(),
        }
    },

    methods: {
        onFileDragover: function() {
            this.isDraggingFile = true;
        },
        onFileDragleave: function() {
            this.isDraggingFile = false;
        },
        onFileDrop: function(e) {
            this.isDraggingFile = false;
            for (var i = 0; i < e.dataTransfer.files.length; i++) {
                var file = e.dataTransfer.files[i];
                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                var self = this;
                reader.onload = function () {
                    self.isLoaded = true
                    self.test = 'File loaded'
                    self.bookBytes = reader.result
                }
            }
        },
    }
}
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