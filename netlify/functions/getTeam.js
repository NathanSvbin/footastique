// getTeam.js
// Netlify Function inline avec Fotmob
import axios from "axios";

// ------------------------------
// Code inline de Fotmob (simplifié pour getTeam)
// ------------------------------
class Fotmob {
    constructor() {
        this.cache = new Map();
        this.xmas = undefined;
        this.baseUrl = "https://www.fotmob.com/api/";
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000,
            headers: {
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0"
            }
        });

        this.axiosInstance.interceptors.request.use(async (config) => {
            if (!this.xmas) {
                await this.ensureInitialized();
            }
            config.headers["x-mas"] = this.xmas;
            return config;
        });
    }

    async ensureInitialized() {
        if (!this.xmas) {
            const response = await axios.get("http://46.101.91.154:6006/");
            this.xmas = response.data["x-mas"];
        }
    }

    async safeTypeCastFetch(url) {
        if (this.cache.has(url)) {
            return JSON.parse(this.cache.get(url));
        }
        const response = await this.axiosInstance.get(url);
        this.cache.set(url, JSON.stringify(response.data));
        return response.data;
    }

    async getTeam(id, tab = "overview", type = "team", timeZone = "Europe/London") {
        const url = `teams?id=${id}&tab=${tab}&type=${type}&timeZone=${timeZone}`;
        return await this.safeTypeCastFetch(url);
    }
}

// ------------------------------
// Export Netlify Function
// ------------------------------
export async function handler(event) {
    try {
        const teamId = event.queryStringParameters?.id;
        if (!teamId) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing team id" }) };
        }

        const fotmob = new Fotmob();
        const data = await fotmob.getTeam(teamId);

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
}
