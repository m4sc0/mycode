const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    log: (content) => ipcRenderer.send('log', content),
    openDir: () => {
        ipcRenderer.invoke('openDir')
        console.log('fired openDir')
    },
    minimize: () => ipcRenderer.invoke('minimize'),
    maximize: () => ipcRenderer.invoke('maximize'),
    close: () => ipcRenderer.invoke('close')
})