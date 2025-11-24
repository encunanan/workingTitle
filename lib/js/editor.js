document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);

  const runBtn = $('.editor-btn.run');
  const resetBtn = $('.editor-btn.reset');
  const exampleBtn = $('.editor-btn.load-example');
  const previewPanel = $('#preview-panel');
  const previewHeader = $('#preview-header');
  const previewFrame = $('#preview-frame');
  const saveBtn = $('#btn-save');
  const saveMenu = $('#save-menu');
  const saveFormatLabel = $('#save-format-label');
  const shareBtn = $('#btn-share');

  if (!window.ace) {
    console.error('Ace not found. Check ace.js path.');
    return;
  }

  // Placeholder text
  function createPlaceholderOverlay(editor, text) {
    const el = document.createElement('div');
    el.textContent = text;
    Object.assign(el.style, {
      position: 'absolute',
      left: '45px',
      color: '#888',
      fontStyle: 'italic',
      pointerEvents: 'none',
      fontFamily: 'monospace',
      opacity: '0.6',
      fontSize: '14px',
      zIndex: '5',
      whiteSpace: 'pre'
    });
    editor.container.appendChild(el);
    return el;
  }

  function makeEditor(id, mode, placeholderText) {
    const ed = ace.edit(id, {
      mode: `ace/mode/${mode}`,
      theme: 'ace/theme/monokai',
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      showPrintMargin: false,
      wrap: true
    });
    ed.session.setUseWorker(false);

    const placeholder = createPlaceholderOverlay(ed, placeholderText);

    function togglePlaceholder() {
      placeholder.style.display = ed.getValue().trim().length ? 'none' : 'block';
    }

    ed.on('change', togglePlaceholder);
    ed.on('focus', togglePlaceholder);
    ed.on('blur', togglePlaceholder);
    ed.container.addEventListener('paste', () => setTimeout(togglePlaceholder, 0));

    togglePlaceholder();
    setTimeout(() => ed.resize(true), 0);
    ed.placeholderOverlay = placeholder;

    return ed;
  }

  const htmlEditor = makeEditor('editor-html', 'html', 'Paste your HTML code here...');
  const cssEditor = makeEditor('editor-css', 'css', 'Paste your CSS code here...');
  const jsEditor = makeEditor('editor-js', 'javascript', 'Paste your JavaScript code here...');

  // "Load Example" snippet
  const example = {
    html: `<div class="poster">
  <h1>workingTitle</h1>
  <p>Play with code and make your own workingTitle Project.</p>
</div>`,
    css: `html,body{
      margin:0;
      padding:0;
      background:#050718;
      color:#9FD1FF;
      font-family:'VT323',monospace
    }
.poster{
  height:
  100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:12px
}
h1{
  font-size:64px;
  text-shadow:2px 2px 0 #000
}
p{
  font-size:24px;
  opacity:.9
}`,
    js: `console.log("Example loaded — make it yours!")`
  };

  // Preview
  function writePreview(html, css, js) {
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8">
<style>body{margin:0;background:#050718;color:#7FA8FF;font-family:VT323,monospace}
${css}</style></head><body>
${html}
<script>
try { ${js} } catch(err) {
  const pre=document.createElement('pre');
  pre.style.color='#ff8080';
  pre.textContent='! '+(err && err.message ? err.message : String(err));
  document.body.appendChild(pre);
}
<\/script>
</body></html>`);
    doc.close();
  }

  function showPreviewCentered() {
    previewPanel.classList.remove('hidden');
    const savedPos = JSON.parse(localStorage.getItem('wt-preview-pos') || 'null');
    const savedSize = JSON.parse(localStorage.getItem('wt-preview-size') || 'null');
    requestAnimationFrame(() => {
      if (savedSize) {
        previewPanel.style.width = savedSize.w + 'px';
        previewPanel.style.height = savedSize.h + 'px';
      }
      if (savedPos) {
        const pad = 10;
        const left = Math.min(Math.max(pad, savedPos.left), window.innerWidth - previewPanel.offsetWidth - pad);
        const top = Math.min(Math.max(pad, savedPos.top), window.innerHeight - previewPanel.offsetHeight - pad);
        previewPanel.style.left = left + 'px';
        previewPanel.style.top = top + 'px';
      } else {
        previewPanel.style.left = Math.max(10, (window.innerWidth - previewPanel.offsetWidth) / 2) + 'px';
        previewPanel.style.top = Math.max(10, (window.innerHeight - previewPanel.offsetHeight) / 2) + 'px';
      }
      previewPanel.style.position = 'absolute';
    });
  }

  function hidePreview() {
    previewPanel.classList.add('hidden');
  }

  // Run/Reset/Load
  function runPreview() {
    writePreview(htmlEditor.getValue(), cssEditor.getValue(), jsEditor.getValue());
    showPreviewCentered();
  }

  function resetEditors() {
    [htmlEditor, cssEditor, jsEditor].forEach(ed => {
      ed.session.setValue(''); 
      if (ed.placeholderOverlay) ed.placeholderOverlay.style.display = 'block';
    });
    hidePreview();
  }

  function loadExample() {
    htmlEditor.session.setValue(example.html);
    cssEditor.session.setValue(example.css);
    jsEditor.session.setValue(example.js);
    [htmlEditor, cssEditor, jsEditor].forEach(ed => {
      if (ed.placeholderOverlay) ed.placeholderOverlay.style.display = 'none';
    });
  }

  function getExportTarget(doc) {
    return doc.querySelector('[data-export-target]') ||
      doc.querySelector('.poster') ||
      doc.body;
  }

  async function renderPreviewCanvas(opts = {}) {
    if (!window.html2canvas) throw new Error('html2canvas missing.');
    const doc = previewFrame?.contentDocument;
    if (!doc?.body) throw new Error('Run your project to generate a preview first.');
    const target = getExportTarget(doc);
    const rect = target.getBoundingClientRect();
    const width = Math.ceil(target.scrollWidth || rect.width || doc.documentElement.scrollWidth);
    const height = Math.ceil(target.scrollHeight || rect.height || doc.documentElement.scrollHeight);
    const windowWidth = Math.max(width, doc.documentElement.clientWidth);
    const windowHeight = Math.max(height, doc.documentElement.clientHeight);
    const cssDpi = 96; 
    const minDpi = 72; 
    const preferredDpi = 192; 
    const dpiTarget = Math.max(minDpi, preferredDpi);
    const exportScale = opts.scaleOverride ?? Math.min(
      4,
      Math.max(dpiTarget / cssDpi, (window.devicePixelRatio || 1) * 2)
    );
    return html2canvas(target, {
      scale: exportScale,
      width,
      height,
      windowWidth,
      windowHeight,
      backgroundColor: null,
      useCORS: true,
      allowTaint: false,
      imageTimeout: 15000
    });
  }

  const STORAGE_FORMAT_KEY = 'wt-export-format';
  const allowedFormats = ['png', 'jpg', 'webm', 'mp4'];
  let currentFormat = (localStorage.getItem(STORAGE_FORMAT_KEY) || 'png').toLowerCase();
  if (!allowedFormats.includes(currentFormat)) currentFormat = 'png';

  function setSelectedFormat(fmt) {
    if (!allowedFormats.includes(fmt)) return;
    currentFormat = fmt;
    localStorage.setItem(STORAGE_FORMAT_KEY, currentFormat);
    if (saveFormatLabel) saveFormatLabel.textContent = `${currentFormat.toUpperCase()} ▾`;
  }

  function getSelectedFormat() {
    return currentFormat || 'png';
  }

  async function capturePreviewImage() {
    const canvas = await renderPreviewCanvas();
    const fmt = getSelectedFormat();
    const type = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(b => {
        if (b) return resolve(b);
        reject(new Error('Could not create an image file.'));
      }, type, type === 'image/jpeg' ? 0.92 : 0.95);
    });
    return { canvas, blob };
  }

  async function downloadImage() {
    try {
      const { blob } = await capturePreviewImage();
      const ext = getSelectedFormat() === 'jpg' ? 'jpg' : 'png';
      const mime = ext === 'jpg' ? 'image/jpeg' : 'image/png';
      const a = document.createElement('a');
      a.download = `workingTitle_artwork.${ext}`;
      a.href = URL.createObjectURL(blob, { type: mime });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    } catch (err) {
      alert(err.message || 'Could not save your artwork right now.');
    }
  }

  function docHasAnimation(doc) {
    try {
      if (doc?.getAnimations && doc.getAnimations({ subtree: true }).length) return true;
      const walker = doc?.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
      while (walker && walker.nextNode()) {
        const el = walker.currentNode;
        const cs = doc.defaultView.getComputedStyle(el);
        const hasAnim = (cs.animationName && cs.animationName !== 'none') &&
          cs.animationDuration.split(',').some(d => parseFloat(d) > 0);
        const hasIter = cs.animationIterationCount.split(',').some(c => c !== '0' && c !== '1');
        const hasTransition = cs.transitionDuration.split(',').some(d => parseFloat(d) > 0);
        if ((hasAnim && hasIter) || hasTransition) return true;
      }
      if (doc?.querySelector('video, canvas, audio')) return true;
    } catch (e) {
      console.warn('Animation detection failed', e);
    }
    return false;
  }

  async function recordAnimatedPreview(preferredType) {
    const doc = previewFrame?.contentDocument;
    if (!doc?.body) throw new Error('Run your project to generate a preview first.');
    if (typeof MediaRecorder === 'undefined') throw new Error('Video recording is not supported in this browser.');

    const videoScale = 1; // capture at native scale to avoid zooming
    const fps = 15;
    const durationMs = 4000;
    const frameDelay = 1000 / fps;

    const baseCanvas = await renderPreviewCanvas({ scaleOverride: videoScale });
    const recordingCanvas = document.createElement('canvas');
    recordingCanvas.width = baseCanvas.width;
    recordingCanvas.height = baseCanvas.height;
    const ctx = recordingCanvas.getContext('2d');
    const chunks = [];
    const stream = recordingCanvas.captureStream(fps);
    const mimeCandidates = preferredType === 'mp4'
      ? ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9']
      : ['video/webm;codecs=vp9', 'video/webm'];
    const mimeType = mimeCandidates.find(t => MediaRecorder.isTypeSupported?.(t)) || mimeCandidates[0];
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 6_000_000
    });
    recorder.ondataavailable = e => e.data?.size && chunks.push(e.data);

    recorder.start();
    const start = performance.now();
    let lastFrame = baseCanvas;

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
    while (performance.now() - start < durationMs) {
      ctx.clearRect(0, 0, recordingCanvas.width, recordingCanvas.height);
      ctx.drawImage(lastFrame, 0, 0);
      try {
        lastFrame = await renderPreviewCanvas();
      } catch (e) {
        console.warn('Frame capture failed', e);
      }
      await sleep(frameDelay);
    }

    recorder.stop();
    await new Promise(res => recorder.onstop = res);
    const blob = new Blob(chunks, { type: recorder.mimeType || mimeType });
    if (!blob.size) throw new Error('No video data was captured.');

    const a = document.createElement('a');
    const ext = (recorder.mimeType || mimeType).includes('mp4') ? 'mp4' : 'webm';
    a.download = `workingTitle_artwork.${ext}`;
    a.href = URL.createObjectURL(blob);
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  async function saveArtwork() {
    const doc = previewFrame?.contentDocument;
    if (!doc?.body) return alert('Run your project to generate a preview first.');
    const format = getSelectedFormat();
    const wantsMotion = format === 'webm' || format === 'mp4';
    const animated = docHasAnimation(doc);
    if (!wantsMotion) return downloadImage();
    if (!animated) return downloadImage();

    try {
      await recordAnimatedPreview(format);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not record your animation.');
      await downloadImage();
    }
  }

  async function shareByEmail() {
    try {
      const { blob } = await capturePreviewImage();
      const file = new File([blob], 'workingTitle_artwork.png', { type: 'image/png' });
      const subject = 'Check out my workingTitle artwork';
      const bodyText = 'Look what I made on workingTitle! Try it for yourself at workingtitleproject.com.';

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: subject, text: bodyText });
        return;
      }

      // Fallback: save locally and open an email draft with the message prefilled.
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = 'workingTitle_artwork.png';
      a.href = downloadUrl;
      a.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

      const fallbackBody = `${bodyText}\n\nYour image has been saved as workingTitle_artwork.png. Attach it to this email to share.`;
      const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fallbackBody)}`;
      window.location.href = mailto;
    } catch (err) {
      // User-initiated cancellations on the native share sheet should fail silently.
      const msg = err?.message || '';
      if (err?.name === 'AbortError' || /cancell?ation/i.test(msg)) return;
      console.error(err);
      alert(msg || 'Could not share your artwork right now.');
    }
  }

  // Button listeners
  runBtn?.addEventListener('click', runPreview);
  resetBtn?.addEventListener('click', resetEditors);
  exampleBtn?.addEventListener('click', loadExample);
  saveBtn?.addEventListener('click', (e) => {
    // Clicking the format tag toggles the dropdown; clicking elsewhere saves immediately.
    if (e.target === saveFormatLabel) {
      saveMenu?.classList.toggle('hidden');
      return;
    }
    saveMenu?.classList.add('hidden');
    saveArtwork();
  });

  saveMenu?.querySelectorAll('button[data-format]')?.forEach(btn => {
    btn.addEventListener('click', () => {
      const fmt = btn.dataset.format;
      setSelectedFormat(fmt);
      saveMenu.classList.add('hidden');
      saveArtwork();
    });
  });

  document.addEventListener('click', (event) => {
    if (!saveMenu || saveMenu.classList.contains('hidden')) return;
    if (event.target === saveFormatLabel || saveMenu.contains(event.target)) return;
    saveMenu.classList.add('hidden');
  });

  setSelectedFormat(currentFormat);
  shareBtn?.addEventListener('click', shareByEmail);
});
