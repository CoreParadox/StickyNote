import Vue from 'vue';

export default abstract class VueEmitter extends Vue{
    protected rootEmit(event,param?){
        this.$root.$emit(event, param);
    }
}