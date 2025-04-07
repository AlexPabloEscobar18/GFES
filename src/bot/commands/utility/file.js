const { SlashCommandBuilder, InteractionContextType, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('file_upload')
        .setDescription('send a file to the channel')
        .addAttachmentOption(option =>
            option
                .setName("file")
                .setDescription("file to send")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("quantity")
                .setDescription("amount of times to post the same file (MAX = 5)")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("thumbnail_url")
                .setDescription("url to the thumbnail")
                .setRequired(false)
        )
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const file = interaction.options.getAttachment("file");
        const quantity = interaction.options.getInteger("quantity") || 1;
        let thumbnail = interaction.options.getString("thumbnail_url") || null;

        if (thumbnail === null) {
            thumbnail = "https://cdn.discordapp.com/avatars/1357710540297863198/0cd78ffaf78611e0c065b46223bee91a.png?size=512";
        }
        
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        if (quantity > 5 || quantity < 1) {
            await interaction.followUp("💊 ❌ GEORGE DROYD ERROR: MAXIMUM QUANTITY IS 5 FOOL ❌ 💊");
            return;
        }

        if (!file) {
            await interaction.followUp("💊 ❌ GEORGE DROYD ERROR: PUT A VALID FILE YOU BITCH ASS NIGGA ❌ 💊");
            return;
        }

        try {    
            if (file.contentType === "audio/mpeg") {
                await interaction.followUp("💊 🕒 GEORGE DROYD IS PROCCESSIN YO BEAT 🕒 💊");
                let response = await fetch(file.url);
                let arrayBuffer = await response.arrayBuffer();

                for (let i = 0; i < quantity; ++i) {
                    await interaction.followUp({ files: [{ name: file.name, attachment: Buffer.from(arrayBuffer) }] });
                }
                return;
            }
        } catch (error) {
            await interaction.followUp(`💊 ⚠️ DAT SHI AIN'T POSSIBLE MAN... FLOYD FAILED TO UPLOAD AUDIO BCUZ: (${error}) ⚠️ 💊`);
            return;
        }

        const embed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("<:EVIL:1358015392332779602> FLOYD ATTACHMENT <:EVIL:1358015392332779602>")
        .setThumbnail(thumbnail)
        .setImage(file.url)
        .setTimestamp()

        await interaction.followUp("💊 ✅ GEORGE DROYD ACTIVATED: YO SHIT IS UP ✅ 💊");

        for (let i = 0; i < quantity; ++i) {
            await interaction.followUp({ embeds: [embed] });
        }
    },
};