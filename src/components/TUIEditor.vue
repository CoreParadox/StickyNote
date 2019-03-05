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
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import { Editor } from '@toast-ui/vue-editor';
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component({
    components: {
        'editor': Editor
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