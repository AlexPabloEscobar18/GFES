const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
const { token, allowedUserIDs } = require('./config.json');
const { logWrite } = require('./logger.js');

const fs = require("node:fs");
const path = require("node:path");

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (!allowedUserIDs.includes(parseInt(interaction.user.id))) { // making sure fake niggas won't use the bot

        console.log(`ABORT ❌ /${interaction.commandName} used by ${interaction.member.user.username}`);
        logWrite(`ABORT ❌ /${interaction.commandName} used by ${interaction.member.user.username}`);

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await interaction.followUp("💊 ⛔ GEORGE DROYD ERROR: GEORGE DROYD DOES NOT RESPOND TO FAKE ASS NIGGAS ⛔ 💊");
        return;
    }

    console.log(`SUCCESS ✅ /${interaction.commandName} used by ${interaction.member.user.username}`);
    logWrite(`SUCCESS ✅ /${interaction.commandName} used by ${interaction.member.user.username}`);

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
});

client.login(token);