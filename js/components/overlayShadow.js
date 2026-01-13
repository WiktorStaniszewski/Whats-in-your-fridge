
export function renderOverlayShadow(host, opts = {}) {
  if (!host) throw new Error('renderOverlayShadow: host is required');

  const {
    html = '',
    cssUrls = [],
    closeOnBackdrop = true,
    closeOnEsc = true,
    onClose = null,
    onMount = null,
    keepHostHiddenClass = 'hidden',
  } = opts;

  const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });

  const links = (cssUrls || [])
    .filter(Boolean)
    .map((href) => `<link rel="stylesheet" href="${href}">`)
    .join('\n');

  shadow.innerHTML = `
    ${links}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <div class="modal-overlay">
      <div class="modal-content" role="dialog" aria-modal="true">
        ${html}
      </div>
    </div>
  `;

  host.classList.remove(keepHostHiddenClass);


  const overlay = shadow.querySelector('.modal-overlay');
  const root = shadow.querySelector('.modal-content');
  const closeBtn = shadow.querySelector('.close-modal');

   const cleanup = () => {
    if (closeOnEsc) document.removeEventListener('keydown', onKeyDown);
    host.removeEventListener('click', onBackdropClick, true);
    overlay?.removeEventListener('click', onBackdropClick, true);
  };

  const close = () => {
    cleanup();
    host.classList.add(keepHostHiddenClass);
    shadow.innerHTML = '';
    if (onClose) onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') close();
  };

  const onBackdropClick = (e) => {
    const path = e.composedPath?.() ?? [];
    if (root && path.includes(root)) return;
    close();
  };

  if (closeOnEsc) document.addEventListener('keydown', onKeyDown);

  closeBtn?.addEventListener('click', close);

  if (closeOnBackdrop) {
    host.addEventListener('click', onBackdropClick, true);
    overlay?.addEventListener('click', onBackdropClick, true);
  }

  if (onMount) onMount({ shadow, root, close, overlay, host });

  return { shadow, root, close, overlay };
}
