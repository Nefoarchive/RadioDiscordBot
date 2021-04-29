// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const http = require("http");
const Discord = require("discord.js");
const token = process.env.DISCORD_TOKEN;
const client = new Discord.Client({
  partials: ["REACTION", "MESSAGE"],
  ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] }
});

function trim(string, max) {
  if (string.length <= max) return string;
  return `${string.slice(0, max - 3)}...`;
}
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://elshinta-jakarta.glitch.me/`);
}, 60000);

client.once("ready", () => {
  console.log("Ready!");
  client.user.setActivity("Elshinta Jakarta | elshinta!help", {
    type: "LISTENING"
  });
});
client.on("voiceStateUpdate", (oldState, newState) => {
  (async function() {
    let newStateChannel = newState.channel;
    let oldStateChannel = oldState.channel;

    var connection, dispatcher;
    if (
      !oldStateChannel &&
      newStateChannel.id === "723672187428405290" &&
      !newStateChannel.members.get("723671217311318058")
    ) {
      connection = await newStateChannel.join();
      dispatcher = connection.play("http://202.137.4.147:8000");

      dispatcher.on("error", console.error);
      dispatcher.on("finish", () => {
        newStateChannel.leave();
      });
    } else if (
      oldStateChannel &&
      oldStateChannel.id === "723672187428405290" &&
      oldStateChannel.members.size === 1 &&
      oldStateChannel.members.get("723671217311318058")
    ) {
      oldStateChannel.leave();
    }
  })();
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith("elshinta!")) return;
  const args = message.content.split(" ");
  const command = args
    .shift()
    .toLowerCase()
    .slice(9);
  if (
    command === "stats" ||
    command === "statistics" ||
    command === "botinfo"
  ) {
    message.channel.send("Please wait. We are loading it.").then(msg => {
      let uptime = client.uptime / 60000;
      let embed = new Discord.MessageEmbed()
        .setColor("#2a1768")
        .setTitle("Nefobot Radio - Statistics")
        .setAuthor(
          "Nefomemes#3927",
          "https://images-ext-2.discordapp.net/external/H8843lgI8AAUZNYj77GcAxLOqaFBj7GJNOjqt2HADWk/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/665419057075585025/a27f6d406ad2a810a02b7feae825186b.png",
          "https://nefomemes.blogspot.com/"
        )
        .setDescription(
          `Discord API latency: ${
            client.ws.ping
          }ms \nBot latency: ${msg.createdTimestamp -
            message.createdTimestamp}ms\nUptime: ${uptime.toFixed(2)} minutes.`
        )
        .setThumbnail(
          "https://images-ext-2.discordapp.net/external/H8843lgI8AAUZNYj77GcAxLOqaFBj7GJNOjqt2HADWk/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/665419057075585025/a27f6d406ad2a810a02b7feae825186b.png"
        )
        .setTimestamp()
        .setFooter(
          "Prefix: elshinta! | This bot is the same as Nefobot. Just dedicated to radio and only available in the Nefobot support server."
        );
      message.channel.send(embed).then(() => {
        msg.delete();
      });
    });
  } else if (
    command === "help" ||
    command === "faq" ||
    command === "command" ||
    command === "faqs"
  ) {
    let embed = new Discord.MessageEmbed()
      .setColor("#2a1768")
      .setTitle("Elshinta Jakarta")
      .setAuthor(
        "Nefomemes#3927",
        "https://images-ext-2.discordapp.net/external/H8843lgI8AAUZNYj77GcAxLOqaFBj7GJNOjqt2HADWk/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/665419057075585025/a27f6d406ad2a810a02b7feae825186b.png",
        "https://nefomemes.blogspot.com/"
      )
      .setDescription(
        "To start listening to Elshinta Jakarta. Just join the Elshinta Jakarta voice channel. Don't worry, the bot will join you once you  joined and start playing the radio.\n\nThis is an Indonesian-speaking radio. So flex your Indonesian skills first.\n\nIf you find any bugs, please file a bug report to <#717318144292814868>. Ah, yes. This bot is literally Nefobot Radio, so use the `nefo!bug` command. Not only this command that is available, but there is also `nefo!stats` command. Well,this bot is not intended like Nefobot."
      )
      
      .setTimestamp()
      .setFooter(
        "Prefix: rri! | Powered by Radio Republik Indonesia",
        "https://images-ext-1.discordapp.net/external/pxsTpELab7GxwnymoY05gy6-vt4vkToPRd03k0RDXXs/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/723479464800944168/820d437123249cb81b8d862288a7f20f.png?width=375&height=375"
      );

    message.channel.send(embed);
  }
});

client.login(token);

