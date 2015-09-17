/*--------------------------------------------- FORM ONSUBMIT() TRIGGER HANDLER----------------------------------------- */



/**
 * Handles tde onSubmit trigger email
 *
 * Formats the email
 * Is called by the handleFormTrigger creation
 * @param {Object} e the event parameter created by a form
 */
function triggerEmail(e){

    var admin = ADMIN_EMAIL;
    var webmaster = WEBMASTER_EMAIL;
    var subject = FORM_TITLE + " was submitted!- Response Report";
    var ELID = getProp();
    var urlEL = 'https://docs.google.com/spreadsheets/d/' + ELID;
    try{
      var body = "<h3>Digital Team Project Intake Form - Response</h3>" +
            "<table style='border: solid #D3D3D3;widtd:500'>\
            <tr><td style='text-align:left; border-bottom:1px solid #D3D3D3; border-right:1px solid #D3D3D3'><b>Date Submitted</b></td>\
            <td style='text-align:left; border-bottom:1px solid #D3D3D3'>"+ e.response.getTimestamp() + "</td></tr>\
            <tr><td style='text-align:left; border-bottom:1px solid #D3D3D3; border-right:1px solid #D3D3D3'><b>Contact</b></td>\
            <td style='text-align:left; border-bottom:1px solid #D3D3D3'>" + e.response.getItemResponses()[0].getResponse() + "</td></tr>\
            <tr><td style='text-align:left; border-bottom:1px solid #D3D3D3; border-right:1px solid #D3D3D3'><b>Department Responsible</b></td>\
            <td style='text-align:left; border-bottom:1px solid #D3D3D3'>" + e.response.getItemResponses()[1].getResponse() + "</td></tr>\
            <tr><td style='text-align:left; border-bottom:1px solid #D3D3D3; border-right:1px solid #D3D3D3'><b>Audience</b></td>\
            <td style='text-align:left; border-bottom:1px solid #D3D3D3'>" + e.response.getItemResponses()[2].getResponse()+ "</td></tr>\
            <tr><td style='text-align:left; border-bottom:1px solid #D3D3D3; border-right:1px solid #D3D3D3'><b>Deadline</b></td>\
            <td style='text-align:left; border-bottom:1px solid #D3D3D3'>" + e.response.getItemResponses()[3].getResponse()+ "</td></tr>\
            <tr><td style='text-align:left; border-bottom:1px solid #D3D3D3; border-right:1px solid #D3D3D3'><b>Requirements</b></td>\
            <td style='text-align:left; border-bottom:1px solid #D3D3D3'>" + e.response.getItemResponses()[4].getResponse()+ "</td></tr>\
            <tr><td style='text-align:left; border-bottom:1px solid #D3D3D3; border-right:1px solid #D3D3D3'><b>Who else is involved?</b></td>\
            <td style='text-align:left; border-bottom:1px solid #D3D3D3'>" +e.response.getItemResponses()[5].getResponse()+ "</td></tr>\
            <tr><td style='text-align:left; border-bottom:1px solid #D3D3D3; border-right:1px solid #D3D3D3'><b>Tell us whats most important</b></td>\
            <td style='text-align:left; border-bottom:1px solid #D3D3D3'>" + e.response.getItemResponses()[6].getResponse()+ "</td></tr>\
            <tr><td style='text-align:left; border-bottom:1px solid #D3D3D3; border-right:1px solid #D3D3D3'><b>Completed work</b></td>\
            <td style='text-align:left; border-bottom:1px solid #D3D3D3'>" + e.response.getItemResponses()[7].getResponse()+ "</td></tr>\
            <tr><td style='text-align:left; border-bottom:1px solid #D3D3D3; border-right:1px solid #D3D3D3'><b>Project description</b></td>\
            <td style='text-align:left; border-bottom:1px solid #D3D3D3'>" + e.response.getItemResponses()[8].getResponse()+ "</td></tr>\
            </table>" +
           "<br /><br />" +
           "<a href="+FORM_URL+"> Link to the Form </a>" +
           "<br />" +
           "<a href="+RESPONSES_URL+"> Link to the Responses </a>";
      GmailApp.sendEmail(admin, subject, body, {htmlBody:body}); //for the team
      GmailApp.sendEmail(webmaster, subject, body, {htmlBody:body}); //for the trello trigger
      Logger.log("triggerEmail() passed!")
   }
   catch(error){
       Logger.log("*Error: triggerEmail(): " + error.message);
       execErrorMail(error);

   }
}
