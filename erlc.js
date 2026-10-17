function parseRobloxIdFromErlcPlayer(player) {
  if (!player) return null;
  const idx = player.lastIndexOf(':');
  if (idx === -1) return null;
  const raw = player.slice(idx + 1).trim();
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}
function formatLocation(loc) {
  const postal = typeof loc?.PostalCode === 'string' ? loc.PostalCode.trim() : '';
  const street = typeof loc?.StreetName === 'string' ? loc.StreetName.trim() : '';
  const building = typeof loc?.BuildingNumber === 'string' ? loc.BuildingNumber.trim() : '';
  if (!postal || !street) return null;
  const streetLine = building ? `${building} ${street}` : street;
  return `${streetLine} | Postal ${postal}`;
}
async function fetchErlcPlayersWithLocations(params) {
  const serverKey = params.serverKey.trim();
  if (!serverKey) return new Map();
  const url = 'https://api.erlc.gg/v2/server?Players=true';
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'server-key': serverKey,
      'Content-Type': 'application/json',
    },
  }).catch(() => null);
  if (!res || !res.ok) return new Map();
  const json = await res.json().catch(() => null);
  const players = Array.isArray(json?.Players) ? json.Players : [];
  const map = new Map();
  for (const p of players) {
    const id = parseRobloxIdFromErlcPlayer(p.Player);
    if (!id) continue;
    const loc = formatLocation(p.Location);
    if (!loc) continue;
    map.set(id, loc);
  }
  return map;
}

module.exports = {
  parseRobloxIdFromErlcPlayer,
  formatLocation,
  fetchErlcPlayersWithLocations,
};
