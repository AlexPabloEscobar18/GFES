const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spam')
        .setDescription("spams user's message 5 times")
        .addStringOption(option =>
            option
                .setName("message_text")
                .setDescription("user message")
                .setRequired(true)
        )
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const userMsg = interaction.options.getString('message_text');

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        await interaction.followUp("💊 ✅ GEORGE DROYD ACTIVATED: NIGGA SPAMMING MODE ON ✅ 💊");

        for (let i = 0; i < 5; ++i) {
            await interaction.followUp(userMsg);
        }
    },
};