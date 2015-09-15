/**
 * Queries the form DocumentProperties to determine whether the formResponse
 * trigger is enabled or not.
 *
 * @return {Boolean} True if the form submit trigger is enabled; false
 *     otherwise.
 */
function getTriggerState() {
  // Retrieve and return the information requested by the dialog.
  var properties = PropertiesService.getDocumentProperties();
  return properties.getProperty('triggerId') != null;
}



/**
 * Turns the form submit trigger on or off based on the given argument.
 *
 * @param {Boolean} enableTrigger whether to turn on the form submit
 *     trigger or not
 */
function adjustFormSubmitTrigger(enableTrigger) {
  // Determine existing state of trigger on the server.
  var form = FormApp.getActiveForm();
  var properties = PropertiesService.getDocumentProperties();
  var triggerId = properties.getProperty('triggerId');

  if (!enableTrigger && triggerId != null) {
    // Delete the existing trigger.
    var triggers = ScriptApp.getUserTriggers(form);
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getUniqueId() == triggerId) {
        ScriptApp.deleteTrigger(triggers[i]);
        break;
      }
    }
    properties.deleteProperty('triggerId');
  } else if (enableTrigger && triggerId == null) {
    // Create a new trigger.
    var trigger = ScriptApp.newTrigger('respondToFormSubmit')
        .forForm(form)
        .onFormSubmit()
        .create();
    properties.setProperty('triggerId', trigger.getUniqueId());
  }
}

/**
 * Responds to form submit events if a form summit trigger is enabled.
 * Collects some form information and sends it as an email to the form creator.
 *
 * @param {Object} e The event parameter created by a form
 *      submission; see
 *      https://developers.google.com/apps-script/understanding_events
 */
function respondToFormSubmit(e) {
  if (MailApp.getRemainingDailyQuota() > 0) {
    var form = FormApp.getActiveForm();
    var message = 'There have been ' + form.getResponses().length +
        ' response(s) so far. Latest Response:\n';
    var itemResponses = e.response.getItemResponses();
    for (var i = 0; i < itemResponses.length; i++) {
      var itemTitle = itemResponses[i].getItem().getTitle();
      var itemResponse = JSON.stringify(itemResponses[i].getResponse());
      message += itemTitle + ': ' + itemResponse + '\n';
    }
    MailApp.sendEmail(
        Session.getEffectiveUser().getEmail(),
        'Form response received for form ' + form.getTitle(),
        message,
        {name: 'Forms Add-on Template'});
  }
}
