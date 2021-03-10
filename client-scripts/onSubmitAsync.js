// Template for async catalog item submission.

function onSubmit() {
  // Just in case something unexpected happens, don't submit.
  try {

    // User clicked submit if the scratchpad is empty
    if (g_scratchpad.validationResponse === undefined) {
      var requester = g_form.getValue('requested_for');
      var type = g_form.getValue('type');

      var gajax = new GlideAjax('VoidAppUtil');
      gajax.addParam('sysparm_name', 'validateAppSubmit');
      gajax.addParam('sysparm_requester', requester);
      gajax.addParam('sysparm_type', type);

      gajax.getXMLAnswer(function callBack(response) {
        g_scratchpad.validationResponse = JSON.parse(response);
        var actionName = g_form.getActionName();
        g_form.submit(actionName);
      });

      return false;
    }

    // If we got here, the script was entered via async callback
    var response = g_scratchpad.validationResponse;

    // Clean the scratchpad to prevent infinite loops.
    g_scratchpad.validationResponse = undefined;

    // Safeguard against not being able to call server
    if (response === null) {
      throw 'Unable to contact server.';
    }

    // Show all error messages.
    if (response.isSuccess === false) {
      response.messages.forEach(function (message) {
        g_form.addErrorMessage(message);
      });
    }

    return response.isSuccess;
  } catch (ex) {
    g_form.addErrorMessage('Something unexpected happened. Please contact the Service Desk.');
    return false;
  }
}
