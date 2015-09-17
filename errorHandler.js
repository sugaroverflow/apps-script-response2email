
/**
 * Creates the ErrorLog sheet in the same directory
 *
 * (assumes that EL does not exist)
 * Since DriveApp.createFile can't create a MimeType of GOOGLE_SHEETS (reported bug)
 * This is a workaround to create an ErrorLog in the same directory
 */
function createEL(){
    try{
      var sheet = SpreadsheetApp.create(ERROR_LOG_TITLE);
      var folder = DriveApp.getFolderById(CURR_DIR_ID); //open folder
      var errorsheet = DriveApp.getFileById((sheet.getId())).makeCopy(ERROR_LOG_TITLE, folder); //make copy
      DriveApp.getFileById(sheet.getId()).setTrashed(true); //delete original
      var properties = PropertiesService.getDocumentProperties(); //init props
      var eprop = properties.setProperty('EL', errorsheet.getId()); //add ELID as EL prop
      formatErrorHeaders(); //format the headers using the EL prop
      Logger.log("Passed! in createEL()");
    }
    catch(error){
       Logger.log("*Error: createErrorSheet(): " + error.message + " in createErrorSheet");
      errorHandler(error)
    }
}


/**
 * Queries the current directory to see if an Error Log file exists
 *
 * @return {Boolean} based on existence
 */
function foundEL(){
  try{
      var found = false;
      var files = DriveApp.getFolderById(CURR_DIR_ID).getFiles();
      while(files.hasNext()){
        var file = files.next();
        if(file.getName() == ERROR_LOG_TITLE){
           ERROR_SHEET_ID = file.getId();
           found = true;
           break;
        }
      }
      Logger.log("foundEl returning: " + found);
      Logger.log("foundEl() passed!");
      return found

  }
  catch(error){
    Logger.log("*Error: foundEL: " + error.message);
    errorHandler(error)
  }
}

/**
 * Queries the document to see if a property exists for errorsheet
 *
 * @return {Boolean} based on existence
 */
function foundProp(){
  try{
    var properties = PropertiesService.getDocumentProperties();
    Logger.log("foundProp() returning: " + (properties.getProperty('EL') != null));
    Logger.log("foundProp() passed!");
    return properties.getProperty('EL') != null;
  }
  catch(error){
    Logger.log("Retrieval Error: foundProp failed because: " + error.message);
    errorHandler(error)
  }
}

/**
 * Queries the properties to grab the EL value
 *
 * @return {Integer} value of the 'EL' key
 */
function getProp(){
  try{
      var properties = PropertiesService.getDocumentProperties();
      return properties.getProperty('EL');
  }
  catch(error){
    Logger.log("*Error: getProp: " + error.message);
    errorHandler(error)
  }
}

/**
 * checks if EL and it's property exist
 *
 * @return {Boolean} based on the existence of EL (and it's property)
 *
 * return 0 is a weird edge case / impossible but for testing
 * (ELfound && !Pfound) is not handled because it's a use case that should be impossible
 * handling this would require the ERROR_SHEET_ID
 */
function exists(){
  try{
      var ELfound = foundEL();
      var Pfound = foundProp();
      if (ELfound && Pfound){
        Logger.log("EXISTS() returning true");
        return true;
      }
      else if (!ELfound && Pfound){
        //delete prop
        var properties = PropertiesService.getDocumentProperties();
        properties.deleteProperty('EL');
        return true;
      }
      else if (!ELfound && !Pfound){
        Logger.log("false");
        return false;
      }
      else {
        Logger.log("WEIRD CASE");
        return 0;
      }
   Logger.log("exists() passed!");
  }
  catch(error){
    Logger.log("*Error: testForEL(): " + error.message);
    errorHandler(error)
  }
}

/**
 * errorHandler()
 *
 * if the EL doesn't exist, it calls to create it
 * add the error
 * and format the error cells
 */
function errorHandler(e){
  try{
      var itExists = exists();
      if (!itExists){
        createEL();
      }
      addError(e);
      formatErrorCells();
    Logger.log("errorHandler passed!");
  }
  catch(error){
    Logger.log("*Error: errorHandler(): " + error.message);
    errorHandler(error);
  }
}


/**
 * Adds the error to the EL
 *
 * uses the getProp() to get the ELID
 * and adds the error using getLastRow
 * finally calls formaterrorcells
 */
function addError(error){
  try{
      var ELID = getProp();
      var errorsheet = SpreadsheetApp.openById(ELID).getActiveSheet();
      //set up
      var lastcol = errorsheet.getLastColumn();
      var lastrow = errorsheet.getLastRow();
      var cell = errorsheet.getRange('A1');
      //compute
      Logger.log("last (row, col) : (" + lastrow + "," + lastcol + ")");
      //cell.offset(rowOffset, columnOffset, numRows, numColumns)
      cell.offset(lastrow, 0).setValue(error.fileName); //filename
      cell.offset(lastrow, 1).setValue(error.message); //errormessage
      cell.offset(lastrow, 2).setValue(error.lineNum); //linenum
      cell.offset(lastrow, 3).setValue(new Date()); //timestamp
      cell.offset(lastrow, 4).setBackground('#ff4c4c'); //fixed
      errorEmail(error); //call this to send the error alert mail
      Logger.log("addError passed!");
  }
  catch(error){
    Logger.log("*Error: addError(): " + error.message);
    execErrorMail(error);
  }
}


/**
 * Formats the ErrorLog
 *
 */
