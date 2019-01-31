<template>
<div id="home">
    <NavBar></NavBar>
    <Editor v-on:finished="handleClose()"></Editor>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Editor from '@/components/Editor.vue'; // @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

@Component({
  components: {
    Editor,
    NavBar
  }
})
export default class Home extends Vue {
  handleClose(){
    console.log("Closing");
    const remote = require('electron').remote;
    let w = remote.getCurrentWindow();
    w.close();
  }
}
</script>
