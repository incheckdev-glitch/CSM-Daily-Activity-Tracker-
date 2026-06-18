# White-label setup

This build is now white-label ready. For each branded deployment, edit **`white-label.config.js`** only.

## What is controlled from `white-label.config.js`

- Browser title and mobile/PWA app name
- Header and login logos
- PWA install banner label and icon
- Runtime-generated manifest name, short name, theme color, and icons
- Offline page app name
- Document preview logo for proposals, agreements, invoices, receipts, credit notes, and Communication Centre exports
- Provider legal name, address, contact email/mobile
- Provider signatories used on agreements
- Proposal and agreement default Terms & Conditions URLs
- Invoice bank details and invoice support footer email
- Notification/email templates, push titles, and Supabase Edge Function white-label env fallbacks
- Product alias list used for the Annual SaaS row that controls Account Setup quantity

## Minimum changes for a new client/brand

1. Replace the logo files or point the config to new files:
   - `logos.ui`
   - `logos.document`
   - `logos.icon192`
   - `logos.icon512`
   - `logos.appleTouchIcon`
   - `logos.favicon`
2. Update:
   - `appName`
   - `shortName`
   - `companyName`
   - `legalName`
   - `address`
   - `supportEmail`
   - `website`
   - `privacyUrl`
   - `termsUrl`
3. Update provider signatories and bank details if the legal provider changes.
4. If the client uses a different main SaaS product name, add it to:
   - `productAliases.primaryAnnualSaas`

## Edge function / backend env variables

For Supabase/Vercel server-side functions, set these env values where relevant:

```env
APP_NAME="Client Platform"
WHITE_LABEL_APP_NAME="Client Platform"
WHITE_LABEL_OPEN_IN_TEXT="Open in Client Platform"
WHITE_LABEL_SUPPORT_MAILTO="mailto:support@client.com"
APP_BASE_URL="https://client.example.com"
PUBLIC_APP_URL="https://client.example.com"
```

## Notes

The internal database function names, legacy localStorage keys, and some code identifiers may still contain `incheck` because changing them would break existing data and RLS/RPC references. User-facing branding is now centralized through the white-label config.
