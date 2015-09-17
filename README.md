# onFormSubmit
This is a Google Apps Script that emails meaningful form submission data.
It has a built in error log manager

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
    handleFormTrigger(enableTrigger)
```

### Function Documentation
**createEL()**
**createEL()**
**createEL()**
**createEL()**
