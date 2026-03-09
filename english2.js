const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

let library = []; // { name: string, content: string, comments: [{ id, quote, body }] }
let currentFileIndex = null;
let activeCommentId = null;
const SUPPORTED_EXTENSIONS = new Set([
    'pdf', 'txt', 'text', 'md', 'markdown', 'log',
    'csv', 'tsv', 'json', 'xml', 'html', 'htm',
    'js', 'mjs', 'cjs', 'ts', 'jsx', 'tsx',
    'css', 'scss', 'less', 'py', 'java', 'c', 'cpp', 'h', 'hpp',
    'go', 'rs', 'rb', 'php', 'sh', 'sql',
    'yml', 'yaml', 'toml', 'ini', 'cfg', 'conf',
    'rtf', 'docx', 'docm', 'dotx'
]);
const ACCEPT_ATTRIBUTE = Array.from(SUPPORTED_EXTENSIONS).map((ext) => `.${ext}`).join(',');

const dropZone = document.getElementById('drop-zone');
const uploadPanel = document.getElementById('upload-panel');
const dragOverlay = document.getElementById('drag-upload-overlay');
const fileInput = document.getElementById('pdf-upload');
const textContainer = document.getElementById('text-container');
const documentViewer = document.getElementById('document-viewer');
const docTitle = document.getElementById('doc-title');
const commentArea = document.getElementById('comment-area');
const fileTabs = document.getElementById('file-tabs');

fileInput.setAttribute('accept', ACCEPT_ATTRIBUTE);

// --- Drag & Drop / Upload Logic ---

dropZone.onclick = () => fileInput.click();

document.addEventListener('dragenter', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    if (library.length > 0) dragOverlay.classList.add('visible');
});

document.addEventListener('dragover', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragOverlay.classList.remove('visible');
});

function isFileDrag(e) {
    return e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
}

function dragOverHandler(e) {
    e.preventDefault();
    uploadPanel.classList.add('dragover');
    dropZone.classList.add('dragover');
}

function dragLeaveHandler() {
    uploadPanel.classList.remove('dragover');
    dropZone.classList.remove('dragover');
}

function overlayLeaveHandler(e) {
    if (e.target === dragOverlay) {
        dragOverlay.classList.remove('visible');
    }
}

function dropHandler(e) {
    e.preventDefault();
    dragLeaveHandler();
    dragOverlay.classList.remove('visible');
    processFiles(e.dataTransfer.files);
}

function fileInputHandler(e) {
    processFiles(e.target.files);
    e.target.value = '';
}

async function processFiles(files) {
    const inputFiles = Array.from(files || []);
    if (inputFiles.length === 0) return;

    const unsupported = [];
    const addedIndexes = [];

    for (const file of inputFiles) {
        if (!isSupportedFile(file)) {
            unsupported.push(file.name);
            continue;
        }

        try {
            const fullText = await extractFileContent(file);
            const fileRecord = {
                name: file.name,
                content: fullText,
                comments: []
            };
            library.push(fileRecord);
            addedIndexes.push(library.length - 1);
        } catch (err) {
            unsupported.push(file.name);
            console.error(`Failed to load file: ${file.name}`, err);
        }
    }

    if (unsupported.length > 0) {
        alert(`Some files could not be loaded: ${unsupported.join(', ')}`);
    }

    if (addedIndexes.length === 0) {
        return;
    }

    renderTabs();
    switchFile(addedIndexes[addedIndexes.length - 1]);
}

function isSupportedFile(file) {
    const ext = getFileExtension(file.name);
    return SUPPORTED_EXTENSIONS.has(ext);
}

function getFileExtension(fileName) {
    const parts = String(fileName).toLowerCase().split('.');
    if (parts.length < 2) return '';
    return parts[parts.length - 1];
}

