export function createListFromTree(tree) {
    let htmlContent = "";
	
	console.log(tree);
    function processNode(node) {
        const isFolder = node.type === "directory";
        let nodeHTML = `<li data-path="${node.path}" data-name="${node.name}" class="${isFolder ? "folder" : "file"}">${node.name}`;

        if (isFolder) {
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
					// console.log(child);
                    nodeHTML += processNode(child);
                });
            }

            nodeHTML += "</ul>";
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
