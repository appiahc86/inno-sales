import {app, BrowserWindow, dialog} from "electron";

const endingMenu = [
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click(){
                    dialog.showMessageBox(
                        BrowserWindow.getAllWindows()[0],
                        {type: 'info',
                            message: `Inno Sales 1.0.0`
                        }
                    )
                }
            }
        ]
    }
]

export default endingMenu;