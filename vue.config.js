module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                    "appId": "com.coreparadox.sticky",
                    "icon": __dirname + '/src/assets/icon.ico',
                    "win": {
                        "icon": __dirname + '/src/assets/icon.ico',
                        "target": "NSIS"
                    },
                    "win": {
                        "icon": __dirname + '/src/assets/icon.ico',
                        "target": "NSIS"
                    },
            }
        }
    }
}