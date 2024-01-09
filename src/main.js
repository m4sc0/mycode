// Settings for basic window
const { BrowserWindow, app, shell, ipcMain, dialog } = require('electron')
const path = require('path')
const { readdir } = require('fs/promises');
const { resolve } = require('path');
const dirTree = require("directory-tree");
const fs = require('fs').promises;

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

	ipcMain.handle('openDir', openDirectory);

	ipcMain.handle('openFile', async (event, path) => {
		return await openFile(path);
	})

	ipcMain.handle('minimize', () => {
		window.minimize();
	});

	ipcMain.handle('maximize', () => {
		if (window.isMaximized()) {
			window.unmaximize();
		} else {
			window.maximize();
		}
	});

	ipcMain.handle('close', () => {
		window.close();
	});
}

// Functions for api
async function openDirectory() {
	const { canceled, filePaths } = await dialog.showOpenDialog({ defaultPath: 'X:\\Projekte\\mycode\\' ,properties: ['openDirectory', 'showHiddenFiles'] });
	if (canceled) {
		console.log('No Directory selected');
		return;
	}

	const fileTree = dirTree(
		filePaths[0],
		{
			attributes: ['type', 'extension'],
			depth: 10
		}
	);

	return fileTree;
}

async function openFile(path) {
    try {
        const data = await fs.readFile(path, "utf8");
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
