<template>
    <div id="NavBar">
      <a v-on:click="close()">X</a> 
      <a href="/css/">O</a>
      <a href="/html/">-</a>
      <input v-on:change="updateFileName" v-model="fileName" type="text" name="fileName">
      <select v-on:change="changeFile" v-model="SelectedFile" id="filePicker" style="margin-left:20px;" name="selectedFile">
        <option v-for="file in Files" :key="file.id" >{{ file.value }}</option>
      </select>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as fs from "fs";
@Component
export default class NavBar extends Vue {
    private fileName:string="";
    private Files={};
    private SelectedFile=""
    updateFileName(){
      this.$root.$emit("fileNameUpdated", this.fileName)
    }
    changeFile(){
      this.$root.$emit("fileChange", this.SelectedFile)
    }
    mounted(){
      this.$root.$on("fileLoaded", (f:string)=>{
        console.log("loadedFile")
        this.fileName = f;
        fs.readdir("notes",(e,f)=>{
          console.log(f);
          this.Files = f.map((v,i) => {
            return {id:i, value:v};
          });
          this.SelectedFile = f+".md"
        });
      })
    }

    close(){
        this.$root.$emit("closing")
    }
}
</script>
