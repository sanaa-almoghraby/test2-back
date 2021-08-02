'use strict'

const express = require('express');
const cors = require('cors');
const server = express();
require('dotenv').config();
const PORT =process.env.PORT //3004
server.use(cors());
server.use(express.json());


// http://localhost:3004/
server.get('/', testfun)

const mongoose = require('mongoose');
const { default: axios } = require('axios');
// mongodb://localhost:27017/test2
// MONGO_URL=mongodb://sanaa:sanaa#123@cluster0-shard-00-00.jn4uh.mongodb.net:27017,cluster0-shard-00-01.jn4uh.mongodb.net:27017,cluster0-shard-00-02.jn4uh.mongodb.net:27017/test2?ssl=true&replicaSet=atlas-ow5lhc-shard-0&authSource=admin&retryWrites=true&w=majority

mongoose.connect('mongodb://localhost:27017/test2', { useNewUrlParser: true, useUnifiedTopology: true });

const dragonSchema = new mongoose.Schema({
    name: String,
    img: String,
    level: String,
});
const wonerSchema = new mongoose.Schema({
    email: String,
    bokemon: [dragonSchema]
});

const user = mongoose.model('user', wonerSchema);

function seedData() {
    const userdata = new user({
        email: 'sanaa.almoghraby@gmail.com',
        bokemon: [{
            "name": "Koromon",
            "img": "https://digimon.shadowsmith.com/img/koromon.jpg",
            "level": "In Training"
        },
        {
            "name": "Tsunomon",
            "img": "https://digimon.shadowsmith.com/img/tsunomon.jpg",
            "level": "In Training"
        },
        {
            "name": "Yokomon",
            "img": "https://digimon.shadowsmith.com/img/yokomon.jpg",
            "level": "In Training"
        },]
    })

    const userdata2 = new user({
        email: 'sanaa@gmail.com',
        bokemon: [{
            "name": "Koromon",
            "img": "https://digimon.shadowsmith.com/img/koromon.jpg",
            "level": "In Training"
        },
        {
            "name": "Tsunomon",
            "img": "https://digimon.shadowsmith.com/img/tsunomon.jpg",
            "level": "In Training"
        },
        {
            "name": "Yokomon",
            "img": "https://digimon.shadowsmith.com/img/yokomon.jpg",
            "level": "In Training"
        },]
    })
    userdata.save();
    userdata2.save();
}
// seedData();




// https://digimon-api.vercel.app/api/digimon
server.get('/api/digimon', getApidata)

// http://localhost:3004/addtofav
server.post('/addtofav', addtoFavFun)


// http://localhost:3004/update/index
server.put('/update/:id', updatefun)



// http://localhost:3004/delete/index

server.delete('/delete/:id', deletedata)



function deletedata(req, res) {
    let id =Number(req.params.id) 
    let email = req.query.email
    user.findOne({ email: email }, (err, deleteddata) => {
        // deleteddata.bokemon.splice(id,1);


        if (err) {
            res.send('error')
        } else {
            let newdeledata = deleteddata.bokemon.filter((el, ind) => {
                if (ind !== id) {
                    return el;
                }
            })
            deleteddata.bokemon = newdeledata;

            deleteddata.save();
            res.send( deleteddata.bokemon)
        }
    })
}

function updatefun(req, res) {
    const { email, name, img, level } = req.body
    let index = Number(req.params.id)

    user.findOne({ email: email }, (err, updetedata) => {
        if (err) {
            res.send('error')

        } else {
            updetedata.bokemon.splice(index, 1, {
                name: name,
                img: img,
                level: level
            })
        }
        updetedata.save();
        res.send(updetedata.bokemon);
    })

}


function addtoFavFun(req, res) {
    const { email, name, img, level } = req.body
    user.find({ email: email }, (err, favData) => {
        if (err) {
            res.send('error')
        } else {
            const newfav = {
                name: name,
                img: img,
                level: level
            }
            favData[0].bokemon.push(newfav)

        }
        favData[0].save();
        res.send(favData[0].bokemon)
    })

}

async function getApidata(req, res) {
    let apiData = await axios.get('https://digimon-api.vercel.app/api/digimon')

    let allDAta = apiData.data.map(ele => {
        return new getdataApi(ele)
    })
    res.send(allDAta)
}
class getdataApi {
    constructor(data) {
        this.name = data.name,
            this.img = data.img,
            this.level = data.level
    }

}

// =============================================================================
// http://localhost:3004/alldata?email=
server.get('/alldata', getdata)

function getdata(req, res) {
    let email = req.query.email
    user.find({ email: email }, (err, cartondata) => {
        if (err) {
            res.send('not correct')
        } else {
            res.send(cartondata[0].bokemon)
        }
        console.log(cartondata);
    })

}






function testfun(req, res) {

    console.log('goooood');
    res.send('work good ssssssssss')
}


server.listen(PORT, () => {
    console.log(`listen on ${PORT}`);
})