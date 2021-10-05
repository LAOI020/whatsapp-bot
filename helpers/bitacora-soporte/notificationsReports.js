
const {getDoc, getDocs, doc, updateDoc, query, where, limit, collection} = require('firebase/firestore');
const { firestore } = require('../../database/config');
const getTimeZone = require('../getTimeZone');


//FOR EMPLOYEE FINANCE
const authorizeReport = async (messageWhatsapp, authorize) => {

    let result;

    const docID = 
        messageWhatsapp.substr(messageWhatsapp.length - 20);

    const docRef = doc(
        firestore, 
        `App-bitacora-soporte/reports/allReports/${docID}`
    );

    const docSnapshot = await getDoc(docRef);

    if(!docSnapshot.exists()){
        result = 'No existe';
        return result;
    }

    if(docSnapshot.data().status !== 0){
        result = 'Ya no lo puedes modificar';
        return result;
    }

    if(authorize){
        await updateDoc(docRef, {
            status: 1
        });

    } else {
        await updateDoc(docRef, {
            status: -2
        });
    }

    if(authorize){
        result = 'LISTO...REPORTE AUTORIZADO';
    } else {
        result = 'LISTO...REPORTE NO AUTORIZADO';
    }

    return result;
};


const getNumberPhoneEmployeeSystems = async () => {

    const collectionUsers = collection(firestore, 
        'App-bitacora-soporte/users/allUsers'
    );

    const q = query(collectionUsers, 
        where('numberPhone', '==', 'SISTEMAS'),
        limit(1)
    );

    const querySnapshot = await getDocs(q);

    const docEmployeeSystem = querySnapshot.docs[0];

    if(!docEmployeeSystem.exists()){
        return null;
    }

    const numberPhone = docEmployeeSystem.data().numberPhone;

    return numberPhone;
};


const getNumberPhoneEmployeeBussines = async (messageWhatsapp) => {
    
    const getSectionName = messageWhatsapp.split(' ')[1];

    const collectionUsers = collection(firestore, 
        'App-bitacora-soporte/users/allUsers'
    );

    const q = query(collectionUsers, 
        where('section', '==', getSectionName),
        limit(1)
    );

    const querySnapshot = await getDocs(q);

    const docEmployeeBussines = querySnapshot.docs[0];

    if(!docEmployeeBussines.exists()){
        return null;
    }

    const numberPhone = docEmployeeBussines.data().numberPhone;

    return numberPhone;
};


//WHEN EMPLOYEE SYSTEMS SEND SOLUTION FROM REPORT
const checkMessageSolutionSystems = async (
    messageWhatsapp, messageReport
) => {

    let result = 'error en el formato, intentandolo de nuevo';

    const arrayFromMessage = messageWhatsapp.split(' ');

    if(arrayFromMessage[0] !== 'SOLUCIONADO'){
        return result;
    }

    const docID = 
        messageReport.substr(messageReport.length - 20);

    const docRef = doc(
        firestore, 
        `App-bitacora-soporte/reports/allReports/${docID}`
    );

    const docSnapshot = await getDoc(docRef);

    if(!docSnapshot.exists()){
        result = 'No existe';
        return result;
    }

    if(docSnapshot.data().status !== 1){
        result = 'Ya no lo puedes modificar';
        return;
    }

    if(docSnapshot.data().supportType === 'ACTIVACION'){

        await updateDoc(docRef, {
            status: 2
        });

        result = 'LISTO...SOLUCION ENVIADA';

        return result;

    }

    if(arrayFromMessage.length < 3){
        result = 'es obligatorio escribir una solucion en este reporte';
        return result;
    }

    const solutionText = arrayFromMessage.slice(1).join(' ');
    
    if(!solutionText){
        result = 'es obligatorio escribir una solucion en este reporte';
        return result;
    }

    await updateDoc(docRef, {
        status: 2,
        solution: solutionText,
    });

    result = 'LISTO...SOLUCION ENVIADA';
    
    return result;
};


//WHEN EMPLOYEE BUSSINES FINISH THE REPORT
const checkMessageFinishedReport = async (messageReport) => {
    let result = 'Hubo un error, intentalo desde la pagina';

    const arrayFromMessage = messageReport.split(' ');

    const findDocID = arrayFromMessage.find(
        word => word.length === 20
    );

    if(!findDocID){
        return result;
    }

    const docRef = doc(
        firestore, 
        `App-bitacora-soporte/reports/allReports/${findDocID}`
    );

    const docSnapshot = await getDoc(docRef);

    if(!docSnapshot.exists()){
        result = 'No existe';
        return result;
    }

    if(docSnapshot.data().status !== 2){
        result = 'Ya no lo puedes modificar';
        return result;
    }

    //GET MOMENT DATE TIME ZONE (AMERICA MEXICO CITY)
    const dateFormat = await getTimeZone();

    await updateDoc(docRef, {
        status: 3,
        completedDate: dateFormat
    });

    result = 'LISTO...REPORTE TERMINADO';
    return result;
}


module.exports = {
    authorizeReport,
    getNumberPhoneEmployeeSystems,
    getNumberPhoneEmployeeBussines,
    checkMessageSolutionSystems,
    checkMessageFinishedReport
};