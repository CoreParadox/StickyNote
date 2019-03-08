<template>
  <div id="NavBar">
    <div id="controls">
      <span>
      <a v-on:click="close()">
        <i class="fas fa-window-close"></i>
      </a>
      </span>
      
      <!-- <a v-on:click="restore()"><i class="fas fa-window-restore"></i></a> -->
      <span>
      <a v-on:click="minimize()">
        <i class="fas fa-minus-square"></i>
      </a>
      </span>

      <span>
      <a v-on:click="pin()">
        <i class="fas fa-thumbtack"></i>
      </a>
      </span>
      <slot name="controls"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
const remote = require("electron").remote;

@Component
export default class NavBar extends Vue {
  private isMaximized = false;

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
    //this.$root.$emit("closing");
    remote.getCurrentWindow().close();
  }
}
</script>
