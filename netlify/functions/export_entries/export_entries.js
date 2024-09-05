const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const database = (await clientPromise).db('qualificationapp');
        const collection = database.collection('time_entries');

        const key = event.queryStringParameters.key;
        const companies = event.queryStringParameters.companies.split(',');

        // Finde alle Einträge für den Key und die ausgewählten Firmen
        const entries = await collection
            .find({ key: key, company: { $in: companies } })
            .toArray();

        return {
            statusCode: 200,
            body: JSON.stringify(entries)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.toString() })
        };
    }
};

module.exports = { handler };
