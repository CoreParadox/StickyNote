<template>
  <div id="home">
    <NavBar>
      <router-link slot="controls" :to="'settings'">
        <a>
          <i class="fas fa-cog"></i>
        </a>
      </router-link>
      <input v-on:change="updateFileName" v-model="fileName" type="text" name="fileName">
      <select
        v-if="notepad"
        v-on:change="changeFile"
        v-model="SelectedFile"
        id="filePicker"
        style="margin-left:20px;"
        name="selectedFile"
      >
        <option
          v-for="file in Files()"
          :value="file.value"
          :key="file.id"
          :id="file.id"
        >{{ file.value }}</option>
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
import { Component, Vue } from "vue-property-decorator";
import Editor from "@/components/Editor.vue"; // @ is an alias to /src
import NavBar from "@/components/NavBar.vue";
import { unlink, writeFile, readdirSync } from "fs";
import * as path from "path";
import Notepad from "@/utility/Notes";
import Configuration from "@/utility/Configuration";


@Component({
  components: {
    Editor,
    NavBar
  }
})
export default class Home extends Vue {
  private fileName: string = "";
  private SelectedFile = "";
  private notepad:Notepad = null;

  private configuration = new Configuration();


  Files() {
    var files = [{id:0,value:"unloaded"}]
        files = this.notepad.notes.map((v,i) =>{
            console.log(v.name);
            return { id: i, value: v.name };
        });
    return files;
  }

  public destroyed(){
    this.notepad.destroy();
  }

  public mounted() {
    Configuration.getConfig().then(c=>{
      this.configuration = c;
      this.notepad = new Notepad(c.notePath);
      this.notepad.LoadNotesSync();
    })
    
  }

  updateFileName() {
    this.$root.$emit("fileNameUpdated", this.fileName || "");
  }

  changeFile() {
    this.$root.$emit("fileChange", this.SelectedFile || "");
  }

  newNote(callback?) {
    this.notepad.CreateNote(n=>{
        this.setFileName(n.name);
        this.changeFile();
        this.configuration.defaultNote = n.name;
        this.configuration.saveConfig();
        if (callback) callback(n);
    });
  }

  deleteNote() {
    confirm(`This will permantly delete "${this.SelectedFile}". Continue?`);
    this.notepad.DeleteNote(this.SelectedFile, n=>{
          this.setFileName(n.name);
          this.changeFile();
    });
  }

  setFileName(fileName) {
    var rawFileName = fileName.replace(/.md$/, "");
    this.SelectedFile = rawFileName + ".md";
    this.fileName = rawFileName;
  }

  handleClose() {
    require("electron").remote.getCurrentWindow().close();
  }
}
</script>
