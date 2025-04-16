import { PlainPassAuthSession } from "./plainPassword.js";
//import { OtpAuthSession } from "./otp.js";
var PlainUIHandler = /** @class */ (function () {
  function PlainUIHandler() {}
  PlainUIHandler.prototype.processJsonData = function (
    jsonData,
    actionContext,
    clientContext
  ) {
    //your code here
    alert(JSON.stringify(jsonData));
    return new Promise(function (resolve, reject) {
      resolve(com.ts.mobile.sdk.JsonDataProcessingResult.create(true));
    });
  };
  PlainUIHandler.prototype.createPasswordAuthSession = function (
    title,
    username
  ) {
    return new PlainPassAuthSession(title, username);
  };
  PlainUIHandler.prototype.controlOptionForCancellationRequestInSession =
    function (validOptions, session) {
      return new Promise(function (resolve, reject) {
        var controlRequest = com.ts.mobile.sdk.ControlRequest.create(
          com.ts.mobile.sdk.ControlRequestType.AbortAuthentication
        );
        resolve(controlRequest);
      });
    };
  PlainUIHandler.prototype.handlePolicyRejection = function (
    title,
    text,
    buttonText,
    failureData,
    actionContext,
    clientContext
  ) {
    this.clientContext = clientContext;
    if (failureData.reason.data.userAuthInfo) {
      this.clientContext = {
        userAuthInfo: failureData.reason.data.userAuthInfo,
      };
    }
    //console.log(clientContext);
    return new Promise(function (resolve, reject) {
      resolve(com.ts.mobile.sdk.ConfirmationInput.create(-1));
    });
  };
  PlainUIHandler.prototype.handlePolicyRedirect = function (
    redirectType,
    policyId,
    userId,
    additionalParameters,
    clientContext
  ) {
    return new Promise(function (resolve, reject) {
      console.log("redirecting to policy " + policyId);
      resolve(
        com.ts.mobile.sdk.RedirectInput.create(
          com.ts.mobile.sdk.RedirectResponseType.RedirectToPolicy
        )
      );
    });
  };
  PlainUIHandler.prototype.createOtpAuthSession = function (
    title,
    username,
    possibleTargets,
    autoExecedTarget
  ) {
    console.log();
    return new OtpAuthSession(
      title,
      username,
      possibleTargets,
      autoExecedTarget
    );
  };
  // handlePolicyRejection(
  //   title: string | null,
  //   text: string | null,
  //   buttonText: string | null,
  //   failureData: object | null,
  //   actionContext: com.ts.mobile.sdk.PolicyAction | null,
  //   clientContext: object | null
  // ): Promise<com.ts.mobile.sdk.ConfirmationInput> {
  //   return new Promise((resolve, reject) => {
  //     resolve(com.ts.mobile.sdk.ConfirmationInput.create(-1));
  //   });
  // }
  PlainUIHandler.prototype.startActivityIndicator = function (
    actionContext,
    clientContext
  ) {};
  PlainUIHandler.prototype.endActivityIndicator = function (
    actionContext,
    clientContext
  ) {};
  PlainUIHandler.prototype.controlFlowStarting = function (clientContext) {};
  PlainUIHandler.prototype.controlFlowEnded = function (
    error,
    clientContext
  ) {};
  PlainUIHandler.prototype.controlFlowActionStarting = function (
    actionContext,
    clientContext
  ) {};
  PlainUIHandler.prototype.controlFlowActionEnded = function (
    error,
    actionContext,
    clientContext
  ) {};
  return PlainUIHandler;
})();
export { PlainUIHandler };
