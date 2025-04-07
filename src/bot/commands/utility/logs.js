const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');

const { logRead } = require('../../logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('display logs')
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const logFileContent = logRead();
        
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
        // check if log content did not exceed 2000 characters if so send logs as a file
        if (logFileContent.length > 2000) {
            await interaction.followUp({ content: '💊 📝 GEORGE DROYD ACTIVATED 📝 💊', files: [{ name: 'logs.txt', attachment: Buffer.from(logFileContent) }] });
            return;
        }
        await interaction.followUp(`\`💊 📝 GEORGE DROYD ACTIVATED 📝 💊\n${logFileContent}\``);
    },
};