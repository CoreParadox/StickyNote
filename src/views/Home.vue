<template>
  <div id="home">
    <NavBar>
      <router-link slot="controls" :to="'settings'">
        <a>
          <i class="fas fa-cog"></i>
        </a>
      </router-link>
      <input v-on:change="updateFileName" v-model="$store.getters.Note.name" type="text" name="fileName">
      <select
        v-on:change="changeFile"
        v-model="SelectedFile"
        id="filePicker"
        style="margin-left:20px;"
        name="selectedFile"
      >
        <option
          v-for="file in Files()"
          :value="file"
          :key="file"
          :id="file"
        >{{ file }}</option>
      </select>
      <a v-on:click="newNote()">
        <i class="fas fa-file-medical"></i>
      </a>
      <a v-on:click="deleteNote()">
        <i class="fas fa-trash"></i>
      </a>
    </NavBar>
    <Editor v-on:finished="handleClose()" v-on:fileLoaded="setFileName"></Editor>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Editor from "@/components/Editor.vue"; // @ is an alias to /src
import NavBar from "@/components/NavBar.vue";
import { unlink, writeFile, readdirSync } from "fs";
import * as path from "path";
import Configuration from "@/utility/Configuration";

@Component({
  components: {
    Editor,
    NavBar
  }
})
export default class Home extends Vue {
  private fileName: string = this.$store.getters.Note.name;
  private SelectedFile = this.$store.getters.Note.name;
  private configuration = this.$store.getters.Config;
  
  Files(){
    console.log("Getting List");
    return this.$store.getters.Files()
  }

  updateFileName() {
    this.$store.dispatch("LoadNote", this.fileName || "");
  }

  changeFile() {
    this.$store.dispatch("LoadNote", this.SelectedFile || "");
  }

  newNote() {
    this.$store.dispatch("NewNote");
  }

  deleteNote() {
    confirm(`This will permantly delete "${this.SelectedFile}". Continue?`);
    this.$store.dispatch("DeleteNote");
    this.SelectedFile = this.$store.getters.Note.name;
  }

  setFileName(fileName) {
    var rawFileName = fileName.replace(/.md$/, "");
    this.SelectedFile = rawFileName + ".md";
    this.fileName = rawFileName;
  }

  handleClose() {
    require("electron")
      .remote.getCurrentWindow()
      .close();
  }
}
</script>
