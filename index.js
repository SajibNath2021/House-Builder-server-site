const ObjectId = require('mongodb').ObjectId;
const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
require('dotenv').config()



const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');

})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3wbxy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    
    const servicesCollection = client.db("houseBuilder").collection("services");
    const ordersCollection = client.db("houseBuilder").collection("orders");
    const reviewsCollection = client.db("houseBuilder").collection("review");
    const adminsCollection = client.db("houseBuilder").collection("Admin");
    console.log('database connected successfully');
    
    app.post('/addServices', (req, res)=>{
        const newEvent = req.body;
        servicesCollection.insertOne(newEvent)
        .then(result=>{
            res.send(result.insertedCount > 0)
        })
    
    })

    app.get('/services', (req, res)=>{
        servicesCollection.find()
        .toArray((err, items) =>{
            res.send(items)
        })
    })

    app.delete('/delete/:id', (req, res)=>{
        servicesCollection.deleteOne({_id: ObjectId( req.params.id )})
        .then(result =>{
            res.send(result.deletedCount > 0)
        })
    })
    app.get('/booksPay/:name', (req, res) => {
        servicesCollection.find({name: req.params.name})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
      })




      app.post('/payOrders', (req, res)=>{
        const newEvent = req.body;
       console.log(newEvent);
        ordersCollection.insertOne(newEvent)
        .then(result=>{
            console.log('inserted count', result);
            res.send(result.insertedCount > 0)
        })
    
    })

    app.get('/bookingList/:email', (req, res)=>{
       ordersCollection.find({email: req.params.email})
        .toArray((err, document) =>{
            res.send(document)
        })
    })
    app.get('/booking', (req, res)=>{
        ordersCollection.find()
         .toArray((err, document) =>{
             res.send(document)
         })
     })


    // add review
    app.post('/addReview', (req, res)=>{
        const newEvent = req.body;
        reviewsCollection.insertOne(newEvent)
        .then(result=>{
            res.send(result.insertedCount > 0)
        })
    
    })
    app.get('/allReview', (req, res)=>{
        reviewsCollection.find()
         .toArray((err, items) =>{
             res.send(items)
         })
     })

    // add admin
    app.post('/addAdmin', (req, res)=>{
        const newEvent = req.body;
        adminsCollection.insertOne(newEvent)
        .then(result=>{
            res.send(result.insertedCount > 0)
        })
    
    })
    app.post('/Admin', (req, res)=>{
        const { email } = req.body;
        adminsCollection.find({ email })
         .toArray((err, items) =>{
             res.send(items.length> 0)
         })
     })

    
});



app.listen(process.env.PORT || port)