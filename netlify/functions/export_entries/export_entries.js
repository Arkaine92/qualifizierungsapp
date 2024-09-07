const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const database = (await clientPromise).db('qualificationapp');
        const collection = database.collection('time_entries');

        const key = event.queryStringParameters.key;
        const companies = event.queryStringParameters.companies.split(',');
        
        // Setze die Zeiten so, dass das fromDate um 00:00 startet und das toDate um 23:59 endet
        const fromDate = new Date(event.queryStringParameters.from);
        fromDate.setHours(0, 0, 0, 0);  // Setzt das Startdatum auf 00:00 Uhr

        const toDate = new Date(event.queryStringParameters.to);
        toDate.setHours(23, 59, 59, 999);  // Setzt das Enddatum auf 23:59 Uhr

        // Finde alle Einträge für den Key, die ausgewählten Firmen und den Datumbereich
        const entries = await collection
            .find({
                key: key,
                company: { $in: companies },
                createdAt: {
                    $gte: fromDate,  // Filter nach dem Startdatum
                    $lte: toDate     // Filter nach dem Enddatum
                }
            })
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
