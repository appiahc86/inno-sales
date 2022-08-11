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
        productName: 'Inno Sales',
        win: {
          target: 'nsis',
          // requestedExecutionLevel: "requireAdministrator",
          icon: ''
        },
        nsis: {
          uninstallDisplayName: 'Inno Sales',
          deleteAppDataOnUninstall: true,
          oneClick: true,
          license: 'license.txt',
          createDesktopShortcut: true,
          shortcutName: 'Inno Sales',
        },
        linux: {
          target: 'deb',
          icon: ''
        },
        deb: {}

      }
    }
  }
}