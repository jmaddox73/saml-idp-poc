import { XmSdk } from "./sdk/xmsdk-es6-v8.js";
import { PlainUIHandler } from "./sdk/plainuihandler.js";
var loginButton = document.getElementById("login-btn");
var clearButton = document.getElementById("clear-btn");
var sdk = XmSdk();
var appId = "samlwebapppoc";
var policyId = "samlweb";
var userId = " user10009";
var connSettings = com.ts.mobile.sdk.SDKConnectionSettings.create(
  "https://onlinebanking.test.com:8813",
  appId,
  "",
  ""
);
var clientContext = {};
//sdk.setLogLevel(com.ts.mobile.sdk.LogLevel.Debug);
sdk.setConnectionSettings(connSettings);
// error handle function
function handleSdkError(error) {
  alert("Error: " + error.getMessage());
  if (error.getData()) {
    console.error(JSON.stringify(error.getData()));
  }
}
///////////////////////////////
sdk
  .initialize()
  .then(function () {
    loginButton.addEventListener("click", () => {
      console.log("Login triggered");
      onLogin();
    });
    clearButton.addEventListener("click", () => {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie =
          name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      alert("Local storage, session storage, and cookies cleared.");
    });
  })
  .catch(function (error) {
    handleSdkError;
  });
////////
////////
// Handles login logic using Transmit SDK, and initiates SAML POST to SP
function onLogin() {
  sdk
    .authenticate(userId, policyId, {}, clientContext) // 🔐 Step 1: Initiate Transmit authentication with configured policy
    .then(function (result) {
      // 🔐 Step 2: After successful authentication, retrieve the SAML token (assertion)
      // Note: the actual SAML assertion is NOT returned in `result.getToken()` — it was set by the Transmit server as a cookie
      const samlToken = getCookie("SAMLToken");

      // 🚫 If no token is found, alert the user (likely means server didn't set cookie or it was blocked)
      if (!samlToken) {
        alert("SAML token not found in cookie.");
        return;
      }

      // ✅ Step 3: POST the SAML token to the SP's Assertion Consumer Service (ACS) endpoint
      // This is the core of the SAML IdP-initiated flow — the assertion is delivered to the SP
      postToACS(samlToken);

      // 🔓 Step 4: Optionally logout the user from Transmit after the SAML flow begins
      // This helps prevent leftover session state if you're doing single-use SAML flows
      sdk.logout().catch(console.error);
    })
    .catch(function (error) {
      // Handle authentication errors
      console.error("Authentication failed:", error);
    });
}

// 🍪 Utility function to retrieve a named cookie (used to get the SAML token set by the Transmit IdP server)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// 📤 Constructs and submits an HTML form to the SP's ACS endpoint, delivering the SAML assertion
function postToACS(samlToken) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://sptest.iamshowcase.com/acs"; // 🏁 SP's Assertion Consumer Service (ACS) URL

  // 🔐 Include the base64-encoded SAMLResponse in the form (required by SAML spec)
  const samlField = document.createElement("input");
  samlField.type = "hidden";
  samlField.name = "SAMLResponse";
  samlField.value = samlToken;
  form.appendChild(samlField);

  // 🔄 Optional: Include RelayState to preserve app context or flow state
  const relayState = document.createElement("input");
  relayState.type = "hidden";
  relayState.name = "RelayState";
  relayState.value = ""; // You can include a URL, session ID, etc.
  form.appendChild(relayState);

  // 🚀 Submit the form to the SP — this completes the IdP-initiated SAML flow
  document.body.appendChild(form);
  form.submit();
}

sdk.setUiHandler(new PlainUIHandler());
