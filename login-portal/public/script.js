import { XmSdk } from "./sdk/xmsdk-es6-v8.js";
import { PlainUIHandler } from "./sdk/plainuihandler.js";
var loginButton = document.getElementById("login-btn");
var clearButton = document.getElementById("clear-btn");
var sdk = XmSdk();
var appId = "web";
var policyId = "samlwebapppoc";
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
function onLogin() {
  sdk
    .authenticate(userId, policyId, {}, clientContext)
    .then(function (result) {
      // 🔐 Read the samlToken from the cookie set by the Transmit server
      const samlToken = getCookie("SAMLToken");
      if (!samlToken) {
        alert("SAML token not found in cookie.");
        return;
      }
      // ✅ Construct the POST to the SP's ACS endpoint
      postToACS(samlToken);

      // Optionally logout after SAML flow starts
      sdk.logout().catch(console.error);
      sdk
        .logout()
        .then(function (result) {
          console.log(result);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {});
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
function postToACS(samlToken) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://sptest.iamshowcase.com/acs";

  const samlField = document.createElement("input");
  samlField.type = "hidden";
  samlField.name = "SAMLResponse";
  samlField.value = samlToken;
  form.appendChild(samlField);

  const relayState = document.createElement("input");
  relayState.type = "hidden";
  relayState.name = "RelayState";
  relayState.value = ""; // optional
  form.appendChild(relayState);

  document.body.appendChild(form);
  form.submit();
}

sdk.setUiHandler(new PlainUIHandler());
