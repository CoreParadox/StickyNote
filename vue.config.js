module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                    "appId": "com.coreparadox.sticky",
                    "icon": __dirname + '/dist_electron/resources/app.asar/icon.ico',
                    "win": {
                        "icon": __dirname + '/dist_electron/resources/app.asar/icon.ico',
                        "target": "NSIS"
                    },
                    "extraFiles": [
                        "resources/**"
                    ]
            }
        }
    }
}