const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleWare
// const corsConfig = {
//     origin: ["http://localhost:5173"],
//     credentials: true,
//   };
//   app.use(cors(corsConfig));

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujjqksd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const touristsCollection = client.db('touristsDB').collection('tourists')
        const countryCollection = client.db('touristsDB').collection('country')

        app.get('/tourists', async (req, res) => {
            const cursor = touristsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/country', async (req, res) => {

            const cursor = countryCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get('/country/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await countryCollection.findOne(query)
            res.send(result)
        })

        app.get('/tourists/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await touristsCollection.findOne(query)
            res.send(result)
        })

        app.post('/tourists', async (req, res) => {
            const newTourists = req.body;
            console.log(newTourists);
            const result = await touristsCollection.insertOne(newTourists)
            res.send(result);
        })


        app.put('/tourists/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedTourists = req.body
            console.log(updatedTourists);

            const TouristsSpot = {
                $set: {
                    spotName: updatedTourists.spotName,
                    countryName: updatedTourists.countryName,
                    location: updatedTourists.location,
                    description: updatedTourists.description,
                    seasonality: updatedTourists.seasonality,
                    averageCost: updatedTourists.averageCost,
                    travelTime: updatedTourists.travelTime,
                    totalVisitor: updatedTourists.totalVisitor,
                    photoUrl: updatedTourists.photoUrl
                }
            }

            const result = await touristsCollection.updateOne(filter, TouristsSpot, options)
            res.send(result)
        })

        app.delete('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await touristsCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(`Tourists server is running`)
})

app.listen(port, () => {
    console.log(`Tourists server is running on port: ${port}`);
})
