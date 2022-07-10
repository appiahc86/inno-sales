
const {ipcRenderer} = require('electron');
import JsBarcode from "jsbarcode";
import tinyPrint from "tiny-print";

window.ipcRenderer = ipcRenderer;
window.JsBarcode = JsBarcode;

window.printTiny = tinyPrint
