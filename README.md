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
  - Certs and keys are provided, but you can generate your own in the `ssl` diretory and import the CA/Root to your local machine to avoid errors.
- Host entries or DNS mapped to `127.0.0.1` for local testing

---

## 🧱 Project Structure

```
/login-portal
├── public/
│   ├── index.html            # Landing page with login UI
│   ├── sdk/                  # Transmit Web SDK (ES6 version)
│   └── script.js             # SDK initialization and SAML POST logic
├── server.js                 # Express server with HTTPS config
├── certs/
│   ├── server.key            # Private key for TLS
│   └── server.crt            # Certificate with SANs for your domain
└── README.md                 # This file
```

---

## 🚀 Setup Instructions

### 1. 🧰 Install dependencies

```bash
npm install
npm install express
npm install path
npm install https
npm install fs
```

### 2. 🛡️ Start the local HTTPS server

```bash
node server.js
```

Ensure `server.js` is configured to serve `https://onlinebanking.test.com:3443` using your TLS certs.

### 3. 🧪 Test the app

Navigate to:
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
   - Sends a response to your frontend
4. Your JavaScript:
   - Extracts the `SAMLToken` from the cookie
   - Builds and auto-submits a form to the SP's ACS endpoint (`https://sptest.iamshowcase.com/acs`)
5. The SP processes the assertion and logs the user in

---

## 🔧 Sample Transmit Policy Snippet

```ts
const samlToken = generateSamlToken(...);

response.setCookie("SAMLToken", samlToken, {
  path: "/",
  secure: true,
  sameSite: "Strict",
  maxAge: 900
});

samlResponse.send({
  acs_url: "https://sptest.iamshowcase.com/acs",
  saml_response: samlToken,
  relay_state: ""
});
```

---

## 🍪 Cookie Notes

- Cookie name: `SAMLToken`
- Must be readable by JS (`HttpOnly` must NOT be set)
- Should be scoped to `/`, marked as `Secure`, and `SameSite=Strict`

---

## 🧠 Debugging Tips

- Use `document.cookie` to verify the presence of `SAMLToken`
- Check browser dev tools → Application → Cookies → `onlinebanking.test.com`
- Use `curl -v https://onlinebanking.test.com:8813` to test TLS
- Use `keytool -list -v -keystore server.jks` to inspect keystore alias

---

## ✅ Credits

- Built with [Transmit CIAM SDK](https://developer.transmitsecurity.io/)
- Sample SP ACS: [IAMShowcase](https://sptest.iamshowcase.com/instructions#start)

---

## 🧹 Optional Enhancements

- Add support for RelayState forwarding
- Display loading screen during token submission
- Log out of Transmit automatically after POST
- Handle multiple SP destinations

---
