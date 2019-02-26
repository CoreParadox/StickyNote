import { pathExists, writeFile, ensureDir, readFile, pathExistsSync, writeFileSync, ensureDirSync, readFileSync } from "fs-extra"
import { join } from "path";
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

    public static getConfig() {
        if (!pathExistsSync(configPath)) {
            writeFileSync(configPath, JSON.stringify(new Configuration(), null, "\t"));
        }
        var config = this.readFile();
        ensureDirSync(config.notePath)
        return config;
    }

    private static readFile() {
        return Object.assign(new Configuration(), JSON.parse(readFileSync(configPath).toString()));;
    }

    public async saveConfig() {
        await writeFile(configPath, JSON.stringify(this, null, "\t"));
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