<template>
  <div id="NavBar">
    <div id="controls">
      <a v-on:click="close()">
        <i class="fas fa-window-close"></i>
      </a>
      <!-- <a v-on:click="restore()"><i class="fas fa-window-restore"></i></a> -->
      <a v-on:click="minimize()">
        <i class="fas fa-minus-square"></i>
      </a>
      <a v-on:click="pin()">
        <i class="fas fa-thumbtack"></i>
      </a>
    </div>
    <input v-on:change="updateFileName" v-model="fileName" type="text" name="fileName">
    <select
      v-on:change="changeFile()"
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {unlink, writeFile, readdirSync} from "fs";
import * as path from "path";
import Configuration from "@/utility/Configuration";
import VueEmitter from "@/utility/VueEmitter";
const remote = require("electron").remote;
const defaultNoteText =
  "# Welcome to your new note!\nLet's write something awesome.";

@Component
export default class NavBar extends VueEmitter {
  private fileName: string = "";
  private SelectedFile = "";
  private isMaximized = false;
  private configuration;

  private Files() {
    return readdirSync("notes").map((v, i) => {
      return { id: i, value: v };
    });
  }

  public mounted() {
    Configuration.getConfig().then(c => {
      this.configuration = c;
      this.registerEvents();
    });
  }

  private updateFileName() {
    this.rootEmit("fileNameUpdated", this.fileName);
  }
  private changeFile() {
    this.rootEmit("fileChange", this.SelectedFile);
  }

  private registerEvents() {
    this.$root.$on("fileLoaded", f => {
      console.log("Test");
      this.fileName = f;
      this.SelectedFile = this.fileName + ".md";
    });
  }

  private restore() {
    this.isMaximized
      ? remote.getCurrentWindow().unmaximize()
      : remote.getCurrentWindow().maximize();
    this.isMaximized = !this.isMaximized;
  }

  private pin() {
    remote
      .getCurrentWindow()
      .setAlwaysOnTop(!remote.getCurrentWindow().isAlwaysOnTop());
  }

  private minimize() {
    remote.getCurrentWindow().minimize();
  }

  private close() {
    this.rootEmit("closing");
  }

  private newNote() {
    let FileName = `${Date.now()}.md`;
    writeFile(
      path.join(new Configuration().notePath, FileName),
      defaultNoteText,
      "",
      _ => {
        this.setFileName(FileName);
      }
    );
  }

  private deleteNote() {
    confirm(`This will permantly delete "${this.SelectedFile}". Continue?`);
    unlink(path.join(this.configuration.notePath, this.SelectedFile), _ =>
      this.setFileName(this.Files()[0].value)
    );
  }

  private setFileName(fileName) {
    this.SelectedFile = fileName;
    this.fileName = fileName.replace(/.md$/, "");
    this.changeFile();
  }
}
</script>
