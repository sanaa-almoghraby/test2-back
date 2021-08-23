'use strict'

const express = require('express');
const cors = require('cors');
const server = express();
require('dotenv').config();
const PORT = process.env.PORT //3004
server.use(cors());
server.use(express.json());

const mongoose = require('mongoose');
const { default: axios } = require('axios');
// mongodb://localhost:27017/test2
//MONGO_URL=mongodb://sanaa:sanaa#123@cluster0-shard-00-00.ejhje.mongodb.net:27017,cluster0-shard-00-01.ejhje.mongodb.net:27017,cluster0-shard-00-02.ejhje.mongodb.net:27017/test2?ssl=true&replicaSet=atlas-10qf27-shard-0&authSource=admin&retryWrites=true&w=majority
// ----------------------------
// mongodb://sanaa:<password>@cluster0-shard-00-00.ejhje.mongodb.net:27017,cluster0-shard-00-01.ejhje.mongodb.net:27017,cluster0-shard-00-02.ejhje.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-10qf27-shard-0&authSource=admin&retryWrites=true&w=majority

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const pokemonSchema = new mongoose.Schema({
    name: String,
    img: String,
    level: String,
});
const userSchema = new mongoose.Schema({
    email: String,
    data: [pokemonSchema]
});
const user = mongoose.model('user', userSchema);
function seedfun() {
    const userdata = new user({
        email: 'sanaa.almoghraby@gmail.com',
        data: [
            {
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
}
// seedfun();

// http://localhost:3004/getdatadb?email=sanaa.almoghraby@gmail.com
server.get('/getdatadb', getdata)
function getdata(req, res) {
    let email = req.query.email
    user.find({ email: email }, (err, databok) => {
        if (err) {
            res.send('erorrrrr')
        } else {
            res.send(databok[0].data)
        }
    })
}
// http://localhost:3004/dataapi
server.get('/dataapi', dataApi)

function dataApi(req, res) {
    let urlApi = 'https://digimon-api.vercel.app/api/digimon';
    axios.get(urlApi).then(item => {
        let dataApi = item.data.map(ele => {
            return new newopj(ele)
        })
        res.send(dataApi)
    })
}

class newopj {
    constructor(alldata) {
        this.name = alldata.name;
        this.img = alldata.img;
        this.level = alldata.level;

    }
}

// http://localhost:3004/addtofav
server.post('/addtofav', addtofavfun)

function addtofavfun(req, res) {
    const { email, name, img, level } = req.body;
    user.find({ email: email }, (err, databok) => {
        if (err) {
            res.send('erorrrrr')
        } else {
            const newopj = {
                name: name,
                img: img,
                level: level,
            }
            databok[0].data.push(newopj)
        }
        databok[0].save();
        res.send(databok[0]);
    })

}
// http://localhost:3004/delete/inx
server.delete('/delete/:id', deletefun)

function deletefun(req, res) {
    let email = req.query.email
    let ind = req.params.id
    user.findOne({ email: email }, (err, databok) => {
        if (err) {
            res.send('erorrrrr')
        } else {
            databok.data.splice(ind, 1);
            databok.save();
            res.send(databok.data)
        }
    })

}
// http://localhost:3004/update/inx
server.put('/update/:id', updatefun)
function updatefun(req, res) {
    let { email, name, img, level } = req.body;
    let ind = req.params.id
    user.findOne({ email: email }, (err, databok) => {
        if (err) {
            res.send('erorrrrr')
        } else {
            databok.data.splice(ind, 1, {
                name: name,
                img: img,
                level: level,
            });
            databok.save();
            res.send(databok.data)
        }
    })
}


// http://localhost:3004/
server.get('/',(req,res)=>{
    res.send('goood')
})

server.listen(PORT, () => {
    console.log(`listen on ${PORT}`);
})