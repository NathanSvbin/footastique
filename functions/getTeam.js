import Fotmob from "../node_modules/@max-xoo/fotmob/dist/fotmob.js";

const fotmob = new Fotmob();

export async function handler(event, context) {
  const teamId = event.queryStringParameters?.id;
  if (!teamId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "id manquant" }),
    };
  }

  try {
    const teamData = await fotmob.getTeam(teamId, "overview", "team", "Europe/London");
    
    let squadGroups = teamData?.squad || [];
    if (!Array.isArray(squadGroups)) squadGroups = Object.values(squadGroups);

    return {
      statusCode: 200,
      body: JSON.stringify({ info: teamData, squad: { squad: squadGroups } }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
