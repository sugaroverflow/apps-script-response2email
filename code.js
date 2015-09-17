/**
* @NotOnlyCurrentDoc
*/

/*--------------------------- Global Variables -----------------------------------*/
/*--------------THESE NEED TO BE CHANGED FOR EACH PROJECT-------------------------*/
var SCRIPT_TITLE = "TITLE OF YOUR SCRIPT HERE";
var FORM_TITLE ="TITLE OF YOUR FORM HERE";
var ERROR_LOG_TITLE = 'ErrorLog: ' + SCRIPT_TITLE;
var ADMIN_EMAIL = 'ADMIN EMAIL HERE';
var WEBMASTER_EMAIL = 'SECONDARY EMAIL HERE';

/*URLS*/

//this is a link to the current folder directory
var CURR_DIR_URL = ' CURRENT GOOGLE DRIVE DIRECTORY URL';
//this is a link to the FORM
var FORM_URL = ' THE URL TO THE FORM ';
//this is a link to the FORM RESPONSES spreadsheet
var RESPONSES_URL = ' THE URL TO THE RESPONSES OF THE FORM';


/* IDS */

//this is the id= portion of the FOLDER URL
var CURR_DIR_ID =' DIRECTORY ID ';
//this is the id= portion of the FORM URL
var FORM_ID = ' FORM ID ';
//this is the id= portion of the RESPONSES URL
var RESPONSES_ID = ' RESPONSES ID';


/* DON'T TOUCH */
// these are placeholders for logic for the Error Logging
// YOU CAN CHANGE THESE PLACEHOLDERS BUT YOU'LL HAVE TO CHANGE THE ADDERROR() SETUP TO MATCH
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
