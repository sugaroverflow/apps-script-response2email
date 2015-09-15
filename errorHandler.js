
/*--------------------------------------------- ERROR LOG HANDLER----------------------------------------- */
/* Handles the logic for all the error logging functions */
/* Is called by logerror(e) */
function errorHandler(e){
  try{
    var ELID = ERROR_SHEET_ID; //temp for the errorsheet ID
    Logger.log("ELID01: " + ELID);
    // 1 - does the Error Log file exist
    if(doesELexist() == false) { // NO
      // 1.2n - create the Error Log
      Logger.log("ELID02: " + ELID);
      ELID = createErrorSheet();
      // 1.3n - set the ID
      Logger.log("ELID03: " + ELID);
      Logger.log("Setting ELID inside errorHandler()");
      setELID(ELID);
      // 1.4n - format the log
      Logger.log("ELID04: " + ELID);
      ELID = getELID();
      formatErrorHeaders(ELID);
      formatErrorCells(ELID);
    }
    else{ // YES
      // 1.2y - get the ID
      ELID = getELID();
      Logger.log("ELID05: " + ELID);
      // 1.3y - add the new error to the sheet (the parameter 'e' was passed)
      addError(ELID, e);
      formatErrorCells(ELID);
      // 1.4y - send an email for every new error logged
      sendErrorMail(ELID, e);
    }
  }
  catch(error){
    Logger.log("Execution Error in errorHandler(): " + error.message);
    //addError(error);
  }
}

/*--------------------------------------------- ERROR LOG FUNCTIONS----------------------------------------- */

/*
* Logs the error
* by passing it to the errorHandler
*/
function logError(e){
  try{
    errorHandler(e);
  }
  catch(error){
    Logger.log("Execution Error: logError() failed" + error.message);
    logError(error);
  }
}


/*
* sends an email for every new error logged
*/
function sendErrorMail(ELID, error){
  var admin = 'fatima.khalid@boston.gov';
    var subject = 'Google Scripts Error-->' + PROJECT_TITLE;
    var errorss = SpreadsheetApp.openById(ELID);
    ERROR_SHEET_URL = 'https://docs.google.com/spreadsheets/d/' + ELID;
    try{
      var body = "<h3>An error occurred!</h3>" +
           "\n\n Here are some details: <br /><br />" +
           "\n<strong>Project File:</strong> \t" + PROJECT_TITLE + '<br />' +
           "\n<strong>File Name:</strong> \t" + error.fileName + '<br />' +
           "\n<strong>Line Number:</strong> \t" + error.lineNum +
           "<br /><br />" +
           "\n<strong>Error Message:</strong> \t" + error.message +
           "<br /><br />" +
           "\n<strong>TimeStamp:</strong> \t" + new Date() +
           "<br /><br />" +
           "<a href=FORM_URL> Link to the form </a>" +
           "<br />" +
           "<a href='RESPONSES_URL'> Link to the Responses </a>" +
           "<br />" +
           "<a href='ERROR_SHEET_URL'> Link to the ErrorLog </a>";
      GmailApp.sendEmail(admin, subject, body, {htmlBody:body});
      Logger.log("Passed! in sendErrorMail")
   } catch(error){
       Logger.log("Execution Error: sendErrorMail failed: " + error.message)
       logError(error);
   }
}

/*
* Adds the error to the Error Log spreadsheet
*/
function addError(ELID, error){
try{
  var errorss = SpreadsheetApp.openById(ELID);
  var errorsheet = errorss.getActiveSheet();
  var lastcol = errorsheet.getLastColumn();
  var lastrow = errorsheet.getLastRow();
  Logger.log("the lastcol: " + lastcol + " and last row: " + lastrow);
  var cell = errorsheet.getRange(lastrow, lastcol);
  cell.offset(1, -4, 1, 1).setValue(error.fileName);
  cell.offset(1, -3, 1, 1).setValue(error.message);
  cell.offset(1, -2, 1, 1).setValue(error.lineNum);
  cell.offset(1, -1, 1, 1).setValue(new Date());
  cell.offset(1, 0, 1, 1).setBackground('#ff4c4c');
  Logger.log("Passed! in addError()");
}
catch(e){
  Logger.log("Execution error in addError(): " + e.message);
  logError(e);
}

}



