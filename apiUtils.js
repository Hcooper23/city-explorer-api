const axios = require('axios');

async function fetchDataFromApi(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    fetchDataFromApi,
};
