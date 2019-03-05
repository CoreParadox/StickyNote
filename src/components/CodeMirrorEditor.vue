<template>
  <div class="editor">
    <editor
    :value="editorText"
    :options="editorOptions"
    :html="editorHtml"
    :visible="editorVisible"
    height="500px"
    mode="markdown"
    previewStyle="vertical"
    />
  </div>
</template>
<script lang="ts">
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component({
    components: {
        codemirror
    }
})
export default class TuiEditor extends Vue {
    data() {
        return {
            editorText: 'This is initialValue.',
            editorOptions: {
                hideModeSwitch: true,
                toolbarItems:[]
            },
            editorHtml: '',
            editorVisible: true
        };
    }
    onEditorLoad() {
        console.log("Test");
    }

    onEditorFocus() {
        // implement your code
    }

    onEditorBlur() {
        // implement your code
    }

    onEditorChange() {
        // implement your code
    }

    onEditorStateChange() {
        // implement your code
    }
};
</script>