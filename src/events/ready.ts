import * as Discord from "$discord";
import * as Regelwerk from "../regelwerk.ts";

const mod_only_channel_id = 1119601313773277194n;

export function ready(bot: Discord.Bot) {
	console.log("Successfully connected to gateway");
	Discord.sendMessage(bot, mod_only_channel_id, { content: "Ich wurde neugestartet." });
	/*
		Weil der Bot im ausgeschalteten Zustand logischerweise nicht nachvollziehen kann, ob eine Änderung am Regelwerk stattfand,
		muss einfach immer davon ausgehen und bei einem Neustart einmal aktualisieren. Das kann man aber gerne asynchron lassen, damit
		es nicht so viel Leistung frisst.
	*/
	Regelwerk.update(bot);
}
