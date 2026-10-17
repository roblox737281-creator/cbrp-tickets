async function getRobloxIdForDiscordIdDock(params) {
  const apiKey = params.apiKey.trim();
  if (!apiKey) return null;
  const discordId = params.discordId.trim();
  const guildId = params.guildId.trim();
  if (!discordId || !guildId) return null;
  const url = `https://api.docksys.xyz/api/v1/public/discord-to-roblox?discordId=${encodeURIComponent(discordId)}&guildId=${encodeURIComponent(guildId)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const json = await res.json().catch(() => null);
  const robloxId = json?.data?.robloxId;
  if (typeof robloxId !== 'string') return null;
  if (!/^\d+$/.test(robloxId)) return null;
  return Number(robloxId);
}
async function getDiscordIdsForRobloxIdDock(params) {
  const apiKey = params.apiKey.trim();
  if (!apiKey) return [];
  const guildId = params.guildId.trim();
  const robloxId = String(params.robloxId).trim();
  if (!guildId || !robloxId || !/^\d+$/.test(robloxId)) return [];
  const url = `https://api.docksys.xyz/api/v1/public/roblox-to-discord?robloxId=${encodeURIComponent(robloxId)}&guildId=${encodeURIComponent(guildId)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  }).catch(() => null);
  if (!res || !res.ok) return [];
  const json = await res.json().catch(() => null);
  const ids = json?.data?.discordIds;
  if (!Array.isArray(ids)) return [];
  return ids.map((v) => String(v || '').trim()).filter((v) => /^\d+$/.test(v));
}

module.exports = { getRobloxIdForDiscordIdDock, getDiscordIdsForRobloxIdDock };
