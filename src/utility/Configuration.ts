import { access, writeFile, constants as fsConstants, readFile } from 'fs';
import {join} from "path";
import { remote } from 'electron';
const configPath = join(remote.app.getPath('userData'), "config.json")
const defaultNotePath = join(remote.app.getPath('userData'), "notes")
export default class Configuration {
    public notePath: string = defaultNotePath
    public defaultNote: string = "note.md"
    public editorConfig: EditorConfig = {
        lineNumbers: false,
        tabSize: 2,
        theme: "sticky hypermd-light",
        mode: {
            name: "hypermd",
            hashtag: true
        }
    }

    static getConfig(){
        var stashed = new Configuration()
        return new Promise<Configuration>((r,e) =>{
            access(configPath, fsConstants.F_OK, (err) => {
                if(err) writeFile(configPath,JSON.stringify(stashed,null,"\t"),ex =>{
                    if(ex) e(ex)
                    this.readFile(stashed,r);
                })
                this.readFile(stashed,r);
            });
            
        })
    }
    
    private static readFile(stashed:Configuration, resolve){
        readFile(configPath,(e,b)=>{
            var obj = Object.assign(stashed,JSON.parse(b.toString()));
            resolve(obj);
        })
    }

    saveConfig(callback?){
        //TODO: This is a hack, but vue adds some junk data when binding
        delete (<any>this).data
        delete (<any>this).type
        console.log(JSON.stringify(this,null,"\t"))
        writeFile(configPath,JSON.stringify(this, null, "\t"),(e) => {
            if(callback) callback(e);
            else console.log(e);
        })
    }
}

class EditorConfig {
    public theme: string = "sticky"
    public tabSize: number = 4
    public lineNumbers: boolean = false
    public mode: { name: string, hashtag: boolean } = {
        name: "hypermd",
        hashtag: true
    }
}