async function extractFileContent(file) {
    const ext = getFileExtension(file.name);

    if (ext === 'pdf') {
        return extractPdfText(file);
    }

    if (ext === 'docx' || ext === 'docm' || ext === 'dotx') {
        return extractDocxText(file);
    }

    if (ext === 'html' || ext === 'htm' || ext === 'xml') {
        const raw = await file.text();
        const mode = ext === 'xml' ? 'xml' : 'html';
        return textToHtmlParagraphs(extractTextFromMarkup(raw, mode));
    }

    if (ext === 'rtf') {
        const raw = await file.text();
        return textToHtmlParagraphs(stripRtf(raw));
    }

    const rawText = await file.text();
    return textToHtmlParagraphs(rawText);
}

async function extractPdfText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const typedarray = new Uint8Array(arrayBuffer);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(' ');
        fullText += `<p>${escapeHtml(pageText)}</p>`;
    }

    return fullText;
}

async function extractDocxText(file) {
    if (typeof mammoth === 'undefined') {
        throw new Error('Mammoth library is not available.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return textToHtmlParagraphs(result.value || '');
}

function extractTextFromMarkup(markup, mode) {
    const parser = new DOMParser();
    const isXml = mode === 'xml';
    const doc = parser.parseFromString(markup, isXml ? 'application/xml' : 'text/html');

    if (isXml) {
        const parserError = doc.querySelector('parsererror');
        if (parserError) return markup;
        return doc.documentElement ? doc.documentElement.textContent || '' : '';
    }

    return doc.body ? doc.body.textContent || '' : markup;
}

function stripRtf(rtf) {
    return String(rtf)
        .replace(/\\par[d]?/g, '\n')
        .replace(/\\tab/g, ' ')
        .replace(/\\'[0-9a-fA-F]{2}/g, '')
        .replace(/\\[a-z]+-?\d* ?/g, '')
        .replace(/[{}]/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function textToHtmlParagraphs(text) {
    const normalized = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const blocks = normalized
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

    if (blocks.length === 0) {
        return '<p>(Empty document)</p>';
    }

    return blocks
        .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
        .join('');
}

// --- Tabs & File Management ---

function renderTabs() {
    let tabsHtml = '';

    library.forEach((file, index) => {
        tabsHtml += `
            <div class="file-tab ${index === currentFileIndex ? 'active' : ''}" onclick="switchFile(${index})">
                <span>${escapeHtml(file.name)}</span>
                <button class="tab-delete-btn" onclick="deleteFile(${index}, event)">×</button>
            </div>
        `;
    });

    tabsHtml += '<button class="file-tab add-tab" onclick="showUploadPanel()">+ Add New File</button>';
    fileTabs.innerHTML = tabsHtml;
}

function showUploadPanel() {
    currentFileIndex = null;
    activeCommentId = null;
    documentViewer.classList.add('hidden');
    uploadPanel.classList.remove('hidden');
    docTitle.textContent = 'Select or Upload a Document';
    textContainer.innerHTML = '<p class="empty-state">Your document text will appear here.</p>';
    commentArea.innerHTML = '<p class="empty-state">Highlight text to comment.</p>';
    renderTabs();
}

function switchFile(index) {
    if (index < 0 || index >= library.length) return;

    currentFileIndex = index;
    activeCommentId = null;

    uploadPanel.classList.add('hidden');
    documentViewer.classList.remove('hidden');
    docTitle.textContent = library[index].name;
    textContainer.innerHTML = library[index].content;

    renderTabs();
    renderComments();
    syncActiveHighlight();
}

function deleteFile(index, e) {
    e.stopPropagation();

    library.splice(index, 1);

    if (library.length === 0) {
        showUploadPanel();
        return;
    }

    if (currentFileIndex === index) {
        const nextIndex = Math.max(0, index - 1);
        switchFile(nextIndex);
        return;
    }

    if (currentFileIndex !== null && index < currentFileIndex) {
        currentFileIndex -= 1;
    }

    renderTabs();
}

// --- Highlighting & Comment Logic ---

textContainer.addEventListener('click', (e) => {
    const span = e.target.closest('.sentence');
    if (!span || currentFileIndex === null) return;

    const highlightId = span.dataset.highlightId || span.id;
    selectComment(highlightId);
});

function handleSelection() {
    if (currentFileIndex === null) return;

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText.length === 0 || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const highlightId = 'hl-' + Date.now();
    const span = document.createElement('span');
    span.className = 'sentence';
    span.id = highlightId;
    span.dataset.highlightId = highlightId;

    try {
        range.surroundContents(span);

        library[currentFileIndex].comments.push({
            id: highlightId,
            quote: selectedText,
            body: ''
        });

        saveCurrentContent();
        selectComment(highlightId, true);
    } catch (err) {
        alert('Please select text within a single paragraph.');
    }

    selection.removeAllRanges();
}

function selectComment(id, focusInput = false) {
    const currentFile = library[currentFileIndex];
    if (!currentFile) return;

    const found = currentFile.comments.find((comment) => comment.id === id);
    if (!found) return;

    activeCommentId = id;
    renderComments();
    syncActiveHighlight();

    if (focusInput) {
        const input = document.getElementById(`comment-input-${id}`);
        if (input) input.focus();
    }
}

function renderComments() {
    const currentFile = library[currentFileIndex];

    if (!currentFile || currentFile.comments.length === 0) {
        commentArea.innerHTML = '<p class="empty-state">Highlight text to comment.</p>';
        return;
    }

    const commentsHtml = currentFile.comments.map((comment) => `
        <div class="comment-thread ${comment.id === activeCommentId ? 'active' : ''}" onclick="selectComment('${comment.id}')">
            <p class="comment-quote">"${escapeHtml(comment.quote)}"</p>
            <textarea
                id="comment-input-${comment.id}"
                class="comment-input"
                placeholder="Add a comment..."
                onclick="event.stopPropagation()"
            >${escapeHtml(comment.body)}</textarea>
            <div class="comment-actions">
                <button class="btn-primary" onclick="saveComment('${comment.id}', event)">Post</button>
                <button class="btn-danger" onclick="removeHighlight('${comment.id}', event)">Delete</button>
            </div>
        </div>
    `).join('');

    commentArea.innerHTML = `
        <div class="discussion-header">Discussion</div>
        <div class="comment-list">${commentsHtml}</div>
    `;
}

function saveComment(id, e) {
    if (e) e.stopPropagation();

    const currentFile = library[currentFileIndex];
    if (!currentFile) return;

    const comment = currentFile.comments.find((item) => item.id === id);
    const input = document.getElementById(`comment-input-${id}`);
    if (!comment || !input) return;

    comment.body = input.value.trim();
    activeCommentId = id;
    renderComments();
    syncActiveHighlight();
}

function removeHighlight(id, e) {
    if (e) e.stopPropagation();

    const span = document.getElementById(id);
    if (span) {
        const parent = span.parentNode;
        while (span.firstChild) parent.insertBefore(span.firstChild, span);
        parent.removeChild(span);
    }

    const currentFile = library[currentFileIndex];
    if (!currentFile) return;

    currentFile.comments = currentFile.comments.filter((comment) => comment.id !== id);
    if (activeCommentId === id) {
        activeCommentId = currentFile.comments.length ? currentFile.comments[currentFile.comments.length - 1].id : null;
    }

    saveCurrentContent();
    renderComments();
    syncActiveHighlight();
}

function saveCurrentContent() {
    if (currentFileIndex === null || !library[currentFileIndex]) return;
    library[currentFileIndex].content = textContainer.innerHTML;
}

function syncActiveHighlight() {
    const spans = textContainer.querySelectorAll('.sentence');
    spans.forEach((span) => {
        const id = span.dataset.highlightId || span.id;
        span.classList.toggle('active-sentence', id === activeCommentId);
    });
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

renderTabs();
showUploadPanel();
