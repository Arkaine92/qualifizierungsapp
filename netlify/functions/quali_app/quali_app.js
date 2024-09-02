const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION);
        
        // Beispiel: Abrufen aller Dokumente aus der Collection
        const results = await collection.find({}).toArray();
        
        return {
            statusCode: 200,
            body: JSON.stringify(results) // Rückgabe als JSON
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
    }
}

module.exports = { handler };
