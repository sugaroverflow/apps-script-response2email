/*--------------------------------------------- FORM ONSUBMIT() TRIGGER HANDLER----------------------------------------- */

/* Creates an installable trigger for when the form is submitted*/
function createFormTrigger(){
  try{
    var thisform = FormApp.openById(FORM_ID);
    ScriptApp.newTrigger('onSubmit') //which function to trigger
      .forForm(thisform)
      .onFormSubmit() //this is the form action
      .create();
    Logger.log("Passed! in createFormTrigger()")
  }
  //if this trigger isn't created
  catch(error){
     Logger.log("Execution Error: createFormTrigger() failed: " + error.message);
     logError(error);
  }
}


/* Handles the form submission trigger
Takes 'e' which is an [object Object]
and puts it into an email */
function onSubmit(event){
    var admin = 'fatima.khalid@boston.gov';
    var subject = 'FormTest was Submitted!';
    try{
      var body = "<h3>Formtest was Submitted!</h3>" +
           "\n\n Here's the details of the submission: <br /><br />" +
           "\n<strong>Question A:</strong> \t" + event.response.getItemResponses()[0].getResponse() + '<br />' +
           "\n<strong>Essay B:</strong> \t" + event.response.getItemResponses()[1].getResponse() + '<br />' +
           "\n<strong>Question C:</strong> \t" + event.response.getItemResponses()[2].getResponse() +
           "<br /><br />" +
           "<a href='https://docs.google.com/a/boston.gov/forms/d/1v2DEqJQapxY5kuFOQvziQStHZfBX1Ue3XK-xGkdUP6U/edit'> Link to the form </a>" +
           "<br />" +
           "<a href='https://docs.google.com/spreadsheets/d/1XW2nOpbw7y3ajSWj2mGrRRyxo6GRYTyH8GogzP-8WG8/edit#gid=1160836439'> Link to the Responses </a>" +
           "<br />" +
           "<a href='https://docs.google.com/spreadsheets/d/1XW2nOpbw7y3ajSWj2mGrRRyxo6GRYTyH8GogzP-8WG8/edit#gid=1160836439'> Link to the ErrorLog </a>";

      //GmailApp.sendEmail(admin, subject, body, {htmlBody:body});
      Logger.log("Passed! in onSubmit()")
   } catch(error){
       Logger.log("Execution Error: onSubmit(event) failed: " + error.message)
       logError(error);
   }
}
