async function getRobloxIdForDiscordId(params) {
  const apiKey = params.apiKey.trim();
  if (!apiKey) return null;
  const res = await fetch(
    `https://api.melonly.xyz/api/v1/verification/discord/${encodeURIComponent(params.discordId)}/roblox`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    },
  ).catch(() => null);
  if (!res || !res.ok) return null;
  const data = await res.json().catch(() => null);
  const robloxId = data?.robloxId;
  if (typeof robloxId === 'number' && Number.isFinite(robloxId)) return robloxId;
  if (typeof robloxId === 'string' && /^\d+$/.test(robloxId)) return Number(robloxId);
  return null;
}
async function getDiscordIdForRobloxId(params) {
  const apiKey = params.apiKey.trim();
  if (!apiKey) return null;
  const robloxId = String(params.robloxId).trim();
  if (!robloxId || !/^\d+$/.test(robloxId)) return null;
  const res = await fetch(
    `https://api.melonly.xyz/api/v1/verification/roblox/${encodeURIComponent(robloxId)}/discord`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    },
  ).catch(() => null);
  if (!res || !res.ok) return null;
  const data = await res.json().catch(() => null);
  const discordId = data?.providerAccountId ?? data?.discordId;
  if (typeof discordId === 'number' && Number.isFinite(discordId)) return String(discordId);
  if (typeof discordId === 'string' && /^\d+$/.test(discordId)) return discordId.trim();
  return null;
}

module.exports = { getRobloxIdForDiscordId, getDiscordIdForRobloxId };
