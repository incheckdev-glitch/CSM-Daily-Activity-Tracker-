/*
  WHITE LABEL CONFIGURATION
  Edit this file for each branded deployment. Keep the keys the same and change the values only.
  You can also override the same object from a hosting/runtime script through window.RUNTIME_CONFIG.WHITE_LABEL.
*/
window.WHITE_LABEL_CONFIG = {
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
    // UI/app/PWA logos. Replace these files, or point to client-specific files.
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
    // Used for the annual SaaS row that automatically controls account setup quantity.
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
