// This file contains the code for the Discord bot that will be used to listen for message updates and download the webp image files that are posted as attachments in the message updates
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const express = require("express");
const router = express.Router();

// Bring in dotenv to get the bot token from the .env file
require("dotenv").config();

// Create a new Discord client
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { env } = require("process");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

// Replace the value of 'token' with my bot token
const TOKEN = process.env.TOKEN;

// Log our bot in
client.login(TOKEN);

//Event listener for when the bot is ready

client.once(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

//Event listener for message updates to download webp image file when the other server's bot updates a message
client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
	newMessage.attachments.forEach((attachment) => {
		if (attachment.url) {
			//Save file at attachment.url to /public/botdownloads
			axios({ url: attachment.url, responseType: "stream" }).then(
				(response) => {
					response.data.pipe(
						//Create a new file, use the message id as a guid for the file name
						fs.createWriteStream(`public/botdownloads/${newMessage.id}.webp`)
					);
				}
			);
		}
	});
});

module.exports = router;
module.exports = client;
