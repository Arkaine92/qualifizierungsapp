const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const database = (await clientPromise).db('qualificationapp');
        const userCollection = database.collection('app_users');
        const companyCollection = database.collection('companies');

        // URL-Parameter auslesen
        const key = event.queryStringParameters.key;

        // Suche nach dem entsprechenden Benutzer anhand des Keys
        const user = await userCollection.findOne({ key: key });

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' }),
            };
        }

        // Hole alle Details zu den companies des Benutzers
        const companyDetails = await companyCollection
            .find({ company_id: { $in: user.companies.map(c => parseInt(c)) } })
            .toArray();

        // Response mit Benutzerinformationen und den Company-Details
        return {
            statusCode: 200,
            body: JSON.stringify({
                fullName: user['full name'],
                key: user.key,
                companies: companyDetails.map(company => ({
                    name: company.name,
                    fontcolor: company.fontcolor,
                    backgroundcolor: company.backgroundcolor,
                    highlightcolor: company.highlightcolor
                }))
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
