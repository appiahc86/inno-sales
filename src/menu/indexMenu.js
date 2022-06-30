import {dialog} from "electron";

const indexMenu = [
    {
        label: 'File',
        submenu: [
            {role: 'quit'}
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {role: 'copy'},
            {role: 'paste'},
            {role: 'cut'},
            {type: 'separator'},
            {role: 'selectAll'},
            {role: 'toggleSpellChecker'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'zoomIn'},
            {role: 'zoomOut'},
            {role: 'resetZoom'},
            {role: 'toggleFullScreen'}
        ]
    },
    {
        label: 'Help',
        submenu: [
            {label: 'About', role: 'About'},
            {
                label: 'Visit website',
                click: async ()=>{
                    // await shell.openExternal('http://localhost/')
                    await dialog.showMessageBoxSync({tpye: 'question', detail: 'How are you' })
                }
            }
        ]
    }

]

export default indexMenu;