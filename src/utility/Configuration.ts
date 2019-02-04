import {pathExists, writeFile, ensureDir, readFile} from "fs-extra"
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
            pathExists(configPath, (err, exists) =>{
                if(err) e(err);
                if(!err && !exists) writeFile(configPath,JSON.stringify(stashed,null,"\t"),err =>{
                    if(err) e(err)
                    this.readFile(stashed,c =>{
                        ensureDir(c.notePath).then(e=>r(c))
                    });
                })
                else this.readFile(stashed,c =>{
                    ensureDir(c.notePath).then(e=>r(c))
                });
            })
        })
    }
    
    private static readFile(stashed:Configuration, resolve){
        readFile(configPath,(e,b)=>{
            var obj = Object.assign(stashed,JSON.parse(b.toString()));
            resolve(obj);
        })
    }

    saveConfig(callback?){
        writeFile(configPath,JSON.stringify(this, null, "\t"),(e) => {
            if(callback) callback
            else console.log(e)
        });
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