<template>
  <div class="editor">
    <codemirror
      ref="cm"
      v-model="editorText"
      :hidden="!editorVisible"
      :options="editorOptions"
      @blur="ToggleMdState"
      @focus="onCmFocus"
      @ready="onCmReady"
    />
    <div :hidden="editorVisible" id="renderContainer">
      <VueShowdown :extensions="[enableCheckBoxExt]" :markdown="editorText"/>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { codemirror } from "vue-codemirror";
import {writeFile} from "fs";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/gfm/gfm.js";
import "codemirror/addon/edit/continuelist.js";
import VueShowdown from "vue-showdown";
import "../utility/Extensions.ts";

var myext2 = {
  type: "lang",
  regex: /markdown/g,
  replace: "showdown"
};
Vue.use(VueShowdown, {
  flavor: "github",
  options: {
    emoji: true,
    tasklists: true
  }
});
@Component({
  components: {
    codemirror
  }
})
export default class CodeMirrorEditor extends Vue {
  private internalEditor;
  private saveWatcher;
  private readonly editorOptions = {
    lineNumbers: false,
    mode: {
      name: "gfm",
      tokenTypeOverrides: {
        emoji: true,
        taskLists: true,
        strikethrough: true,
        gitHubSpice: true
      }
    },
    extraKeys: { Enter: "newlineAndIndentContinueMarkdownList" }
  };
  private editorVisible = false;
  private enableCheckBoxExt = () => {
    var c = 0;
    return [
      {
        type: "lang",
        regex: /$/g,
        replace: () => {
          c = 0;
          return "";
        }
      },
      {
        type: "output",
        regex: /disabled/gm,
        replace: (match, $1) => {
          return `id="checkbox-${c++}"`;
        }
      }
    ];
  };

  public get editorText() {
    return this.$store.getters.Note.content;
  }
  
  public set editorText(text) {
    this.$store.commit("ChangeNoteText", text); 
  }

  destroyed() {
    document.removeChild(document.getElementsByClassName("CodeMirror")[0])
    this.internalEditor = null;
    clearInterval(this.saveWatcher);
  }

  private Save(handler: ((err: Error) => void)) {
    writeFile(this.$store.getters.NotePath, this.internalEditor.getValue(), handler);
  }

  private StartSaveWatch() {
    if (this.saveWatcher) clearInterval(this.saveWatcher);
    this.saveWatcher = setInterval(_ => {
      if (this.internalEditor !== null && !this.internalEditor.doc.isClean()){
        this.$store.dispatch("SaveNote");
        this.internalEditor.doc.markClean();
      }
    }, 5000);
  }

  onCmReady(cm) {
    this.internalEditor = cm;
  }

  mounted() {
    document.addEventListener("click",
      e => {
        var target = <any>e.target;
        if(target.isEqualOrDescendantById("renderContainer")){
          if (target.type == "checkbox") {         
            var i = -1;
            this.editorText = this.editorText.replace(/\[[\sxX]\]/g, match => {
                i++;
                return i == target.id.replace("checkbox-","") ? 
                  match.replace(/\[[\sxX]\]/g, target.checked ? "[x]" : "[ ]") : match;
            });
          }
          else{
            this.ToggleMdState();
          }
        }
      },
      false
    );
    this.StartSaveWatch()
    this.$root.$on("closing", _ =>{
      this.$store.dispatch("SaveNote");
      this.$emit("finished");
    })
    this.$store.dispatch("LoadNote",this.$store.getters.Config.defaultNote);
    require('electron').remote.ipcMain.on("FocusEditor",_=>{
        this.editorVisible = true;
        this.focusEditor();
    })
  }



  public onCmFocus() {
    this.internalEditor.doc.setValue(this.internalEditor.doc.getValue() || "# Title");
    this.internalEditor.setCursor(this.internalEditor.lineCount(), 0);
  }

  public ToggleMdState() {
    this.editorVisible = !this.editorVisible;
    if (this.editorVisible) {
        this.focusEditor();
    }
  }

  private focusEditor(){
      setTimeout(() => {
        this.internalEditor.focus();
      }, 100);
  }
}
</script>