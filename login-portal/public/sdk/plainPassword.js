// export class PassAuthSession<
//   ResponseType extends com.ts.mobile.sdk.InputResponseType
// > implements com.ts.mobile.sdk.UIAuthenticatorSession<ResponseType>
//import { ModalAction } from "./modalScript.js";
//import { ErrorCount } from "./errorcount.js";
var PlainPassAuthSession = /** @class */ (function () {
  function PlainPassAuthSession(title, username) {
    this.title = title;
    this.username = username;
  }
  PlainPassAuthSession.prototype.startSession = function (
    description,
    mode,
    actionContext,
    clientContext
  ) {
    this.clientContext = clientContext;
    this.description = description;
    this.actionContext = actionContext;
    this.mode = mode;
    console.log(Object.keys(description));
    // console.log(this.description._locked);
    this.description = description;
    console.log("action context is " + this.actionContext);
    console.log("description is " + Object.getPrototypeOf(this.description));
    console.log("mode is " + JSON.stringify(this.mode));
  };
  //TODO: stuff
  //// required, not used in this POC /////
  PlainPassAuthSession.prototype.changeSessionModeToRegistrationAfterExpiration =
    function () {};
  /////////////////////////////////////
  PlainPassAuthSession.prototype.promiseRecoveryForError = function (
    //TODO: handle error failures
    error,
    validRecoveries,
    defaultRecovery
  ) {
    this.error = error;
    this.validRecoveries = validRecoveries;
    defaultRecovery = com.ts.mobile.sdk.AuthenticationErrorRecovery.Fail;
    return new Promise(function (resolve, reject) {
      resolve(com.ts.mobile.sdk.AuthenticationErrorRecovery.Fail);
    });
    //if (this.error.getData().additional_data.locked != true) {
    // Call function to display retries left in html i.e.
    //  "You Have this.error.getData().additional_data.retries_left attempts remaining"
    //return new Promise((resolve, reject) => {
    //  resolve(
    //    com.ts.mobile.sdk.AuthenticationErrorRecovery.RetryAuthenticator
    //  );
    //  });
    //  } else {
    //   return new Promise((resolve, reject) => {
    ///// cuustom ui, but must still return recovery. OR
    //// error object is returned to authenticat promise "catch",
    //// hand control back over to application with error object
    //   resolve(com.ts.mobile.sdk.AuthenticationErrorRecovery.Fail);
    //  });
    // }
  };
  ///////
  ///////////////////////////////////
  PlainPassAuthSession.prototype.promiseInput = function () {
    //TODO: move ui build into startSession
    var passwordForm = document.getElementById("passwordForm");
    if (passwordForm != null) {
      passwordForm.setAttribute("style", "display: block");
    }
    var passwordSubmitButton = document.getElementById("passwordSubmitButton");
    var cancelPasswordButton = document.getElementById("passwordCancelButton");
    if (passwordSubmitButton != null) {
      passwordSubmitButton.addEventListener("click", function () {
        var passwordInputField = document.getElementById("passwordInput");
      });
    }
    return new Promise(function (resolve, reject) {
      passwordSubmitButton.addEventListener("click", function () {
        var passwordInputField = document.getElementById("passwordInput");
        var password = passwordInputField.value;
        //let password = "test";
        //let password = ErrorCount.setPass();
        //console.log(password);
        var passwordInput = com.ts.mobile.sdk.PasswordInput.create(password);
        resolve(
          com.ts.mobile.sdk.InputOrControlResponse.createInputResponse(
            passwordInput
          )
        );
      });
      //// handle cancel action
      cancelPasswordButton.addEventListener("click", function () {
        // following method calls uihandler method controlOptionForCancellationRequestInSession
        // currently set to AbortAuthenticator
        var controlRequest = com.ts.mobile.sdk.ControlRequest.create(
          com.ts.mobile.sdk.ControlRequestType.CancelAuthenticator
        );
        resolve(
          com.ts.mobile.sdk.InputOrControlResponse.createControlResponse(
            controlRequest
          )
        );
      });
    });
  };
  PlainPassAuthSession.prototype.endSession = function () {};
  return PlainPassAuthSession;
})();
export { PlainPassAuthSession };
