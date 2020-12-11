<template>
<div
    class="bookmark"
></div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'BookBookmark',
    
    data: function () {
        return {
            pxPosition: 0,
        }
    },
    
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