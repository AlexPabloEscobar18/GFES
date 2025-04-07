const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping someone 1 to 5 times')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("user to ping")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("number of pings")
                .setRequired(true)
        )
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");

        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        if (isNaN(amount) || amount > 5) {
            await interaction.followUp("💊 ❌ GEORGE DROYD ERROR: USE A CORRECT NUMBER OR IMMA BLAST YO ASS NIGGA ❌ 💊");
            return;
        }

        await interaction.followUp("💊 ✅ GEORGE DROYD ACTIVATED: THIS NIGGA IS GETTING PINGED ✅ 💊");

        for (let i = 0; i < amount; ++i) {
            await interaction.followUp(`<@${user.id}>`);
        }
    },
};