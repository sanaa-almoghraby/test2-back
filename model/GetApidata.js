'use strict'

const { default: axios } = require('axios');
async function getApidata(req, res) {
    let apiData = await axios.get('https://digimon-api.vercel.app/api/digimon')

    let allDAta = apiData.data.map(ele => {
        return new GetdataApi(ele)
    })
    res.send(allDAta)
}
class GetdataApi {
    constructor(data) {
        this.name = data.name,
            this.img = data.img,
            this.level = data.level
    }

}
module.exports = getApidata;