const crimesResp = await fetch('./data/crimes.json');
// make HTTP request at the address
// fetch function submit a request, from the request generate a response

const crimes = await crimesResp.json();
// json function get the data contained in the response


// categorize crimes by types
const crimeObj = {'Aggravated Assault': [],
                'Burglary': [],
                'Drug Violations': [],
                'Fraud': [],
                'Other Assaults': [],
                'Other Crimes': [],
                'Rape': [],
                'Robbery': [],
                'Sex Offenses': [],
                'Thefts': [],
                'Vandalism': [],
                'Weapon Violations': []
                };


for (const crime of crimes) {
    const crimeName = crime.text_general_code;
    crimeObj[crimeName].push(crime);
};


export {
    crimeObj
};