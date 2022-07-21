import {dialog} from "electron";

const endingMenu = [
    {
        label: 'Help',
        submenu: [
            {label: 'About', role: 'About'},
            {
                label: 'Visit website',
                click: async ()=>{
                    // await shell.openExternal('http://localhost/')
                    await dialog.showMessageBoxSync({tpye: 'question', detail: 'How are you' })
                },
                enabled: false
            }
        ]
    }
]

export default endingMenu;