function formatErrorHeaders(){
  try{
    var ELID = getProp();
    var errorsheet = SpreadsheetApp.openById(ELID).getActiveSheet();
    var datarange = errorsheet.getRange(1, 1, 1, 5)
    .setValues([ERROR_LOG_HEADERS])
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setBackground('#326282')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');
    Logger.log("formatErrorHeaders() passed!");
  }
  catch(error){
    Logger.log("*Error: formatErrorHeaders(): " + error.message);
    errorHandler(error)
  }
}

/**
 * Formats the ErrorLog cells
 *
 */
function formatErrorCells(){
  try{
    var ELID = getProp();
    var errorsheet = SpreadsheetApp.openById(ELID).getActiveSheet();
    var datarange = errorsheet.getDataRange().offset(1, 0).setWrap(true);
    Logger.log("formatErrorCells() passed!");
  }
  catch(error){
    Logger.log("*Error: formatErrorCells(): " + error.message);
    errorHandler(error)
  }
}



/**
 * Handles the general error email
 *
 * this email is sent after addError() is successfully called
 * @param {Object} e The event parameter created by a form
 */
function errorEmail(e){
    var admin = ADMIN_EMAIL;
    var subject = 'Google Scripts Error Alert: ' + SCRIPT_TITLE;
    try{
      var ELID = getProp();
      var urlEL = 'https://docs.google.com/spreadsheets/d/' + ELID;
      var body = "<p>Your script, " + SCRIPT_TITLE +" has failed to finish successfully. This failure has been added to the " + "<a href="+urlEL+">ErrorLog</a>" + ".</p>" +
             "<p>This script is used by the form " + "<a href="+FORM_URL+">"+FORM_TITLE+"</a>" + ". The Responses are " + "<a href="+RESPONSES_URL+">here</a>" + ".</p>" +

             "<p> A summary of the failure is shown below.</p>" +
               "<table style='border:1px solid black; border-collapse: collapse;'>\
                <tr><th style='text-align:left; border:1px solid #807e7f; font-weight:bold; padding: 2px'>Timestamp</th>\
                <th style='text-align:left; border:1px solid #807e7f; font-weight:bold; padding: 2px'>File Name</th>\
                <th style='text-align:left; border:1px solid #807e7f; font-weight:bold; padding: 2px'>Line Number</th>\
                <th style='text-align:left; border:1px solid #807e7f; font-weight:bold; padding: 2px'>Error Message</th></tr>\
                <tr><td style='text-align:left; border:1px solid #807e7f; padding: 2px'>"+new Date()+"</td>\
                <td style='text-align:left; border:1px solid #807e7f; padding: 2px'> "+e.fileName+"</td>\
                <td style='text-align:left; border:1px solid #807e7f; padding: 2px'>"+e.lineNumber+"</td>\
                <td style='text-align:left; border:1px solid #807e7f; padding: 2px'>"+e.message+"</td></tr>\
                </table>"
      GmailApp.sendEmail(admin, subject, body, {htmlBody:body});
      Logger.log("errorEmail() passed!")
   }
   catch(error){
       Logger.log("*Error: errorEmail(): " + error.message);
       execErrorMail(error);
       return 0;
   }
}

/**
 * Handles the direct  email / execution error email
 *
 * this email is sent when addError() triggerEmail() or errorEmail() fail
 * this is more of an urgent alert because those are key functions
 */
function execErrorMail(e){
    var admin = ADMIN_EMAIL;
    var subject = 'Google Scripts Error Alert: (Execution) ' + SCRIPT_TITLE;
    try{
      var ELID = getProp();
      var urlEL = 'https://docs.google.com/spreadsheets/d/' + ELID;
      var body = "<p>Your script, " + SCRIPT_TITLE +" has encounted a FATAL ERROR. This failure may have caused the script to stop running." + "</p>" +
             "<p>This script is used by the form " + "<a href="+FORM_URL+">"+FORM_TITLE+"</a>" + ". The Responses are " + "<a href="+RESPONSES_URL+">here</a>" + ".</p>" +
             "<p>It would also be a good idea to check the " + "<a href="+urlEL+">ErrorLog</a>" + ".</p>" +
             "<p> A summary of the failure is shown below.</p>" +
               "<table style='border:1px solid black; border-collapse: collapse;'>\
                <tr><th style='text-align:left; border:1px solid #807e7f; font-weight:bold; padding: 2px'>Timestamp</th>\
                <th style='text-align:left; border:1px solid #807e7f; font-weight:bold; padding: 2px'>File Name</th>\
                <th style='text-align:left; border:1px solid #807e7f; font-weight:bold; padding: 2px'>Line Number</th>\
                <th style='text-align:left; border:1px solid #807e7f; font-weight:bold; padding: 2px'>Error Message</th></tr>\
                <tr><td style='text-align:left; border:1px solid #807e7f; padding: 2px'>"+new Date()+"</td>\
                <td style='text-align:left; border:1px solid #807e7f; padding: 2px'> "+e.fileName+"</td>\
                <td style='text-align:left; border:1px solid #807e7f; padding: 2px'>"+e.lineNumber+"</td>\
                <td style='text-align:left; border:1px solid #807e7f; padding: 2px'>"+e.message+"</td></tr>\
                </table>"

      GmailApp.sendEmail(admin, subject, body, {htmlBody:body});
      Logger.log("execErrorMail() passed!")
      return 0;
   }
   catch(error){
       Logger.log("*Error: execErrorMail(): " + error.message);
       execErrorMail(error);
   }
}
