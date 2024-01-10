// const path = require('path')
// const fs = require('fs');

export function loadSettings(customPath = '') {
    let settingsPath;
    if (customPath === '') {
        settingsPath = path.join(window.electronAPI.getDefaultPath(), 'settings.json');
    } else {
        settingsPath = customPath;
    }

    console.log(settingsPath);

    try {
        const settingsData = fs.readFileSync(settingsPath, 'utf8');
        return JSON.parse(settingsData);
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

export function applySettings(settings) {
    console.log(settings);
    // editor settings

    // indentation
    if (settings.editor.indentation.activate) {
        document.getElementById('code').addEventListener('keydown', (e) => {
            if (e.keyCode === 9) {
                e.preventDefault();
                
                const indent = new Array(settings.editor.indentation.space + 1).join(' ');
                document.execCommand('insertText', false, indent);
            }
        })
    }
}