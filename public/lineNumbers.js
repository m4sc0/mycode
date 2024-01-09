export function updateLineNumbers() {
    const lineNumbersElement = document.getElementById('line-numbers');
    const codeElement = document.getElementById('code');

    // Use childNodes to count line breaks and divs for new lines
    let lineCount = 1;
    const childNodes = codeElement.childNodes;
    childNodes.forEach(node => {
        if (node.nodeName === 'DIV' || node.nodeName === 'BR') {
            lineCount++;
        }
    });

    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('<br>');
    lineNumbersElement.innerHTML = lineNumbers;
}

export function lineNumberListener() {
    const codeElement = document.getElementById('code');
    if (codeElement) {
        updateLineNumbers(); // Initial update
        codeElement.addEventListener('input', updateLineNumbers);
    } else {
        console.error('Element with id "code" not found');
    }
}