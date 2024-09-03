const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const database = (await clientPromise).db('qualificationapp');
        const collection = database.collection('app_users');

        // URL-Parameter auslesen
        const key = event.queryStringParameters.key;

        // Suche nach dem entsprechenden Benutzer anhand des Keys
        const user = await collection.findOne({ key: key });

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                fullName: user['full name'],
                key: user.key,
                companies: user.companies
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Internal Server Error: ${error.toString()}` }),
        };
    }
};

module.exports = { handler };
