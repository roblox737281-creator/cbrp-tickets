const { Client, GatewayIntentBits, Routes } = require('discord.js');
const path = require('node:path');
const { env } = require('./env');
const { createLogger } = require('./logger');
const { initModules, loadModulesFromDir } = require('./modules/handler');
function resolveIntent(name) {
  const key = name.trim();
  const map = {
    Guilds: GatewayIntentBits.Guilds,
    GuildVoiceStates: GatewayIntentBits.GuildVoiceStates,
    GuildMembers: GatewayIntentBits.GuildMembers,
    GuildPresences: GatewayIntentBits.GuildPresences,
    GuildMessages: GatewayIntentBits.GuildMessages,
    MessageContent: GatewayIntentBits.MessageContent,
  };
  return map[key] ?? null;
}
async function registerSlashCommands(params) {
  const appId = params.client.application?.id;
  if (!appId) return;
  const commandsByScope = new Map();
  for (const mod of params.modules) {
    for (const command of mod.slashCommands ?? []) {
      const scope = command.guildId?.trim() || '__global__';
      const list = commandsByScope.get(scope) ?? [];
      list.push(command.definition);
      commandsByScope.set(scope, list);
    }
  }
  const globalBody = commandsByScope.get('__global__') ?? [];
  try {
    await params.client.rest.put(Routes.applicationCommands(appId), { body: globalBody });
    params.log.info(`Registered ${globalBody.length} global slash command(s).`);
  } catch (err) {
    params.log.warn(`Failed registering global slash commands: ${err?.message || String(err)}`);
  }
  const guilds = await params.client.guilds.fetch();
  for (const [guildId] of guilds) {
    const body = commandsByScope.get(guildId) ?? [];
    try {
      await params.client.rest.put(Routes.applicationGuildCommands(appId, guildId), { body });
      params.log.info(`Registered ${body.length} slash command(s) for guild ${guildId}.`);
    } catch (err) {
      params.log.warn(`Failed registering slash commands for guild ${guildId}: ${err?.message || String(err)}`);
    }
  }
}
async function main() {
  const log = createLogger('bot');
  if (!env.discordToken) throw new Error('Missing DISCORD_TOKEN in .env');
  const modulesDir = path.resolve(__dirname, 'modules-packages');
  const modules = await loadModulesFromDir({
    dir: modulesDir,
    logger: createLogger('modules'),
  });
  log.info(`Discovered modules: ${modules.map((m) => m.id).join(', ') || '(none)'}`);
  const intentNames = new Set(['Guilds']);
  for (const mod of modules) {
    for (const intent of mod.requiredIntents ?? []) {
      if (typeof intent === 'string' && intent.trim().length) intentNames.add(intent.trim());
    }
  }
  const intents = [...intentNames].map(resolveIntent).filter((v) => typeof v === 'number');
  if (!intents.length) throw new Error('No valid intents were resolved.');
  const client = new Client({ intents });
  const runtime = await initModules({
    client,
    modules,
    logger: createLogger('modules'),
  });
  log.info(`Enabled modules: ${runtime.modules.join(', ') || '(none)'}`);
  client.once('ready', () => {
    registerSlashCommands({
      client,
      modules: runtime.activeModules,
      log,
    }).catch((err) => {
      log.warn(`Failed registering slash commands: ${err?.message || String(err)}`);
    });
  });
  await client.login(env.discordToken);
  const stop = async () => {
    await runtime.stop();
    client.destroy();
  };
  process.on('SIGINT', () => {
    stop().finally(() => process.exit(0));
  });
  process.on('SIGTERM', () => {
    stop().finally(() => process.exit(0));
  });
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
