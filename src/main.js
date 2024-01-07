// Settings for basic window
const { BrowserWindow, app, shell, ipcMain, dialog } = require('electron')
const path = require('path')
const { readdir } = require('fs/promises');
const { resolve } = require('path');

let window
function createWindow() {
	window = new BrowserWindow({
		width: 800,
		height: 600,
		minWidth: 800,
		minHeight: 600,
		frame: false,
		webPreferences: {
			preload: path.join(__dirname + '/preload.js'),
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: true,
		},
	})
	
	// api 
	apiServe();

	// server index.html file
	window.loadFile(path.resolve('public/index.html'))
	// start devtools
	window.webContents.openDevTools({ mode: 'detach' })

	// open links in browser
	window.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url)
		return { action: 'deny' }
	})

	window.show()
}

function init() {
	createWindow()
}

app.on('ready', init)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
	if (window === null) {
		createWindow()
	}
})

// API (endpoints are self-explanatory)
function apiServe() {
	ipcMain.on('log', (e, content) => {
		console.log(content);
	})

	ipcMain.on('set-title', (event, title) => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)
		win.setTitle(title)
		console.log('setting title to: ' + win.getTitle());
	  })

	ipcMain.handle('openDir', openDirectory)
}

// Functions for api
async function openDirectory() {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory', 'showHiddenFiles'] });
    if (canceled) {
        console.log('No Directory selected');
        return;
    }

    async function readDir(path) {
        const filesInPath = await readdir(path, { withFileTypes: true });
        const children = await Promise.all(filesInPath.map(async (fileInPath) => {
            const resolvedPath = resolve(path, fileInPath.name);
            if (fileInPath.isDirectory()) {
                return {
                    path: resolvedPath,
                    file: false,
                    children: await readDir(resolvedPath)
                };
            } else {
                return {
                    path: resolvedPath,
                    file: true,
                    children: []
                };
            }
        }));

        return children;
    }

    const fileTree = {
        path: filePaths[0],
        file: false,
        children: await readDir(filePaths[0])
    };

    console.log(JSON.stringify(fileTree, null, 2));
    return fileTree;
}