const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    log: (content) => ipcRenderer.send('log', content),
    openDir: () => {
        console.log('fired openDir')
        return ipcRenderer.invoke('openDir')
    },
    openFile: async (path) => {
        console.log('fired openFile');
        try {
            const content = await ipcRenderer.invoke('openFile', path);
            return content;
        } catch (error) {
            console.error('Error in openFile:', error);
        }
    },
    
    minimize: () => ipcRenderer.invoke('minimize'),
    maximize: () => ipcRenderer.invoke('maximize'),
    close: () => ipcRenderer.invoke('close')
})