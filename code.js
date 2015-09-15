/**
* @NotOnlyCurrentDoc
*/

/*--------------------------- Global Variables -----------------------------------*/
/*--------------THESE NEED TO BE CHANGED FOR EACH PROJECT-------------------------*/

var PROJECT_TITLE = "Testing Creative Brief Copy";
var CURR_DIR_ID = "0B74lDxO3Qp2VcnNHeEh0cjhLN1E";
var FORM_ID = "1ojLtk0tYMYO0YOtbyG7Yg4JcpP_W_iLLWMNxyGML0RU";
var FORM_URL = 'https://docs.google.com/a/boston.gov/forms/d/1ojLtk0tYMYO0YOtbyG7Yg4JcpP_W_iLLWMNxyGML0RU/';
var RESPONSES_ID = "15REcrAb2kAIvJgx7LLjVtXqApgP8mFC32Q_J-gA8A44"
var RESPONSES_URL = '15REcrAb2kAIvJgx7LLjVtXqApgP8mFC32Q_J-gA8A44';
var ERROR_LOG_HEADERS = ['ScriptName', 'ErrorMessage', 'LineNum', 'TimeStamp', 'Fixed?'];
var ERROR_SHEET_ID = '';
var ERROR_SHEET_URL = '';




/*--------------------------- onInstall, onOpen() -----------------------------------*/
/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately (like authorization)
 */
function onInstall(e) {
  onOpen();
}

/*
 * Runs when the form is opened
 */
function onOpen() {
  //try/catch to log exec errors
  try{
    /* Opening the necessary sheets/docs (on the server) */
    var responses = SpreadsheetApp.openById(RESPONSES_ID); // open the form responses
    var form = FormApp.openById(FORM_ID); // open the form
    var folder = DriveApp.getFolderById(CURR_DIR_ID); //open the current folder
    /* Setup functions */
    Logger.log("Running createFormTrigger():");
    breakingthetest();
    createFormTrigger(); //create the formsubmit trigger
  }
  catch(error){
    Logger.log("Execution Error: OnOpen() failed: " + error.message);
    //log to errorsheet
    Logger.log("Logging the error from OnOpen() to errorHandler()");
    logError(error);
    return 0;
  }
}
