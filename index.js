const express = require('express')
const app = express()
const port = 3001

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors')
app.use(cors())

require('dotenv').config()

const ObjectId = require('mongodb').ObjectId;


const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxpfd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.fxpfd.mongodb.net:27017,cluster0-shard-00-01.fxpfd.mongodb.net:27017,cluster0-shard-00-02.fxpfd.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-we805n-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const foodData_collection = client.db("db_red_onion").collection("coll_food_data");
    const cart_collection = client.db("db_red_onion").collection("coll_cart_data");

    console.log("db connected")


    app.post('/addFoodItem' , (req,res)=>{
        console.log(req.body)
        foodData_collection.insertOne(req.body)
        .then(result=>{
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/category/:tab' , (req,res)=>{
        const tab = req.params.tab;
        foodData_collection.find({category: tab})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.post('/findCarts' , (req,res)=>{
        const listOfIds = (req.body)
        const documentIds = listOfIds.map(function(myId) { return ObjectId(myId); });
        foodData_collection.find({_id: {$in: documentIds }})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.post('/addToCart' , (req,res)=>{
        console.log(req.body)
        cart_collection.insertOne(req.body)
        .then(result=>{
            res.send(result.insertedCount > 0)
        })
    })

});



app.get('/', (req, res) => {
    res.send('Red Onion Backend Server!')
})

app.listen(process.env.PORT || port, () => {
    console.log(`Listening at http://localhost:${port}`)
})