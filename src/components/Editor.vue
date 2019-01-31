<template>
  <div class="editor">
    <textarea id="input-area" style="display:none;"></textarea>
  </div>
</template>

<script lang="ts">
const HyperMD = require("hypermd");
import * as fs from "fs";
import * as path from "path";
import { Component, Prop, Vue } from "vue-property-decorator";
import "hypermd/theme/hypermd-light.css";
import "@/theme/sticky.css";
import { error } from 'util';
import { clearInterval } from 'timers';
const basePath = "notes";
    
@Component
export default class Editor extends Vue {
  private internalEditor: any;
  private saveWatcher: any;
  private file = "note.md";
  private get filePath(){
    return path.join(basePath,this.file);
  } 
  
  mounted() {
    this.loadFile(this.file);
    this.registerEvents();
  }

  loadFile(file){
      console.log(this.file)
      this.file = file;
      fs.readFile(this.filePath,{encoding:"utf8"},(e:any,d:any) =>{
        this.configureEditor(d);
        this.emitFileLoaded();
    })
  }

  emitFileLoaded(){
    this.$root.$emit("fileLoaded", path.parse(this.filePath).name)
  }

  registerEvents(){
    this.$root.$on("fileNameUpdated", (e:string)=>{
      fs.rename(this.filePath, path.join(path.parse(basePath).dir,e+".md"), (e:Error) => console.log(e));
    })
    this.$root.$on("fileChange", (f:string) => this.loadFile(f));
    this.$root.$on("closing", (_:any) => this.Save(e =>{
      this.$emit("finished")
    }));
  }

  destroyed(){
    console.log("Destroying")
    this.internalEditor = null;
    clearInterval(this.saveWatcher);
    console.log("Destroyed")
  }

  private Save(handler:((err:Error) => void)){
    fs.writeFile(this.filePath, this.internalEditor.getValue(), handler);
  }

  private StartSaveWatch(){
    if(this.saveWatcher) clearInterval(this.saveWatcher)
    this.saveWatcher = setInterval((_:any) =>{
      //console.log(`Is Clean:${this.isClean()}`);
      if(!this.internalEditor.isClean()){
        this.Save(e =>{
          console.log(e)
          console.log(`Saved to ${this.filePath}`);
          this.internalEditor.markClean();
        })
      }
    },3000)   
  }

  private configureEditor(defaultValue){
      if(!this.internalEditor){
        var myTextarea = document.getElementById("input-area"); 
        this.internalEditor = HyperMD.fromTextArea(<HTMLTextAreaElement>myTextarea, {
          lineNumbers: false,
          tabSize: 4,
          theme: "sticky hypermd-light",
          mode: {
            name: "hypermd",
            hashtag: true
          },
          
        });
      }
      this.internalEditor.setValue(defaultValue)
      this.internalEditor.markClean(); 
      this.StartSaveWatch()
  }

  private isClean(){
    return this.internalEditor.isClean()
  }
}
</script>

