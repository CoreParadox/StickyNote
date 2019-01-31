<template>
  <div id="NavBar">
    <a v-on:click="close()"><i class="fas fa-window-close"></i></a>
    <!-- <a v-on:click="restore()"><i class="fas fa-window-restore"></i></a> -->
    <a v-on:click="minimize()"><i class="fas fa-minus-square"></i></a>
    <a v-on:click="pin()"><i class="fas fa-thumbtack"></i></a>
    <input v-on:change="updateFileName" v-model="fileName" type="text" name="fileName">
    <select
      v-on:change="changeFile"
      v-model="SelectedFile"
      id="filePicker"
      style="margin-left:20px;"
      name="selectedFile"
    >
      <option v-for="file in Files()" :value="file.value" :key="file.id" :id=file.id >{{ file.value }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as fs from "fs";
@Component
export default class NavBar extends Vue {
  private fileName: string = "";
  private SelectedFile = "";
  private isMaximized = false;
  updateFileName() {
      this.$root.$emit("fileNameUpdated", this.fileName);
  }
  changeFile() {
    this.$root.$emit("fileChange", this.SelectedFile);
  }
  mounted() {
    this.registerEvents();
  }
  
  private registerEvents() {
    this.$root.$on("fileLoaded", (f: string) => {
      this.fileName = f;
      this.SelectedFile = this.fileName + ".md";
    });
  }

  Files(){
    return fs.readdirSync("notes").map((v, i) =>{ return { id: i, value: v }});
  }
  // private readNotes(callback?){
  //   fs.readdir("notes", (e, f) => {
  //     this.Files = f.map((v, i) => {
  //       return { id: i, value: v };
  //     });
  //     callback()
  //   });
  // }

  close() {
    this.$root.$emit("closing");
  }

  pin(){
    const remote = require('electron').remote;
    let w = remote.getCurrentWindow();
    w.setAlwaysOnTop(!w.isAlwaysOnTop())
  }
  restore(){
    const remote = require('electron').remote;
    let w = remote.getCurrentWindow();
    this.isMaximized ? w.unmaximize() : w.maximize();
    this.isMaximized = !this.isMaximized;
  }

  minimize(){
    const remote = require('electron').remote;
    let w = remote.getCurrentWindow();
    w.minimize();
  }
}
</script>
