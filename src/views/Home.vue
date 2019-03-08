<template>
  <div id="home">
    <NavBar>
      <router-link slot="controls" :to="'settings'">
        <a>
          <i class="fas fa-cog"></i>
        </a>
      </router-link>
      <input v-on:change="RenameFile" type="text" name="fileName" :value="SelectedFile">
      <select
        v-model="SelectedFile"
        id="filePicker"
        name="selectedFile"
      >
        <option
          v-for="file in Files()"
          :value="file"
          :key="file"
          :id="file"
        >{{ file }}</option>
      </select>
      <span>
      <a v-on:click="newNote()">
        <i class="fas fa-file-medical"></i>
      </a>
      </span>
      <span>
      <a v-on:click="deleteNote()">
        <i class="fas fa-trash"></i>
      </a>
      </span>
    </NavBar>
    <CodeMirrorEditor v-on:finished="handleClose()" v-on:fileLoaded="setFileName"></CodeMirrorEditor>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
//import Editor from "@/components/Editor.vue"; // @ is an alias to /src
import CodeMirrorEditor from "@/components/CodeMirrorEditor.vue";
import NavBar from "@/components/NavBar.vue";
import { unlink, writeFile, readdirSync } from "fs";
import * as path from "path";
import Configuration from "@/utility/Configuration";

@Component({
  components: {
    CodeMirrorEditor,
    NavBar
  }
})
export default class Home extends Vue {
  private fileName: string = this.$store.getters.Note.name;
  private configuration = this.$store.getters.Config;
  
  Files(){
    return this.$store.getters.Files();
  }
  
  set SelectedFile(value){
    this.changeFile(value);
  }
  
  get SelectedFile(){
    return this.$store.getters.Note.name;
  }

  RenameFile(e) {
    var val = e.target.value.replace(".md","");
    this.$store.dispatch("RenameNote", val);
  }

  changeFile(value) {
    this.$store.dispatch("LoadNote", value);
  }

  newNote() {
    this.$store.dispatch("NewNote");
  }

  deleteNote() {
    var shouldDelete = confirm(`This will permantly delete "${this.SelectedFile}". Continue?`);
    if(shouldDelete){
      this.$store.dispatch("DeleteNote");
      this.SelectedFile = this.$store.getters.Note.name;
    }
  }

  setFileName(fileName) {
    var rawFileName = fileName.replace(/.md$/, "");
    this.fileName = rawFileName;
  }

  handleClose() {
    require("electron")
      .remote.getCurrentWindow()
      .close();
  }
}
</script>
