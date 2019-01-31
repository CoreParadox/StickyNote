<template>
  <div class="editor">
    <textarea id="input-area" style="display:none;"></textarea>
  </div>
</template>

<script lang="ts">
const HyperMD = require("hypermd");
import { readFile, writeFile, rename } from "fs";
import * as path from "path";
import { Component, Prop, Vue } from "vue-property-decorator";
import "hypermd/theme/hypermd-light.css";
import "@/theme/sticky.css";
import Configuration from "../utility/Configuration";
import { clearInterval } from "timers";

@Component
export default class Editor extends Vue {
  private internalEditor: any;
  private saveWatcher: any;
  private config;
  private file;

  private filePath() {
    return path.join(this.config.notePath, this.file);
  }

  mounted() {
    console.log("Mounted");
    Configuration.getConfig()
      .then(c => {
        this.config = c;
        this.loadFile(c.defaultNote);
        this.registerEvents();
      })
      .catch(console.log);
  }

  loadFile(file) {
    console.log("fileName: " + file);
    this.file = file;
    console.log("this.file: " + this.file);
    console.log("this.filePath: " + this.filePath);
    readFile(this.filePath(), { encoding: "utf8" }, (e: any, d: any) => {
      console.log(e);
      this.emitFileLoaded();
      this.configureEditor(d);
    });
  }

  emitFileLoaded() {
    console.log(this.filePath());
    this.$root.$emit("fileLoaded", path.parse(this.filePath()).name);
  }

  registerEvents() {
    this.registerRootEvent("fileNameUpdated", (f: string) => {
      rename(
        this.filePath(),
        path.join(path.parse(this.filePath()).dir, f + ".md"),
        (e: Error) => {
          this.file = f + ".md";
          this.emitFileLoaded();
        }
      );
    });
    this.registerRootEvent("fileChange", (f: string) => {
      this.loadFile(f);
    });

    this.registerRootEvent("closing", (_: any) =>
      this.Save(e => {
        this.$emit("finished");
      })
    );
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
    console.log(this.config.editorConfig)
    console.log(defaultValue)
    if (!this.internalEditor) {
      this.internalEditor = HyperMD.fromTextArea(
        document.getElementById("input-area"),
        this.config.editorConfig
      );
    }
    this.internalEditor.setValue(defaultValue.toString());
    this.internalEditor.markClean();
    this.StartSaveWatch();
  }

  private isClean() {
    return this.internalEditor.isClean();
  }
}
</script>

