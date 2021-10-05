
const https = require('https');


const wakeUpDyno = (url, interval = 25) => {

    const milliseconds = interval * 60000;

    setTimeout(() => { 

        try { 
            https.get(url, res => {
                console.log(`Making HTTP request to ${url}...`)
                
                res.on('data', data => {
                    console.log(data.toString());
                });
            });
        }
        catch (err) {
            console.log(`Error fetching ${url}`);
            console.log(err);
        }
        finally {
            return wakeUpDyno(url, interval);
        }

    }, milliseconds);
};


module.exports = wakeUpDyno;