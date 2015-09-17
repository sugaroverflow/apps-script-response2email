/**
* @NotOnlyCurrentDoc
*/

/*--------------------------- Global Variables -----------------------------------*/
/*--------------THESE NEED TO BE CHANGED FOR EACH PROJECT-------------------------*/
var SCRIPT_TITLE = "Response2Email";
var FORM_TITLE ="DoIt Creative Brief";
var ERROR_LOG_TITLE = 'ErrorLog: ' + SCRIPT_TITLE;
var ADMIN_EMAIL = 'digital@boston.gov';
var WEBMASTER_EMAIL = 'cityboswebmaster@gmail.com';

/*URLS*/

//this is a link to the current folder directory
var CURR_DIR_URL = 'https://drive.google.com/a/boston.gov/folderview?id=0B74lDxO3Qp2VS2VfcFBsR1llcnM&usp=sharing';
//this is a link to the FORM
var FORM_URL = 'https://docs.google.com/a/boston.gov/forms/d/1NswnCsh7UlXpk8cgp8uPsuWpNGqGmpA-fna2Zrk72lg';
//this is a link to the FORM RESPONSES spreadsheet
var RESPONSES_URL = 'https://docs.google.com/a/boston.gov/spreadsheets/d/1qjkQgjfVc4RNjeINgpz5i6mH-yyX-QzJV1PW7NKmT0Y';


/* IDS */

//this is the id= portion of the FOLDER URL
var CURR_DIR_ID ='0B74lDxO3Qp2VS2VfcFBsR1llcnM';
//this is the id= portion of the FORM URL
var FORM_ID = '1NswnCsh7UlXpk8cgp8uPsuWpNGqGmpA-fna2Zrk72lg';
//this is the id= portion of the RESPONSES URL
var RESPONSES_ID = '1qjkQgjfVc4RNjeINgpz5i6mH-yyX-QzJV1PW7NKmT0Y';


/* DON'T TOUCH */
// these are placeholders for logic for the Error Logging
var ERROR_LOG_HEADERS = ['FileName', 'ErrorMessage', 'LineNum', 'TimeStamp', 'Fixed?'];
var ERROR_SHEET_ID = '';
var ERROR_SHEET_URL = '';

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Runs when the form is opened
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen() {
  //try/catch to log exec errors
  try{
    /* Opening the necessary sheets/docs (on the server) */
    var responses = SpreadsheetApp.openById(RESPONSES_ID); // open the form responses
    var form = FormApp.openById(FORM_ID); // open the form
    var folder = DriveApp.getFolderById(CURR_DIR_ID); //open the current folder
  }
  catch(error){
    Logger.log("*Error: OnOpen(): " + error.message);
    errorHandler(error);
  }
}
