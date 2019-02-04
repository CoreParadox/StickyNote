import { access, writeFile, constants as fsConstants, readFile } from 'fs';


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
        var stashed = new Configuration()
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
            var obj = Object.assign(stashed,JSON.parse(b.toString()));
            resolve(obj);
        })
    }

    saveConfig(callback?){
        //TODO: This is a hack, but vue adds some junk data when binding
        delete (<any>this).data
        delete (<any>this).type
        console.log(JSON.stringify(this,null,"\t"))
        writeFile("./config.json",JSON.stringify(this, null, "\t"),(e) => {
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