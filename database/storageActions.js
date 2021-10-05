
const https = require('https');
const { storage } = require('./config');
const { ref, uploadString, getDownloadURL, } = require('firebase/storage');


const uploadFileSessionWhatsApp = (json) => {
    
    try {
        
        const jsonString = JSON.stringify(json);
    
        const storageRef = ref(storage, 'sessionWhatsApp');
    
        uploadString(storageRef, jsonString);
        console.log('se subio');

    } catch (err) {
        console.log('function uploadFileSessionWhatsApp error');
        console.log(err);
    }

};


const getFileSessionWhatsApp = async () => {
    try {
        
        const storageFileRef = ref(storage, 'sessionWhatsApp');
    
        const fileUrl = await getDownloadURL(storageFileRef);
    
        return new Promise((resolve) => {

            https.get(fileUrl, res => {
                
                let resultBuffer = '';

                res.on('data', data => {
                    resultBuffer += data;
                });
        
                res.on('end', () => {
                    console.log('termino http request getFileSessionWhatsapp');
                    const json = JSON.parse(resultBuffer);

                    resolve(json);
                })
            });
    
        });

    } catch (err) {
        console.log('function getFileSessionWhatsApp error');
        console.log(err);
    }
};


const uploadQRdata = (qr) => {
    try {
        
        const storageRef = ref(storage, 'qrData');
    
        uploadString(storageRef, qr);

    } catch (err) {
        console.log('function uploadQRdata error')
        console.log(err);
    }
};


const getQRdata = async () => {

    const storageFileRef = ref(storage, 'qrData');
    
    const fileUrl = await getDownloadURL(storageFileRef);
    
    return new Promise((resolve) => {

        https.get(fileUrl, res => {
            res.on('data', data => {
                const qrData = Buffer.from(data).toString('ascii');
                
                resolve(qrData);
            });
    
            res.on('end', () => {
                console.log('termino http request getQRdata');
            })
        });

    });
};


module.exports = {
    uploadFileSessionWhatsApp,
    getFileSessionWhatsApp,
    uploadQRdata,
    getQRdata
};