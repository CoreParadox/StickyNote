import Note from "./Note";
import { readdir,readdirSync, unlink, writeFile} from 'fs-extra';
import {FSWatcher,watch} from "chokidar"
import * as path from "path";
import { EventEmitter } from 'events';
const defaultNoteText =
  "# Welcome to your new note!\nLet's write something awesome.";
export default class Notepad extends EventEmitter{
    public readonly notes:Array<Note> = [];
    private watcher: FSWatcher;
    public notesPath: string;
    public readonly id;
    public constructor(notesPath)
    {
        super();
        this.id = new Date().getTime()
        this.notesPath=notesPath;
        var glob = path.join(this.notesPath,"*.md").split("\\").join("/");
        console.log(glob)
        this.watcher = watch(glob);
        this.watcher.on("add", p => {
            console.log("added "+p)
            this.AddNote(new Note(p))
        });
        this.watcher.on("unlink", p => {
            console.log("removed "+p)
            this.RemoveNote(p)
        });
        this.watcher.on("change", async p => { 
            console.log("changed "+p)
            var n = await this.GetNote(p) 
            n.getContents();
        });
    }

    public destroy(){
        this.watcher.removeAllListeners();
    }

    async LoadNotes(){
        await readdir(this.notesPath).then(f =>this.loadAll(f));

    }

    LoadNotesSync(){
        var files = readdirSync(this.notesPath);
        this.loadAll(files);
    }
    private loadAll(f){
        f.filter(f => path.extname(f).toLowerCase() == "md").map(f => {
            var n = new Note(f)
            n.getContents();  
            this.AddNote(n);
        })
    }

    // private emit(event: string | symbol, ...args: any[]){
    //     this.emitter.emit(event,args)
    // }

    // on(event: string | symbol, listener: (...args: any[]) => void){
    //     this.emitter.on(event,listener);
    // }

    AddNote(note:Note){
        note.getContents();
        this.notes.push(note);
    }

    GetNote(path:string){
        return this.notes.find(n => n.path == path);
    }

    DeleteNote(note:Note|string, callback:(note:Note)=>any){
        var notePath = note instanceof Note ? note.path : note;
        this.RemoveNote(notePath);
        console.log(this.notes);
        unlink(path.join(this.notesPath, notePath), _ => {
            if (this.notes.length != 0) {
                callback(this.notes[0])
            }else{
                console.log("creating new")
                this.CreateNote(c => callback(c));
            }
        });
    }
    
    CreateNote(callback:(note:Note)=>any){
        let FileName = `${Date.now()}.md`;
        writeFile(
          path.join(this.notesPath, FileName),
          defaultNoteText,
          "",
          c => {
            var note = new Note(FileName);
            note.getContents()
            this.AddNote(note);
            callback(note);
          }
        );
    }
    
    RemoveNote(note:Note|string){
        var notePath = note instanceof Note ? note.path : note;
        this.notes.splice(this.notes.findIndex(n => path.parse(n.path).toString().toLowerCase() === path.normalize(notePath).toString().toLowerCase()), 1)
    }

    async LoadNote(name:string){
        var note = new Note(path.join());
        note.getContents()
        this.notes.push(note);
    }
}
