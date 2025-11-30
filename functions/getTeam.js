// getTeam.js
import Fotmob from './node_modules/@max-xoo/fotmob/dist/fotmob.js';
import fs from "fs";
import path from "path";

// Initialisation
const fotmob = new Fotmob();

// Fonction principale pour récupérer une équipe
export async function loadTeam(teamId) {
    if (!teamId) throw new Error("Id d'équipe manquant");

    console.log("⏳ Récupération des données pour l'équipe :", teamId);

    try {
        // Récupération des données via FotMob
        const data = await fotmob.getTeam(teamId, "overview", "team", "Europe/London");

        // Normalisation du squad pour que ce soit toujours un tableau
        let squadGroups = data?.squad || [];
        if (!Array.isArray(squadGroups)) squadGroups = Object.values(squadGroups);

        // Sauvegarde JSON locale (optionnel)
        const outputFile = path.resolve(`team_${teamId}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf8");

        console.log(`✅ Données enregistrées dans ${outputFile}`);
        return data;

    } catch (err) {
        console.error("❌ Erreur lors de la récupération :", err);
        return null;
    }
}

// Exécution directe depuis la ligne de commande
if (process.argv[2]) {
    const id = process.argv[2];
    loadTeam(id);
}
