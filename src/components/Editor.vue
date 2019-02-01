<template>
  <div class="editor">
    <textarea id="input-area" style="display:none;"></textarea>
  </div>
</template>

<script lang="ts">
const HyperMD = require("hypermd");
import { readFile, writeFile, rename, exists, mkdir } from "fs";
import { clearInterval } from "timers";
import { Component, Prop, Vue } from "vue-property-decorator";
import * as path from "path";
import "hypermd/theme/hypermd-light.css";
import "@/theme/sticky.css";
import Configuration from "@/utility/Configuration";
import VueEmitter from "@/utility/VueEmitter"

@Component
export default class Editor extends VueEmitter {
  private internalEditor: any;
  private saveWatcher: any;
  private config:Configuration;
  private file;

  private filePath() {
    return path.join(this.config.notePath, this.file);
  }

  mounted() {
    Configuration.getConfig()
      .then(c => {
        this.config = c;
        this.loadFile(c.defaultNote);
        this.registerEvents();
      }).catch(console.log);
  }

  loadFile(file) {
    this.file = file;
    readFile(this.filePath(), { encoding: "utf8" }, (e: any, d: any) => {
      this.emitFileLoaded();
      this.configureEditor(d);
    });
    
  }

  emitFileLoaded() {
    this.rootEmit("fileLoaded", path.parse(this.filePath()).name);
  }

  registerEvents() {
    this.registerRootEvent("fileNameUpdated", f => {
      rename(
        this.filePath(),
        path.join(path.parse(this.filePath()).dir, f + ".md"),
        (e: Error) => {
          this.file = f + ".md";
          this.emitFileLoaded();
        }
      );
    });
    this.registerRootEvent("fileChange", this.loadFile);
    this.registerRootEvent("closing",  _ => this.Save(_ => this.$emit("finished")));
  }



  registerRootEvent(eventName, callback) {
    this.$root.$on(eventName, callback);
  }

  destroyed() {
    this.internalEditor = null;
    clearInterval(this.saveWatcher);
  }

  private Save(handler: ((err: Error) => void)) {
    writeFile(this.filePath(), this.internalEditor.getValue(), handler);
  }

  private StartSaveWatch() {
    if (this.saveWatcher) clearInterval(this.saveWatcher);
    this.saveWatcher = setInterval(_ => {
      if (!this.internalEditor.isClean())
        this.Save(_ => this.internalEditor.markClean());
    }, 5000);
  }

  private configureEditor(defaultValue) {
    if(!this.internalEditor) this.internalEditor = HyperMD.fromTextArea(document.getElementById("input-area"),this.config.editorConfig);
    this.internalEditor.setValue(defaultValue.toString());
    this.internalEditor.markClean();
    this.StartSaveWatch();
  }
}
</script>

