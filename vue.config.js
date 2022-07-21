// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })


module.exports = {

  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      nodeIntegration: true,
      customFileProtocol: './',
      builderOptions: {
        files: ["**/*"],
        extraFiles: [
          {
            "from": "bk",
            "to": "bk",
            "filter": ["**/*"]
          }
        ],

        appId: 'com.innosales.app',
        win: {
          target: 'nsis',
          icon: ''
        },
        nsis: {
          uninstallDisplayName: 'Inno Sales',
          // deleteAppDataOnUninstall: true,
          oneClick: false,
          license: 'license.txt',
          allowToChangeInstallationDirectory: true,
          allowElevation: true,
          createDesktopShortcut: true,
          shortcutName: 'Inno Sales',
        }

      }
    }
  }
}