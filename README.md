# 🛠️ SAML IdP-Initiated Login Sample using Transmit CIAM SDK

This sample demonstrates a **SAML IdP-Initiated login flow** using the **Transmit CIAM SDK** and a simple browser-based frontend. The user authenticates with Transmit, receives a SAML token in a cookie, and the browser POSTs that token to the Service Provider's ACS URL.

---

## 📦 Prerequisites

- Node.js (v16+)
- Transmit CIAM environment with:
  - Application ID configured (e.g., `web`)
  - Authentication policy (e.g., `samlweb`)
  - SAML response policy using `@crypto.generateSamlToken(...)` and `Set an HTTP Cookie`
- Valid TLS certificate for your domain (e.g., `onlinebanking.test.com`)
  - Certs and keys are provided in the `ssl` directory, or you can generate your own and import the CA/Root into your system for local trust
- Host entries or DNS mapped to `127.0.0.1` for local testing

---

## 🧱 Project Structure

```
/saml-idp-poc
├── .git/                      # Git repository
├── .gitignore
├── README.md                  # This file
├── samlwebapppoc.json         # Sample configuration or metadata file
└── login-portal/
    ├── public/                # Frontend assets (HTML, JS, SDK)
    │   └── sdk/               # Transmit CIAM Web SDK
    │   └── index.html         # Main login page
    │   └── script.js          # Login logic and SAML POST
    ├── server.js              # HTTPS Node.js server
    ├── ssl/                   # TLS certs (server.crt, server.key)
    └── views/                 # Optional HTML templates (e.g., using Express)
```

---

## 🚀 Setup Instructions

### 1. 🧰 Install dependencies

Navigate to the root or `login-portal/` directory and run:

```bash
cd login-portal
npm install
```

You may need to manually install:
```bash
npm install express path https fs
```

### 2. 🛡️ Start the local HTTPS server

```bash
node server.js
```

Ensure `server.js` is configured to serve `https://onlinebanking.test.com:3443` using certs in the `ssl/` directory.

### 3. 🧪 Test the app

Visit:
```
https://onlinebanking.test.com:3443
```

You should see a login page with a **Login** button.

---

## 🔐 SAML Authentication Flow

### Step-by-step:

1. The user clicks **Login**
2. `sdk.authenticate(...)` calls Transmit CIAM with your appId and policyId
3. The Transmit server runs a policy that:
   - Authenticates the user
   - Generates a SAML assertion using `generateSamlToken(...)`
   - Stores the token in a `SAMLToken` cookie
4. Your frontend JavaScript:
   - Reads the `SAMLToken` from the cookie
   - Submits the token to the SP’s ACS endpoint (`https://sptest.iamshowcase.com/acs`)
5. The SP verifies the assertion and establishes the user session

---

## 🍪 Cookie Notes

- Cookie name: `SAMLToken`
- Must **not** be `HttpOnly` so frontend JavaScript can access it
- Recommended settings:
  - `path=/`
  - `Secure`
  - `SameSite=Strict`
  - `Max-Age` set appropriately (e.g., 15 minutes)

---

## 🧠 Debugging Tips

- Use `document.cookie` in DevTools Console to check for the token
- In Chrome: DevTools → Application → Cookies → select `onlinebanking.test.com`
- Test server TLS with:
```bash
curl -v https://onlinebanking.test.com:8813
```
- Check Java keystore with:
```bash
keytool -list -v -keystore server.jks -storepass [your-password]
```

---

## ✅ Credits

- Built with [Transmit CIAM SDK](https://developer.transmitsecurity.io/)
- ACS Endpoint provided by: [IAMShowcase](https://sptest.iamshowcase.com/instructions#start)

---

## 🧹 Optional Enhancements

- Add support for RelayState forwarding
- Handle SAML errors or expired assertions gracefully
- Auto logout after SAML handoff
- Multi-SP support (ACS routing)

---
