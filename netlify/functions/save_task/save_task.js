const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const database = (await clientPromise).db('qualificationapp');
        const collection = database.collection('time_entries');
        const data = JSON.parse(event.body);

        // Füge den neuen Task in die time_entries-Collection ein
        await collection.insertOne({
            key: data.key,
            company: data.company.name, // Speichere den Namen der ausgewählten Firma
            task: data.task,
            time: data.time,
            description: data.description,
            createdAt: new Date(), // Speichert das aktuelle Datum und Uhrzeit
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.toString() })
        };
    }
};

module.exports = { handler };
