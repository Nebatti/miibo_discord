import { readFile } from 'fs/promises'
import { Client, GatewayIntentBits, Partials } from 'discord.js'

const {
  DISCORD_CLIENT_ID,
  DISCORD_BOT_TOKEN,
  MIIBO_API_KEY,
  MIIBO_AGENT_ID,
} = JSON.parse(await readFile('./config.json'))

// Creating a new client with intents and partials needed for this bot to function.
// partials makes sure that we receive the full data of the object returned from events.
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

// messageCreate event captures data of a message that is created/posted.
client.on('messageCreate', message => {
  const isMentionedMe = message.mentions.users.has(DISCORD_CLIENT_ID)
  if (isMentionedMe) {
    const body = JSON.stringify({
      api_key: MIIBO_API_KEY,
      agent_id: MIIBO_AGENT_ID,
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

client.login(DISCORD_BOT_TOKEN)
