<template>
  <div class="editor">
    <textarea id="input-area" style="display:none;"></textarea>
  </div>
</template>

<script lang="ts">
const HyperMD = require("hypermd");
import { readFile, writeFile, rename, exists, mkdir } from "fs";
import { clearInterval } from "timers";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as path from "path";
import "hypermd/theme/hypermd-light.css";
import "@/theme/sticky.css";
import Configuration from "@/utility/Configuration";

@Component
export default class Editor extends Vue {
  private internalEditor: any;
  private saveWatcher: any;
  private config = this.$store.getters.Config
  private filePath = () => this.$store.getters.NotePath

  destroyed() {
    document.removeChild(document.getElementsByClassName("CodeMirror")[0])
    this.internalEditor = null;
    clearInterval(this.saveWatcher);
  }
  
  @Watch('$store.getters.Note', {deep:true})
  NoteUpdate(){
    this.configureEditor( this.$store.getters.Note.content);
  }

  //TODO: Update store note.content after save.
  private Save(handler: ((err: Error) => void)) {
    writeFile(this.$store.getters.NotePath, this.internalEditor.getValue(), handler);
  }

  private StartSaveWatch() {
    if (this.saveWatcher) clearInterval(this.saveWatcher);
    this.saveWatcher = setInterval(_ => {
      if (this.internalEditor !== null && !this.internalEditor.isClean())
        this.Save(_ => this.internalEditor.markClean());
    }, 5000);
  }

  private configureEditor(defaultValue = "") {
    if(!this.internalEditor) this.internalEditor = HyperMD.fromTextArea(document.getElementById("input-area"),this.config.editorConfig);
    this.internalEditor.setValue(defaultValue.toString());
    this.internalEditor.markClean();
    this.StartSaveWatch();
  }
}
</script>

