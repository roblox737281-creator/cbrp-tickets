const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');

const rootEnvPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const env = {
  discordToken: String(process.env.DISCORD_TOKEN || '').trim(),
  melonlyApiKey: String(process.env.MELONLY_API_KEY || '').trim(),
  dockApiKey: String(process.env.DOCK_API_KEY || '').trim(),
  mongoUri: String(process.env.MONGODB_URI || '').trim(),
  openaiApiKey: String(process.env.OPENAI_API_KEY || '').trim(),
  cookieApiKey: String(process.env.COOKIE_API_KEY || '').trim(),
  robloxCookie: String(process.env.ROBLOX_COOKIE || '').trim(),
};

module.exports = { env };
