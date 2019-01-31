<template>
  <div id="NavBar">
    <div id="controls">
      <a v-on:click="close()"><i class="fas fa-window-close"></i></a>
      <!-- <a v-on:click="restore()"><i class="fas fa-window-restore"></i></a> -->
      <a v-on:click="minimize()"><i class="fas fa-minus-square"></i></a>
      <a v-on:click="pin()"><i class="fas fa-thumbtack"></i></a>
    </div>
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
    <a v-on:click="newNote()"><i class="fas fa-file-medical"></i></a>
    <a v-on:click="deleteNote()"><i class="fas fa-trash"></i></a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as fs from "fs";
import * as path from "path";
import Configuration from '@/utility/Configuration';
const remote = require('electron').remote;

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
    this.isMaximized ? remote.getCurrentWindow().unmaximize() : remote.getCurrentWindow().maximize();
    this.isMaximized = !this.isMaximized;
  }

  minimize(){
    remote.getCurrentWindow().minimize();
  }
  

  newNote(){
    let FileName = `${Date.now()}.md`
    fs.writeFile(path.join(new Configuration().notePath,FileName),"# Welcome to your new note!\nLet's write something awesome.","",_=>{
      this.SelectedFile = FileName;
      this.fileName = FileName;
      this.$root.$emit("fileChange", this.SelectedFile);
    });
  }

  deleteNote(){
    confirm(`This will permantly delete "${this.SelectedFile}". Continue?`);
    fs.unlink(path.join(new Configuration().notePath,this.SelectedFile), _ =>{
      this.SelectedFile = this.Files()[0].value;
      this.fileName = this.Files()[0].value;
      this.changeFile();
    });
  }
}
</script>
