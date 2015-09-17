/*--------------These are helper functions*/
/*This means that they are helpful for debugging for building upon the project but are not directly called in the execution flow */

/**
 * Queries the form DocumentProperties to determine whether the formResponse
 * trigger is enabled or not.
 *
 * @return {Boolean} True if the form submit trigger is enabled; false
 *     otherwise.
 */
function getTriggerState() {
  try{
    // Retrieve and return the information requested by the dialog.
    var properties = PropertiesService.getDocumentProperties();
    Logger.log("Trigger State: " + properties.getProperty('submitTrigger'));
    return properties.getProperty('submitTrigger') != null;
    }
    catch(error){
      Logger.log("*Error: getTriggerState(): " + error.message);
      errorEmail(error);
    }
}


/**
 * Handles the form trigger creation
 *
 * Determines the existing state of the trigger on the server
 * If a trigger does not exist, creates a onInstall trigger
 * If it exists, deletes all the triggers & the property.
 *
 */
function handleFormTrigger(enableTrigger){
  try{
    enableTrigger = true; //false if we don't want a trigger, true if we do
    var form = FormApp.getActiveForm();
    var properties = PropertiesService.getDocumentProperties();
    var submitTrigger = properties.getProperty('submitTrigger');
    // if trigger needs to be OFF and trigger exists
    if (!enableTrigger && submitTrigger != null) {
      Logger.log("Trigger exists so delete it");
      // Delete the existing trigger.
      var triggers = ScriptApp.getUserTriggers(form);
      for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].getUniqueId() == submitTrigger) {
          ScriptApp.deleteTrigger(triggers[i]);
          break;
        }
      }
    properties.deleteProperty('submitTrigger');
    }
    // if trigger needs to be ON and trigger doesn't exist
    else if (enableTrigger && submitTrigger == null) {
    Logger.log("Trigger doesn't exist so create it");
      // Create a new trigger.
      var trigger = ScriptApp.newTrigger('triggerEmail')
          .forForm(form)
          .onFormSubmit()
          .create();
      properties.setProperty('submitTrigger', trigger.getUniqueId());
    }
  Logger.log("handleFormTrigger() passed!");
  }
  catch(error){
    Logger.log("*Error: handleFormTrigger(): " + error.message + " " + error.lineNum);
    errorHandler(error);
  }
}
