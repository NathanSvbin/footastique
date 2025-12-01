// api/getTeam.js (Vercel)
// Fonction Fotmob + handler compatible Vercel

import axios from "axios";

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

// ---------------------------------------------------
// HANDLER VERSION VERCEL 🌟
// ---------------------------------------------------
export default async function handler(req, res) {
    try {
        const teamId = req.query.id;

        if (!teamId) {
            return res.status(400).json({ error: "Missing team id" });
        }

        const fotmob = new Fotmob();
        const data = await fotmob.getTeam(teamId);

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
