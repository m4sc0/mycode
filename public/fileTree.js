export function createListFromTree(tree) {
    let htmlContent = "";

    function processNode(node) {
        const isFolder = node.type === "directory";
        let nodeName = node.name;
        let nodeHTML = `<li data-path="${node.path}" data-name="${nodeName}" class="${isFolder ? "folder" : "file"}">`;

        if (isFolder) {
            // Wrap folder name in a span for separate click handling
            nodeHTML += `<span class="folder-name">${nodeName}</span>`;
            nodeHTML += "<ul>";

            // Sort children: directories first, then files
            let sortedChildren = [];
            if (node.children && node.children.length > 0) {
                sortedChildren = node.children.sort((a, b) => {
                    if (a.type === "directory" && b.type !== "directory") {
                        return -1;
                    }
                    if (a.type !== "directory" && b.type === "directory") {
                        return 1;
                    }
                    return a.name.localeCompare(b.name); // Sort alphabetically for same types
                });

                sortedChildren.forEach((child) => {
                    nodeHTML += processNode(child);
                });
            }

            nodeHTML += "</ul>";
        } else {
            // For files, just display the name
            nodeHTML += nodeName;
        }

        nodeHTML += "</li>";
        return nodeHTML;
    }

    if (tree && tree.children) {
        htmlContent = "<ul>";
        tree.children.forEach((child) => {
            htmlContent += processNode(child);
        });
        htmlContent += "</ul>";
    }

    return htmlContent;
}