/**
* Checks if the ErrorLog exists
*
* It searches through the given current directory folder
* and matches all the file names to "ErrorLog"
* returns true or false based on the return
*/
function doesELexist(){
  try{
      var files = DriveApp.getFolderById(CURR_DIR_ID).getFiles();
      while(files.hasNext()){
        var file = files.next();
        if(file.getName() == 'ErrorLog'){
          var fileid = file.getId();
          Logger.log("Setting ELID inside doesELexist()");
          setELID(fileid);
          return true; //if found
        }
        else{
          return false; //if not found
        }
      }
  }
  catch(error){
    Logger.log("Execution Error in doesELexist(): " + error.message);
    logError(error);
    return 0;
  }
}

/*
* Sets the value of the EL
*/
function setELID(value){
  try{
    ERROR_SHEET_ID = value;
    Logger.log("Passed! in setELID()");
  }
  catch(error){
    Logger.log("Execution error in setELID(): " + error.message);
    logError(error);
    return 0;
  }
}

/*
* Gets the value of the EL
*/
function getELID(){
  try{
    if(ERROR_SHEET_ID != ''){
      Logger.log("Passed! in getELID()");
      return ERROR_SHEET_ID;
    }
    else{
      Logger.log("Error in getELID(); ERROR_SHEET_ID is undef / running doesELexist()");
      doesELexist();
      Logger.log("Is the Error resolved now?: " + ERROR_SHEET_ID );
      return ERROR_SHEET_ID;
    }
  }
  catch(error){
      Logger.log("Execution Error in getELID(): " + error.message + " / running doesELexist()");
      doesELexist();
      Logger.log("Is the Error resolved now?: "  + ERROR_SHEET_ID );
      return ERROR_SHEET_ID;
  }
}

/**
* Creates the ErrorLog sheet in the same directory
*
* It creates the log in the root directory, copies it to the current dir
* and then deletes the original (yes, this is a workaround)
* sends the errorlog ID to the format function
*/
function createErrorSheet(){
    try{
      var sheet = SpreadsheetApp.create("ErrorLog");
      var folder = DriveApp.getFolderById(CURR_DIR_ID);
      var errorsheet = DriveApp.getFileById((sheet.getId())).makeCopy("ErrorLog", folder);
      DriveApp.getFileById(sheet.getId()).setTrashed(true);
      errorsheet_id = errorsheet.getId();
      Logger.log("Passed! in createErrorSheet");
      return errorsheet_id;
    }
    catch(error){
       Logger.log("Execution Error: createErrorSheet() failed: " + error.message + " in createErrorSheet");
       logError(error);
       return 0;
    }
}

/**
* Formats the ErrorLog using the ID
*
*/
function formatErrorHeaders(ELID){
  try{
  Logger.log("ErrorSheetId; " + ELID);
    var errorsheet = SpreadsheetApp.openById(ELID);
    var headers = [ERROR_LOG_HEADERS];
    //format the headers

    errorsheet.getDataRange().offset(0, 0, 0, 5).setValues(headers) //hard-coded
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setBackground('#326282')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');
    Logger.log("Passed! in formatErrorHeaders()");
  }
  catch(error){
    Logger.log("Execution Error in formatErrorHeaders: " + error.message);
    logError(error);
    return 0;
  }
}

/**Format the ErrorLog cells**/
function formatErrorCells(ELID){
  try{
    var esheet = SpreadsheetApp.openById(ELID);
    esheet.getDataRange().setWrap(true);
    Logger.log("Passed! in formatErrorCells()");
  }
  catch(error){
    Logger.log("Execution Error in formatErrorCells() : " + error.message);
    logError(error);
    return 0;
  }
}
