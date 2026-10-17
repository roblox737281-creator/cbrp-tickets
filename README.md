# Howdy!

- Welcome to my modular Discord bot. The idea behind this is simple; create a 'drag-and-drop' bot.
- Modules can easily be added through just dragging their file into `src/modules-packages`. The bot will automatically detect any new modules and get them working.
- All package purchases will come with the full handler; however if you already have one setup, simply copy the module file and drag it into your current one.

## Installation

### Requirements

- Node.js 18+
- a Discord bot token

### Install Dependencies

```bash
npm install
```

### Start The Bot

```bash
npm start
```


## Configuring Modules

Most modules are configured directly inside their own file in `src/modules-packages`.

If a module says it is disabled in console logs, it usually means one of these is missing:

- `enabled: true`
- `guildId`
- a required channel or role ID
- a required environment variable


## Troubleshooting

### Commands Do Not Show Up

- make sure the module is enabled
- check that `guildId` is correct
- restart the bot after command changes
- check console logs for registration errors


## Support

Please note that no configuration support is provided; however if you are looking for any extra features or facing severe issues, please contact me:

- Discord: `AEmeoow`
