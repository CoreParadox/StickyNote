import { access, writeFile, constants as fsConstants, readFile, write } from 'fs';


export default class Configuration {
    public notePath: string = "notes"
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
        var stashed = new Configuration
        return new Promise<Configuration>((r,e) =>{
            access("./config.json", fsConstants.F_OK, (err) => {
                if(err) writeFile("./config.json",JSON.stringify(stashed,null,"\t"),ex =>{
                    if(ex) e(ex)
                    this.readFile(stashed,r);
                })
                this.readFile(stashed,r);
            });
            
        })
    }
    
    private static readFile(stashed:Configuration, resolve){
        readFile("./config.json",(e,b)=>{
            var obj = Object.assign(stashed,(b.toJSON()));
            resolve(obj);
        })
    }

    saveConfig(callback){
        writeFile("./config.json",JSON.stringify(this, null, "\t"),callback)
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