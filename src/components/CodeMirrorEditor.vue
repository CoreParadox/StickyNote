<template>
  <div class="editor">
    <codemirror
      ref="cm"
      v-model="text"
      :hidden="!editorVisible"
      :options="editorOptions"
      @blur="onCmBlur"
      @focus="onCmFocus"
      @ready="onCmReady"
    />
    <div :hidden="editorVisible" id="renderContainer">
      <VueShowdown :extensions="[enableCheckBoxExt]" :markdown="text"/>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/gfm/gfm.js";
import "codemirror/addon/edit/continuelist.js";
import VueShowdown from "vue-showdown";
import { clearTimeout } from "timers";
import { constants } from 'http2';

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
  private cm;
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

  public text = "- [ ] test\n- [ ] test2\nblah blah\n- [ ] test\n- [ ] test2";

  public get editorText() {
    return this.text;
  }
  public set editorText(text) {
    this.text = text;
  }
  private editorVisible = true;

  onCmReady(cm) {
    this.cm = cm;
  }

  mounted() {
    document.addEventListener(
      "click",
      e => {
        var target = <any>e.target;
        if (target.type == "checkbox") {
          var i = -1;
          this.editorText = this.editorText.replace(/\[[\sxX]\]/g, match => {
              i++;
              return i == target.id.replace("checkbox-","") ? 
                match.replace(/\[[\sxX]\]/g, target.checked ? "[x]" : "[ ]") : match;
          });
        }
        else if(!target.className.includes("cm") && !target.className.includes("CodeMirror")){
          console.log(target.className)
          this.onCmBlur();
        }
      },
      false
    );
  }

  onCmFocus() {
    this.cm.setCursor(this.cm.lineCount(), 0);
  }

  onCmBlur() {
    this.editorVisible = !this.editorVisible;
    if (this.editorVisible) {
      var timeout = setTimeout(() => {
        console.log("focused");
        this.cm.focus();
      }, 100);
      clearTimeout(timeout);
    }
  }
}
</script>