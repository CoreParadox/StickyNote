<template>
<div id="settings">
      <NavBar> <router-link slot="controls" :to="'/'"><a><i class="fas fa-sticky-note"></i></a></router-link></NavBar>

  <div id="container">
    <form>
      <div>
        <label for="notePath" class="btn" >Select Note Path:</label><span style="margin-left:5px;">"{{config.notePath}}"</span>
        <input id="notePath" ref="notePath" v-on:change="noteDirChange" webkitdirectory style="visibility:hidden;" type="file">
      </div>
      <label for="defaultNote">Default Note:</label>
          <select
      v-on:change="propChange"
      v-model="config.defaultNote"
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
    <br/>
    <label for="lineNumbers">Line Numbers:
    <input type="checkbox" id="lineNumbers" v-on:change="propChange" v-model="config.editorConfig.lineNumbers"/>
    </label>
    <br/>
    <label for="tabSize" >Tab Size:
    <input type="number" min="1" max="9" id="tabSize" v-on:change="propChange" v-model="config.editorConfig.tabSize"/>
    </label>
    <br/>
    <label for="theme" >Theme name:
    <input type="text" id="theme" v-on:change="propChange" v-model="config.editorConfig.theme"/>
    </label>
    <br/>
    <label for="mode">Mode Name:
      <input type="text" id="mode" v-on:change="propChange" v-model="config.editorConfig.mode.name"/>
    </label>
    <br/>
    <label for="hashtag">Hashtag:
        <input type="checkbox" id="hashtag" v-on:change="propChange" v-model="config.editorConfig.mode.hashtag"/>
    </label>
    </form>
</div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavBar from '@/components/NavBar.vue'
import Configuration from '@/utility/Configuration';
import {readdirSync} from "fs"
@Component({
  components: {
    NavBar
  }
})
export default class Settings extends Vue {
  private config:Configuration = new Configuration();

  Files() {
    return readdirSync(this.config.notePath).map((v, i) => {
      return { id: i, value: v };
    });
  }

  mounted(){
    Configuration.getConfig().then(c =>{
      this.config = c;
    })
  }
  propChange(){
    this.config.saveConfig();
  }

  noteDirChange(e){
    this.config.notePath = (<any>this.$refs.notePath).files[0].path;
    this.propChange();
  }
}
</script>
