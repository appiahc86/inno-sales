import {dialog} from "electron";

const endingMenu = [
    {
        label: 'Help',
        submenu: [
            {label: 'About', role: 'About'}
        ]
    }
]

export default endingMenu;