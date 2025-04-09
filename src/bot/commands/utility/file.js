const { SlashCommandBuilder, InteractionContextType, MessageFlags, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("file_upload")
        .setDescription("send a file to the channel")
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
                .setName("title")
                .setDescription("title of the embed")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("thumbnail_url")
                .setDescription("url to the thumbnail (small image at the top right corner), you can use static image or gif")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("description of the embed")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("footer")
                .setDescription("footer of the embed")
                .setRequired(false)
        )
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const file = interaction.options.getAttachment("file");
        const quantity = interaction.options.getInteger("quantity") || 1;
        let thumbnail = interaction.options.getString("thumbnail_url") || null;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const embed = new EmbedBuilder();
        embed.setColor("DarkRed");
        embed.setTitle(interaction.options.getString("title") !== null ? interaction.options.getString("title") : "GEORGE DROYD");

        if (interaction.options.getString("description") !== null) embed.setDescription(interaction.options.getString("description"));
        if (interaction.options.getString("footer") !== null) embed.setFooter({ text: interaction.options.getString("footer") });
        
        embed.setTimestamp()

        if (thumbnail === null) {
            thumbnail = `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png?size=512`;
        } else { // making sure user added a valid link
            try {
                const dummy = await fetch(thumbnail, { method: "HEAD" });
                if (!dummy.ok) {
                    throw new Error();
                }
            } catch (error) {
                await interaction.followUp("💊 ❌ GEORGE DROYD ERROR: YOUR THUMBNAIL LINK IS DEAD ❌ 💊");
                return;
            }
        }
        embed.setThumbnail(thumbnail);

        if (quantity > 5 || quantity < 1) {
            await interaction.followUp("💊 ❌ GEORGE DROYD ERROR: MAXIMUM QUANTITY IS 5 NIGGA! ❌ 💊");
            return;
        }

        if (!file) {
            await interaction.followUp("💊 ❌ GEORGE DROYD ERROR: PUT A VALID FILE YOU BITCH ASS NIGGA ❌ 💊");
            return;
        }

        try {
            if (file.contentType.split("/")[0] === "video") {
                await interaction.followUp("💊 🕒 GEORGE DROYD IS PROCCESSIN YO VIDEO 🕒 💊");
                let response = await fetch(file.url);
                let arrayBuffer = await response.arrayBuffer();
                for (let i = 0; i < quantity; ++i) {
                    await interaction.followUp({ files: [{ name: file.name, attachment: Buffer.from(arrayBuffer) }] });
                }
                return;
            }
        } catch (error) {
            await interaction.followUp(`💊 ⚠️ DAT SHI AIN'T POSSIBLE MAN... DROYD FAILED TO UPLOAD VIDEO BCUZ: (${error}) ⚠️ 💊`);
            return;
        }

        try {    
            if (file.contentType.split("/")[0] === "audio") {
                await interaction.followUp("💊 🕒 GEORGE DROYD IS PROCCESSIN YO BEAT 🕒 💊");
                let response = await fetch(file.url);
                let arrayBuffer = await response.arrayBuffer();
                for (let i = 0; i < quantity; ++i) {
                    await interaction.followUp({ files: [{ name: file.name, attachment: Buffer.from(arrayBuffer) }] });
                }
                return;
            }
        } catch (error) {
            await interaction.followUp(`💊 ⚠️ DAT SHI AIN'T POSSIBLE MAN... DROYD FAILED TO UPLOAD AUDIO BCUZ: (${error}) ⚠️ 💊`);
            return;
        }


        if (file.contentType.split("/")[0] === "image") {
            embed.setImage(file.url);
            await interaction.followUp("💊 ✅ GEORGE DROYD ACTIVATED: YO SHIT IS UP ✅ 💊");
            for (let i = 0; i < quantity; ++i) {
                await interaction.followUp({ embeds: [embed] });
            }
            return;
        }

        // triggered when file is not Image/Video/Audio
        const response = await fetch(file.url);
        const arrayBuffer = await response.arrayBuffer();

        await interaction.followUp("💊 ✅ GEORGE DROYD ACTIVATED: YO SHIT IS UP ✅ 💊");
        
        for (let i = 0; i < quantity; ++i) {
            await interaction.followUp({ files: [{ name: file.name, attachment: Buffer.from(arrayBuffer) }] });
        }
    },
};