const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    log: (content) => ipcRenderer.send('log', content),
    openDir: () => {
        ipcRenderer.invoke('openDir')
        console.log('fired openDir')
    },
})