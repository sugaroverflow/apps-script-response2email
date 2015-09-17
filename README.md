# onFormSubmit
This is a Google Apps Script that emails meaningful form submission data.
It has a built in error log manager

### Running the script
Open your Google Form. Navigate to Tools -> Script Editor. Create a new Blank project.
Create three files: errorHandler (Script File), scriptHandler (Script File), and helperFunctions(scriptFile).
Copy the respective code from this repo to the files (and for Code.gs too)

In the Code.gs file run OnInstall(e) to initialize authorization.
When an error occurs or someone submits the form, you can follow the execution flow in the Execution Transcript or the Logger log. I have left logs in each function for debugging. 

### Setting up your custom form + email 

- In Code.gs put in your custom URLS
- In scripthandler.gs -> triggerEmail(e) change the ``` var body ``` object. This object represents the message/body of the GmailApp.sendEmail() function. To start out, you could just output each of your responses from [0] and so on.. OR you could write a for loop and iteratively output each response. After that, you can consider templating them into a table or list.
```
e.response.getItemResponses()[0].getResponse()
```

If it helps, the current HTML will output like this:
#### The response email:

#### The error email:

### File & Function Structure
```
Code.js
    Global Variables
    URLS and IDs (that the user sets up)
    onInstall(e)
    onOpen()
errorHandler.js
    createEL()
    foundEL()
    foundProp()
    getProp()
    exists()
    errorHandler(e)
    addError(error)
    formatErrorHeaders()
    formatErrorCells()
    errorEmail(e)
    execErrorMail(e)
scriptHandler.js
    triggerEmail(e)
helperFunctions.js
    getTriggerState()
    handleFormTrigger(enableTrigger)
```

### Function Documentation

**createEL()**

This is a workaround to create an ErrorLog spreadsheet in the same directory. DriveApp.createFile cannot create a MimeType of GOOGLE_SHEETS (this is a reported bug). This function assumes that EL does not exist. It's called from the errorHandler() when foundEL() returns false.

**foundEL()**

This function returns a Boolean based on whether or not the ErrorLog (EL) exists. To find the EL, it uses the DriveApp service to search the current folder for files and match the name.

**foundProp()**

This function queries the document to see if a property exists for the ErrorLog ID. It returns a Boolean based on that.

**getProp()**

This function queries the document and returns the ID of the prop requested.

**exists()**

This function uses calls to foundProp() and foundEL() to determine if EL exists. It returns a Boolean if EL exists / doesn't exist and a 0 for any weird edge case. It handles the various cases of a property and EL existing or not existing.

**errorHandler()**

This function calls to createEL() if exists() returns false. If EL exists it calls addError()

**addError()**

This function uses the getProp() to get the ELID and adds the error to the EL using the SpreadsheetApp DataRange and getLastRow(). It also calls formatErrorCells

**formatErrorHeaders()**

This function formats the error log headers

**formatErrorCells()**

This function formats the error log cells

**errorEmail()**

This function sends the general error email. This only occurs after addError has passed successfully. The parameter e is an event parameter passing form data

**execErrorMail()**

This function handles all execution errors that occur in major functions: addError(), triggerEmail, or errorEmail() failures. This is more urgent because the script stops functioning and logging errors.

**triggerEmail(e)**

This function handles the email when the form is submitted. It summaries the response.

**getTriggerState()**

This is a helper function to get the state of a particular trigger. It queries the document to get the properties to see the existing triggers.

**handleFormTrigger(enableTrigger)**

This is another helper functin that manually handles creating/deleting triggers. If enableTrigger is passed in as false, the function will delete the existing triggers. If it'strue, it will do nothing if the triggers exist, and create them if they don't.

