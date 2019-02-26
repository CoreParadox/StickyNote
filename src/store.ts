import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { readdirSync, readdir, stat, readFileSync, writeFile, writeFileSync, unlink, unlinkSync } from 'fs-extra';
import * as path from 'path';
import Configuration from './utility/Configuration';
import { renameSync } from 'fs';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config:Configuration.getConfig(),
    files:[],
    note:{
      name:"",
      content:""
    }
  },
  getters:{
    Files: (_,getters) => () => { 
      return readdirSync(getters.Config.notePath);
    },
    Config: state => {
      if(!state.config) state.config = Configuration.getConfig()
      return state.config
    },
    NotePath: state => path.join(state.config.notePath,state.note.name),
    Note: (state,getters) => {
      return {
        path: getters.NotePath,
        name:state.note.name,
        content:state.note.content,
      }
    }
  },
  mutations: {
    ChangeNoteText: (state, content) => state.note.content = content,
    ChangeNoteName: (state, NoteName) => state.note.name = NoteName
  },
  actions: {
    SaveNote: (state, content) =>{
      state.commit("ChangeNoteText", content);
      writeFileSync(state.getters.NotePath, content);
    },
    RenameNote: (state, name) =>{
      console.log(name);
      renameSync(state.getters.NotePath, path.join(state.getters.Config.notePath,name+".md"));
      state.commit("ChangeNoteName", name+".md");
    },
    LoadNote: (state, noteName) => {
      state.commit("ChangeNoteName", noteName);
      var content =  readFileSync(state.getters.NotePath, { encoding: "utf8" });
      state.commit("ChangeNoteText", content); 
    },
    NewNote: (state) => {
      state.commit("ChangeNoteName", `${Date.now()}.md`);
      writeFileSync(state.getters.NotePath, "# Welcome to your new note!\nLet's write something awesome.", {encoding:"utf8"})
      state.commit("ChangeNoteText", "# Welcome to your new note!\nLet's write something awesome."); 
    },
    DeleteNote: (state) => {
      console.log(state.getters.NotePath)
      unlink(state.getters.NotePath, _ => {
        if (state.getters.Files().length != 0) {
          state.dispatch("LoadNote", state.getters.Files()[0]);
        }
      });
    }
  }
})
