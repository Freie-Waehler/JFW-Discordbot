import * as Discord from "$discord";
import { config } from "$dotenv";
import { messageCreate } from "./events/message.ts";
import { ready } from "./events/ready.ts";

/*
  Der Token des Bots ist in der ".env"-Datei gespeichert. Sie sieht in etwa so aus:
  token=ABC.DEF.GHI-JKL
*/
const env = config();

const bot = Discord.createBot({
	token: env.token,
	// Keine Ahnung, wozu die gut sind… Aber wird schon passen.
	intents: Discord.Intents.Guilds | Discord.Intents.GuildMessages | Discord.Intents.MessageContent,
	events: {
		ready: ready,
		messageCreate: messageCreate,
	},
});

/*
  TODO: Hier muss noch eine Behandlung der möglichen Errors hin. Bisher stoppt das Programm bei jedem möglichen Error, der irgendwo geworfen wird.
  Dass das unsinnig ist, muss ich nicht weiter erklären. Man könnte den Error automatisch in den moderator-only-Kanal per Webhook schicken, sodass
  die Programmierer immer auf dem neuesten Stand sind.
*/
await Discord.startBot(bot);
