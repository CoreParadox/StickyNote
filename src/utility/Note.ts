import * as fs from "fs-extra"
import EventEmitter from "events";
import * as path from "path";
export default class Note extends EventEmitter{
    public path:string;
    public name: string;
    private contents: string;
    
    constructor(filePath){
        super();
        this.path = filePath;
        this.name = path.parse(filePath).base
    }

    public async getContents(){
        this.contents = (await fs.readFile(this.path)).toString();
        this.emit("ready",this)
        return this.contents;
    }

    public async setContents(val){
        await fs.writeFile(this.path, val)
        this.contents = val;
        this.emit("changed",this);
    }
}