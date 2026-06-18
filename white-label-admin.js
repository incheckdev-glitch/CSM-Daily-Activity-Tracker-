(function initWhiteLabelAdmin(root) {
  const STORAGE_KEY = 'whiteLabel.runtimeConfig.v1';
  let initialized = false;

  const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value);

  const clone = value => {
    try {
      return JSON.parse(JSON.stringify(value || {}));
    } catch (_error) {
      return {};
    }
  };

  const mergeDeep = (base, override) => {
    const result = Array.isArray(base) ? base.slice() : { ...(base || {}) };
    Object.entries(override || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (isPlainObject(value) && isPlainObject(result[key])) result[key] = mergeDeep(result[key], value);
      else result[key] = value;
    });
    return result;
  };

  const readStoredOverride = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_error) {
      return {};
    }
  };

  const getBaseConfig = () => {
    const fileConfig = clone(root.WHITE_LABEL_CONFIG || {});
    const activeConfig = clone(root.Branding?.config || root.BRAND_CONFIG || {});
    return mergeDeep(fileConfig, activeConfig);
  };

  const getActiveConfig = () => mergeDeep(getBaseConfig(), readStoredOverride());

  const getByPath = (object, path) => String(path || '').split('.').reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) return acc[key];
    return undefined;
  }, object);

  const setByPath = (object, path, value) => {
    const parts = String(path || '').split('.').filter(Boolean);
    if (!parts.length) return;
    let cursor = object;
    parts.slice(0, -1).forEach(part => {
      if (!isPlainObject(cursor[part])) cursor[part] = {};
      cursor = cursor[part];
    });
    cursor[parts[parts.length - 1]] = value;
  };

  const getInputValue = input => {
    const value = input?.value == null ? '' : String(input.value);
    return value.trim();
  };

  const collectFormConfig = form => {
    const next = clone(getActiveConfig());
    form.querySelectorAll('[data-wl-path]').forEach(input => {
      setByPath(next, input.getAttribute('data-wl-path'), getInputValue(input));
    });
    return next;
  };

  const buildConfigFile = config => `/*\n  WHITE LABEL CONFIGURATION\n  Generated from the in-app White Label Configuration tab.\n  Replace white-label.config.js with this content for the client deployment.\n*/\nwindow.WHITE_LABEL_CONFIG = ${JSON.stringify(config, null, 2)};\n`;

  const setState = message => {
    const el = document.getElementById('whiteLabelState');
    if (el) el.textContent = message;
  };

  const showToast = message => {
    if (root.UI?.toast) root.UI.toast(message);
    else setState(message);
  };

  const refreshExport = () => {
    const form = document.getElementById('whiteLabelForm');
    const output = document.getElementById('whiteLabelExportText');
    if (!form || !output) return;
    output.value = buildConfigFile(collectFormConfig(form));
  };

  const populateForm = () => {
    const form = document.getElementById('whiteLabelForm');
    if (!form) return;
    const config = getActiveConfig();
    form.querySelectorAll('[data-wl-path]').forEach(input => {
      const value = getByPath(config, input.getAttribute('data-wl-path'));
      input.value = value == null ? '' : String(value);
    });
    refreshExport();
    const hasOverride = Object.keys(readStoredOverride()).length > 0;
    setState(hasOverride ? 'Browser preview override is active. Export/copy the config file for deployment.' : 'Loaded from white-label.config.js.');
  };

  const showPane = paneName => {
    const name = String(paneName || 'general');
    document.querySelectorAll('[data-wl-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-wl-tab') === name);
    });
    document.querySelectorAll('[data-wl-pane]').forEach(pane => {
      pane.hidden = pane.getAttribute('data-wl-pane') !== name;
    });
    refreshExport();
  };

  const savePreview = () => {
    const form = document.getElementById('whiteLabelForm');
    if (!form) return;
    const next = collectFormConfig(form);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setState('Saved preview override. Reloading to apply branding...');
      showToast('White label preview saved. Reloading to apply it.');
      setTimeout(() => root.location.reload(), 350);
    } catch (error) {
      console.error('[white-label-admin] failed to save preview', error);
      showToast('Unable to save preview. Check browser storage permissions.');
    }
  };

  const resetPreview = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setState('Preview override cleared. Reloading...');
      showToast('White label preview reset. Reloading.');
      setTimeout(() => root.location.reload(), 350);
    } catch (error) {
      console.error('[white-label-admin] failed to reset preview', error);
      showToast('Unable to reset preview.');
    }
  };

  const copyConfig = async () => {
    refreshExport();
    const output = document.getElementById('whiteLabelExportText');
    const text = output?.value || buildConfigFile(getActiveConfig());
    try {
      await navigator.clipboard.writeText(text);
      showToast('white-label.config.js copied.');
    } catch (error) {
      console.error('[white-label-admin] clipboard copy failed', error);
      if (output) {
        output.focus();
        output.select();
      }
      showToast('Copy blocked by browser. Select the export text manually.');
    }
  };

  const downloadConfig = () => {
    refreshExport();
    const text = document.getElementById('whiteLabelExportText')?.value || buildConfigFile(getActiveConfig());
    try {
      const blob = new Blob([text], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'white-label.config.js';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('white-label.config.js downloaded.');
    } catch (error) {
      console.error('[white-label-admin] download failed', error);
      showToast('Unable to download config file. Use Copy config file instead.');
    }
  };

  const wire = () => {
    if (initialized) return;
    initialized = true;
    document.getElementById('whiteLabelConfigTabs')?.addEventListener('click', event => {
      const btn = event.target?.closest?.('[data-wl-tab]');
      if (!btn) return;
      event.preventDefault();
      showPane(btn.getAttribute('data-wl-tab'));
    });
    document.getElementById('whiteLabelForm')?.addEventListener('input', refreshExport);
    document.getElementById('whiteLabelSaveBtn')?.addEventListener('click', savePreview);
    document.getElementById('whiteLabelResetBtn')?.addEventListener('click', resetPreview);
    document.getElementById('whiteLabelCopyBtn')?.addEventListener('click', copyConfig);
    document.getElementById('whiteLabelDownloadBtn')?.addEventListener('click', downloadConfig);
  };

  const init = () => {
    wire();
    populateForm();
    showPane(document.querySelector('[data-wl-tab].active')?.getAttribute('data-wl-tab') || 'general');
  };

  root.WhiteLabelAdmin = { init, refreshExport, buildConfigFile, getActiveConfig };
})(window);
