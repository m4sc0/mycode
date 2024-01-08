// import { ipcRenderer } from '@electron';
import { createListFromTree } from './fileTree.js';

const minBtn = document.getElementById('minBtn');
const maxBtn = document.getElementById('maxBtn');
const closeBtn = document.getElementById('closeBtn');

minBtn.addEventListener('click', () => {
    window.electronAPI.minimize();
});

maxBtn.addEventListener('click', () => {
    window.electronAPI.maximize();
});

closeBtn.addEventListener('click', () => {
    window.electronAPI.close();
});

openBtn.addEventListener("click", async () => {
    try {
        const result = await window.electronAPI.openDir();

        if (result) {
            const container = document.getElementById("file-tree-container");
            console.log(result);
            container.innerHTML = createListFromTree(result);
        } else {
            console.log("No file tree returned or invalid file tree structure");
        }
    } catch (error) {
        console.error("Error opening directory:", error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const folders = document.querySelectorAll('#fileTree .folder-interactive');

    folders.forEach(folder => {
        const toggle = folder.querySelector('.folder-toggle');
        toggle.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');

            const childUl = this.nextElementSibling;
            if (childUl.style.display === 'none') {
                childUl.style.display = 'block';
            } else {
                childUl.style.display = 'none';
            }
        });
    });

    // Initially hide all child lists
    const allSubLists = document.querySelectorAll('#fileTree .folder-interactive ul');
    allSubLists.forEach(ul => ul.style.display = 'none');
});
