
const { sendMessage } = require("../../initWhatsApp");
const { authorizeReport, getNumberPhoneEmployeeSystems, getNumberPhoneEmployeeBussines, checkMessageSolutionSystems, checkMessageFinishedReport } = require("./notificationsReports");


const answerReportsWhatsApp = async (messageWhatsapp) => {
    
    let functionResult;

    const {from} = message;
    let {body} = message;
    body = body.toUpperCase().trim();

    //EMPLOYEE FINANCE ANSWER YES (REPORT AUTHORIZE)
    if(body === 'SI'){
        if(message.hasQuotedMsg){
            //MESSAGE BY GERENTE AND CONTAINT INFO OF REPORT
            const msgQuoted = await message.getQuotedMessage();

            const result = 
                await authorizeReport(msgQuoted.body, true);

            //SEND RESULT TO EMPLOYEE FINANCE
            await sendMessage(from, result);

            const numberPhoneSystem = 
                await getNumberPhoneEmployeeSystems();
            
            if(numberPhoneSystem){
                //RE SEND MESSAGE REPORT TO EMPLOYEE SYSTEMS
                msgQuoted.forward(numberPhoneSystem);
            }
        }

        functionResult = true;
        return functionResult;
    }

    //EMPLOYEE FINANCE ANSWER NOT (REPORT NOT AUTHORIZE)
    if(body === 'NO'){
        if(message.hasQuotedMsg){
            let msgQuoted = await message.getQuotedMessage();

            const result = 
                await authorizeReport(msgQuoted.body, false);

            //SEND RESULT TO EMPLOYEE FINANCE
            await sendMessage(from, result);
                
            const numberEmployeeBussines =
                await getNumberPhoneEmployeeBussines(msgQuoted.body);

            if(numberEmployeeBussines){
                msgQuoted.body = 
                    `${msgQuoted.body} \n\n NO FUE AUTORIZADO`;
                
                //RE SEND MESSAGE REPORT TO EMPLOYEE BUSSINES
                msgQuoted.forward(numberEmployeeBussines);
            }
        }

        functionResult = true;
        return functionResult;
    }

    //EMPLOYEE SYSTEMS ANSWER FINISHED 
    if(body.includes('SOLUCIONADO')){
        if(message.hasQuotedMsg){
            let msgQuoted = await message.getQuotedMessage();
            
            const result = 
                await checkMessageSolutionSystems(body, msgQuoted.body);

            //SEND ANSWER TO EMPLOYEE SYSTEMS
            await sendMessage(from, result);

            const numberEmployeeBussines =
                await getNumberPhoneEmployeeBussines(msgQuoted.body);

            if(numberEmployeeBussines){
                msgQuoted.body = 
                    `${msgQuoted.body} \n\n YA SE ATENDIO. \n EN ESPERA DE TU RESPUESTA...`;
                
                //RE SEND MESSAGE REPORT TO EMPLOYEE SYSTEMS
                msgQuoted.forward(numberEmployeeBussines);
            }
        }

        functionResult = true;
        return functionResult;
    }

    //EMPLOYEE BUSSINES ANSWER READY 
    //(when employee system finished job and send solution)
    if(body === 'LISTO'){
        if(message.hasQuotedMsg){
            const msgQuoted = await message.getQuotedMessage();

            const result = 
                await checkMessageFinishedReport(msgQuoted.body);

            sendMessage(from, result);
        }

        functionResult = true;
        return functionResult;
    }

    return functionResult;
}


module.exports = answerReportsWhatsApp;