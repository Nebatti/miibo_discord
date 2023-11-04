import keepAlive from './server.js'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import * as dotenv from 'dotenv'
dotenv.config()

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.User,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember,
  ],
})

client.on('messageCreate', message => {
  const isMentionedMe = message.mentions.users.has(process.env.DISCORD_CLIENT_ID)
  if (isMentionedMe) {
    const body = JSON.stringify({
      api_key: process.env.MIIBO_API_KEY,
      agent_id: process.env.MIIBO_AGENT_ID,
      utterance: message.content,
    })
    fetch('https://api-mebo.dev/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .then(response => response.json())
      .then(data => message.reply(data.bestResponse.utterance))
      .catch(error => console.log(error))
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
keepAlive()
