import { servicesValueToLabel } from "./servicesValueToLabel";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

export const movieQuery = async (movieName, mediaType, cleanServicesSelected, cleanCountriesSelected, selectedCountries) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
            'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST
        }
    };

    let IMDB = "";
    let output = {};
    for (const country of selectedCountries) {
        output[country.value] = {
            'country': country.label,
            'services': [],
            'streamingTypes': [],
        };
    }

    let lowerMovieName = movieName.toLowerCase();

    try {
        const urlSearchByTitle = `https://streaming-availability.p.rapidapi.com/search/title?title=${movieName}&country=us&show_type=${mediaType}&output_language=en`;

        const response = await fetch(urlSearchByTitle, options);
        const resultsString = await response.text();
        const results = JSON.parse(resultsString)['result'];
        
        for (const result of results) {
            if (result['title'].toLowerCase() === lowerMovieName) {
                IMDB = result.imdbId;
                break;
            }
        }

        const urlSearchByID = `https://streaming-availability.p.rapidapi.com/get?imdb_id=${IMDB}`;

        const response2 = await fetch(urlSearchByID, options);
        const resultsString2 = await response2.text();
        const results2 = JSON.parse(resultsString2)['result'];

        for (const country in results2['streamingInfo']) {
            if (cleanCountriesSelected.includes(country)) {
                for (const service of results2['streamingInfo'][country]){
                    if (cleanServicesSelected.includes(service['service'])) {
                        output[country]['services'].push(servicesValueToLabel[service['service']]);
                        output[country]['streamingTypes'].push(capitalizeFirstLetter(service['streamingType']));
                    }
                }
            }
        }

        let cleanOutput = [];
        
        for (const country in output) {
            let zipped = output[country]['services'].map((e,i) => {return [e, output[country]['streamingTypes'][i]]});
            let setArray = new Set(zipped.map(x => JSON.stringify(x)));
            let zippedUniq = [...setArray].map(x => JSON.parse(x))

            let data = [];

            for (const [service,streamingType] of zippedUniq) {
                data.push({service: service, streamingType: streamingType});
            }

            cleanOutput.push({
                'country': output[country]['country'],
                'data': data,
            })
        }

        return [cleanOutput, movieName];
    } 
    catch (error) {
        console.error(error);
    }
}