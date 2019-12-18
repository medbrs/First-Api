const express = require('express')
const { MongoClient, ObjectID } = require('mongodb')
const bodyParser = require('body-parser')
const assert = require('assert')

const app = express()

app.use(bodyParser.json())

const mongo_url = 'mongodb://localhost:27017';
const DataBase = 'first-api';


MongoClient.connect(mongo_url, { useUnifiedTopology: true }, (err, client) => {
    assert.equal(err, null, 'database connection is failed')
    const db = client.db(DataBase)


    app.post('/newContacts',(req,res) => {
        let newProduct = req.body
        db.collection('contacts').insertOne(newProduct,(err,data)=>{
            if(err) res.send("can't add product")
            else res.send('product added')
        })
    })
    
    app.get('/contacts',(req,res)=>{
        db.collection('contacts').find().toArray((err,data)=>{
            if(err) console.log("can't fetch data")
            else res.send(data)

        })
    })

    app.delete('/deletecontacts/:id', (req, res) => {
        let contactId = ObjectID(req.params.id)
        db.collection('contacts').findOneAndDelete({_id: contactId}, (err, data) => {
            if(err) throw err
            else res.send('Contact deleted!!!!')
        })
    })

    app.put('/contact/:id', (req, res) => {
        let contactUpdated = req.body
        let contactId = ObjectID(req.params.id)
        db.collection('contacts').findOneAndUpdate({_id: contactId}, {$set: {...contactUpdated}}, (err, data) => {
            if(err) throw err
            else res.send('Contact updated!!')
            // db.collection('contacts').findOne({_id: contactId}, (err, contact) => {
            //     if(err) throw err
            //     else res.send(contact)
            // })
        })
    })
})







app.listen(5000, (err) => {
    if (err) console.log('the server is not running')
    else console.log('the server is running on port 5000')
})
