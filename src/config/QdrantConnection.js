const { default: axios } = require('axios');
require('dotenv').config();
const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const POST_COLLECTION = process.env.QDRANT_POST_COLLECTION;
const https = require('https');

const headers = {
    "Content-Type": "application/json",
    "api-key": QDRANT_API_KEY,
};

const qdrantPostCollection = axios.create({
    baseURL: `${QDRANT_URL}/collections/${POST_COLLECTION}`,
    headers,
    httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 10 })
});

async function getCollections() {
    const { data } = await axios.get(`${QDRANT_URL}/collections`, { headers });
    return data;
}

async function qdrantHealthCheck() {
    const data = await axios.get(`${QDRANT_URL}/healthz`, { headers }, { timeout: 5000 });
    // console.log("🚀 ~ qdrantHealthCheck ~ data:", data)
    const isHealthy = data.status === 200 && data.statusText === "OK";
    return isHealthy || false;
}


async function ensurePostCollection({
    //  size = 1024,
    size = 512,
    distance = "Cosine" } = {}) {
    try {
        await axios.get(`${QDRANT_URL}/collections/${POST_COLLECTION}`, { headers });
        return;
    } catch (_) { }
    const body = {
        vectors: { size, distance }
    };
    await axios.put(`${QDRANT_URL}/collections/${POST_COLLECTION}`, body, { headers });
    console.log(`✅ Qdrant collection ensured: ${POST_COLLECTION}`);
}

async function initQdrant() {
    try {
        console.log("✅ Qdrant connected");
        const cols = await getCollections();
        console.log(
            "✅ Qdrant connected — collections:",
            cols?.result?.collections?.map(c => c.name)
        );
        const isHealthy = await qdrantHealthCheck();
        console.log(`✅ Qdrant healthy: ${isHealthy}`);
        await ensurePostCollection();
    } catch (e) {
        console.error("❌ Qdrant connection failed:", e.message);
    }
}



module.exports = {
    initQdrant,
    qdrantPostCollection,
    POST_COLLECTION,
    qdrantHealthCheck
};