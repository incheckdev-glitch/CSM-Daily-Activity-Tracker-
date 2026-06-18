(function initWhiteLabel(root) {
  const DEFAULTS = {
    appName: 'InCheck360 MonitorCore',
    shortName: 'MonitorCore',
    productName: 'MonitorCore',
    workspaceName: 'Internal operations workspace',
    companyName: 'InCheck 360',
    legalName: 'InCheck 360 Holding BV',
    address: 'Pyrmontstraat 5, 7513 BN, Enschede, The Netherlands',
    supportEmail: 'info@incheck360.nl',
    supportPhone: '+31 97 010280855',
    website: 'https://monitor.app.incheck360.nl',
    privacyUrl: 'https://incheck360.com/privacy-policy',
    termsUrl: 'https://incheck360.com/terms-of-use',
    brandAlt: 'InCheck360 MonitorCore logo',
    colors: {
      themeColor: '#ffffff',
      maskIconColor: '#020617',
      primary: '#020617',
      accent: '#0b57d0'
    },
    logos: {
      ui: 'assets/incheck360-ui-logo.png',
      document: 'assets/incheck360-document-logo.png',
      favicon: 'favicon.ico',
      appleTouchIcon: 'icons/apple-touch-icon.png',
      icon192: 'icons/icon-192.png',
      icon512: 'icons/icon-512.png',
      maskableIcon: 'icons/maskable-icon-512.png',
      maskIconSvg: 'icons/maskable-icon.svg'
    },
    providerContact: {
      name: 'InCheck 360 Holding BV',
      address: 'Pyrmontstraat 5, 7513 BN, Enschede, The Netherlands',
      mobile: '+31 97 010280855',
      email: 'info@incheck360.nl'
    },
    providerSignatories: {
      primaryName: 'Simon Moujaly',
      primaryTitle: 'Senior Financial Controller',
      secondaryName: 'Hanna Khattar',
      secondaryTitle: 'General Manager'
    },
    bankDetails: {
      bank_name: 'WISE US Inc',
      account_name: 'InCheck 360 Holding B.V.',
      account_number: '367413263110026',
      routing_number: '084009519',
      swift_bic: 'TRWIUS35XXX',
      bank_address: '108 W 13th St Wilmington 19801 - USA'
    },
    productAliases: {
      primaryAnnualSaas: ['InCheck Basic', 'InCheck 360 Basic', 'InCheck360 Basic']
    },
    login: {
      eyebrow: 'Internal operations workspace',
      headline: 'Keep ticketing ops aligned, visible, and ready for every release.',
      description: 'MonitorCore is an internal hub for ticket tracking, deployment events, and AI signals—built to drive confident prioritization and faster execution.',
      hint: 'Email-only login. Sign in with your assigned account email and password.',
      smallPrint: 'Internal-only access · Connected to the live workspace'
    }
  };

  const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value);
  const mergeDeep = (base, override) => {
    const result = Array.isArray(base) ? base.slice() : { ...(base || {}) };
    Object.entries(override || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (isPlainObject(value) && isPlainObject(result[key])) result[key] = mergeDeep(result[key], value);
      else result[key] = value;
    });
    return result;
  };
  const directConfig = root.WHITE_LABEL_CONFIG || {};
  const runtimeConfig = root.RUNTIME_CONFIG?.WHITE_LABEL || root.RUNTIME_CONFIG?.BRAND || {};
  const config = mergeDeep(mergeDeep(DEFAULTS, directConfig), runtimeConfig);

  const getPath = (path, fallback = '') => String(path || '').split('.').reduce((acc, part) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, part)) return acc[part];
    return undefined;
  }, config) ?? fallback;

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[ch]));

  const absoluteUrl = (path = '') => {
    const raw = String(path || '').trim();
    if (!raw) return '';
    if (/^(data:|blob:|https?:\/\/|\/)/i.test(raw)) return raw;
    return raw;
  };

  const providerContact = () => ({
    name: getPath('providerContact.name', config.legalName),
    address: getPath('providerContact.address', config.address),
    mobile: getPath('providerContact.mobile', config.supportPhone),
    email: getPath('providerContact.email', config.supportEmail),
    legalName: config.legalName,
    companyName: config.companyName
  });

  const providerIdentity = () => {
    const contact = providerContact();
    const signs = config.providerSignatories || {};
    return {
      legalName: config.legalName,
      name: contact.name || config.legalName,
      address: contact.address || config.address,
      contactName: contact.name || config.legalName,
      contactMobile: contact.mobile || config.supportPhone,
      contactEmail: contact.email || config.supportEmail,
      primarySignatoryName: signs.primaryName || '',
      primarySignatoryTitle: signs.primaryTitle || '',
      secondarySignatoryName: signs.secondaryName || '',
      secondarySignatoryTitle: signs.secondaryTitle || ''
    };
  };

  const defaultAgreementTerms = () => `Provider and Customer hereby agree to abide by and be bound to this Subscription Agreement, Provider’s Terms of Use, and Provider's Privacy Policy. Provider's Terms of Use and Privacy Policy can be found at ${config.termsUrl} and ${config.privacyUrl}, respectively, and are hereby incorporated into this Agreement. The Subscription Agreement, Provider's Terms of Use, and Privacy Policy form the Agreement between Customer, as listed above, and ${config.legalName}.\n\nIN WITNESS WHEREOF, the parties have caused this Agreement to be executed by their authorized representatives as of the date of last signature by either party ("Effective Date").`;

  const defaultProposalTerms = () => `1. SaaS Cost is an annual recurring cost, while Account Setup is a one-time fee.\n2. Customer Support is continuous during the subscription term with an unlimited quantity of requests.\n3. ${config.companyName}'s Privacy Policy can be found at ${config.privacyUrl}\n4. ${config.companyName}'s Terms of Use can be found at ${config.termsUrl}`;

  const makeManifest = () => ({
    name: config.appName,
    short_name: config.shortName || config.appName,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: config.colors?.themeColor || '#ffffff',
    theme_color: config.colors?.themeColor || '#ffffff',
    icons: [
      { src: absoluteUrl(config.logos?.icon192), sizes: '192x192', type: 'image/png' },
      { src: absoluteUrl(config.logos?.icon512), sizes: '512x512', type: 'image/png' },
      { src: absoluteUrl(config.logos?.maskableIcon || config.logos?.icon512), sizes: '512x512', type: 'image/png', purpose: 'maskable any' }
    ].filter(icon => icon.src)
  });

  const setOrCreateMeta = (name, content, attr = 'name') => {
    if (typeof document === 'undefined') return;
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head?.appendChild(el);
    }
    el.setAttribute('content', String(content || ''));
  };

  const setLinkHref = (selector, href) => {
    if (typeof document === 'undefined' || !href) return;
    const el = document.querySelector(selector);
    if (el) el.setAttribute('href', href);
  };

  const applyStaticDomBranding = () => {
    if (typeof document === 'undefined') return;
    document.title = config.appName;
    setOrCreateMeta('theme-color', config.colors?.themeColor || '#ffffff');
    setOrCreateMeta('apple-mobile-web-app-title', config.appName);
    setLinkHref('link[rel="icon"]', config.logos?.favicon);
    setLinkHref('link[rel="apple-touch-icon"]', config.logos?.appleTouchIcon);
    setLinkHref('link[rel="mask-icon"]', config.logos?.maskIconSvg);
    const maskLink = document.querySelector('link[rel="mask-icon"]');
    if (maskLink && config.colors?.maskIconColor) maskLink.setAttribute('color', config.colors.maskIconColor);

    document.documentElement?.style?.setProperty('--brand-primary', config.colors?.primary || '#020617');
    document.documentElement?.style?.setProperty('--brand-accent', config.colors?.accent || '#0b57d0');

    document.querySelectorAll('.brand-logo, .login-logo, .auth-brand-logo, [data-brand-logo]').forEach(img => {
      if (img?.tagName?.toLowerCase() === 'img' && config.logos?.ui) img.setAttribute('src', config.logos.ui);
      img?.setAttribute?.('alt', config.brandAlt || `${config.appName} logo`);
    });

    const brandContainers = document.querySelectorAll('.brand[aria-label]');
    brandContainers.forEach(el => el.setAttribute('aria-label', `${config.appName} brand`));

    const heroEyebrow = document.querySelector('.hero-eyebrow');
    if (heroEyebrow && config.login?.eyebrow) heroEyebrow.textContent = config.login.eyebrow;
    const heroTitle = document.querySelector('#loginSection h1');
    if (heroTitle && config.login?.headline) heroTitle.textContent = config.login.headline;
    const heroDescription = document.querySelector('#loginSection p');
    if (heroDescription && config.login?.description) heroDescription.textContent = config.login.description;
    const heroSmall = document.querySelector('#loginSection small.muted');
    if (heroSmall && config.login?.smallPrint) heroSmall.textContent = config.login.smallPrint;
    const loginHint = document.getElementById('loginHint');
    if (loginHint && config.login?.hint) loginHint.textContent = config.login.hint;

    document.querySelectorAll('[data-brand-text="appName"]').forEach(el => { el.textContent = config.appName; });
    document.querySelectorAll('[data-brand-text="companyName"]').forEach(el => { el.textContent = config.companyName; });

    const replacements = [
      [/InCheck360 MonitorCore/g, config.appName],
      [/InCheck360/g, config.companyName],
      [/InCheck 360 Holding BV/g, config.legalName],
      [/InCheck 360 Holding B\.V\./g, config.legalName],
      [/Info@incheck360\.nl/g, config.supportEmail],
      [/info@incheck360\.nl/g, config.supportEmail],
      [/https:\/\/monitor\.app\.incheck360\.nl/g, config.website],
      [/https:\/\/incheck360\.com\/privacy-policy/g, config.privacyUrl],
      [/https:\/\/www\.incheck360\.com\/privacy-policy/g, config.privacyUrl],
      [/https:\/\/incheck360\.com\/terms-of-use/g, config.termsUrl],
      [/https:\/\/www\.incheck360\.com\/terms-of-use/g, config.termsUrl]
    ].filter(([, value]) => value);
    const applyTextReplacements = value => replacements.reduce((output, [pattern, replacement]) => output.replace(pattern, replacement), String(value || ''));
    const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parentName = node?.parentElement?.tagName?.toLowerCase();
        if (['script', 'style', 'textarea'].includes(parentName)) return NodeFilter.FILTER_REJECT;
        return /InCheck|incheck360/.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(node => { node.nodeValue = applyTextReplacements(node.nodeValue); });
    document.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(el => {
      ['title', 'aria-label', 'placeholder', 'alt'].forEach(attr => {
        if (!el.hasAttribute(attr)) return;
        const current = el.getAttribute(attr) || '';
        if (/InCheck|incheck360/.test(current)) el.setAttribute(attr, applyTextReplacements(current));
      });
    });

    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink && typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
      try {
        const blob = new Blob([JSON.stringify(makeManifest(), null, 2)], { type: 'application/manifest+json' });
        manifestLink.setAttribute('href', URL.createObjectURL(blob));
      } catch (_) {}
    }
  };

  const brand = {
    config,
    get: getPath,
    escapeHtml,
    providerContact,
    providerIdentity,
    bankDetails: () => ({ ...(config.bankDetails || {}) }),
    defaultAgreementTerms,
    defaultProposalTerms,
    documentLogoSrc: () => getPath('logos.document', ''),
    appName: () => config.appName,
    shortName: () => config.shortName || config.appName,
    companyName: () => config.companyName,
    supportEmail: () => config.supportEmail,
    baseUrl: () => config.website || (root.location?.origin || ''),
    openInText: () => `Open in ${config.productName || config.appName}`,
    productAliases: name => Array.isArray(config.productAliases?.[name]) ? config.productAliases[name] : [],
    apply: applyStaticDomBranding,
    makeManifest
  };

  root.Branding = brand;
  root.BRAND_CONFIG = config;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyStaticDomBranding, { once: true });
  } else {
    applyStaticDomBranding();
  }
})(window);
