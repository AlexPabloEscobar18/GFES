const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('say something in chat')
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("message to send")
                .setRequired(true)
        )
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const msg = interaction.options.getString("message");

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        await interaction.followUp("💊 ✅ EVIL FLOYD ACTIVATED: YO VOICE IS HEARD ✅ 💊");

        await interaction.followUp(msg);
    },
};