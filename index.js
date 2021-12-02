const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s8i5p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("myPortfolio");
        const projectsCollection = database.collection("projects");

        ////////////////////////////
        // PROJECTS API HANDLING //
        //////////////////////////

        // GETTING PROJECTS DATA
        app.get('/projects', async (req, res) => {
            const cursor = projectsCollection.find({});
            const projects = await cursor.toArray();
            res.send(projects);
        })

        // GETTING SINGLE PROJECT DATA
        app.get('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const project = await projectsCollection.findOne(query);
            const { screenshot } = project;
            res.send([project, screenshot]);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Congratulations! Api started');
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})