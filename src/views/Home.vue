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
import Configuration from "@/utility/Configuration";
const defaultNoteText =
  "# Welcome to your new note!\nLet's write something awesome.";

@Component({
  components: {
    Editor,
    NavBar
  }
})
export default class Home extends Vue {
  private fileName: string = "";
  private SelectedFile = "";

  private configuration = new Configuration();

  Files() {
    var files;
    try {
      files = readdirSync(this.configuration.notePath).map((v, i) => {
        return { id: i, value: v };
      });
    }catch (e) {}
    if (files && files.length == 0) {
      this.newNote(c => {
        this.configuration.defaultNote = c;
        this.configuration.saveConfig();
      });
    }
    return files;
  }

  public mounted() {
    Configuration.getConfig().then(c => {
      this.configuration = c;
    });
  }

  updateFileName() {
    this.$root.$emit("fileNameUpdated", this.fileName || "");
  }

  changeFile() {
    this.$root.$emit("fileChange", this.SelectedFile || "");
  }

  newNote(callback?) {
    let FileName = `${Date.now()}.md`;
    writeFile(
      path.join(this.configuration.notePath, FileName),
      defaultNoteText,
      "",
      c => {
        this.setFileName(FileName);
        this.changeFile();
        if (callback) callback(FileName);
      }
    );
  }

  deleteNote() {
    confirm(`This will permantly delete "${this.SelectedFile}". Continue?`);
    unlink(path.join(this.configuration.notePath, this.SelectedFile), _ => {
      if (this.Files().length != 0) {
        this.setFileName(this.Files()[0].value);
        this.changeFile();
      }
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
