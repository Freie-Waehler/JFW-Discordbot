import * as Discord from "$discord";

export const github_webhook = 1119620972908126280n;
const regelwerk_channel_id = 1119572787133169664n;
// Die URL des Repos und des Zweiges, wo das Regelwerk liegt.
const BASE_URL = "https://raw.githubusercontent.com/Freie-Waehler/JFW-Regelwerk-Discord/master/";

/**
 * Damit nicht jede Funktion zweimilliarden Parameter hat, packen wir sie einfach in ein gemeinsames Objekt.
 */
interface RegelwerkUpdate {
	bot: Discord.Bot;
	contents: string[];
	messages: Discord.Message[];
}

/**
 * Aktualisiert das Regelwerk auf Discord.
 * TODO: Automatisch alle Artikel herunterladen, sortieren, und dann modifizieren, anstatt hart zu kalkulieren, wann welcher Artikel kommt.
 */
export async function update(bot: Discord.Bot) {
	const regelwerk: RegelwerkUpdate = {
		bot: bot,
		contents: [
			await (await fetch(BASE_URL + "README.md")).text(),
			await (await fetch(BASE_URL + "00-Begriffserklärungen.md")).text(),
			await (await fetch(BASE_URL + "01-Gültigkeit.md")).text(),
			await (await fetch(BASE_URL + "02-Kanäle-und-Nachrichten.md")).text(),
			await (await fetch(BASE_URL + "03-Umgang-in-Kanälen.md")).text(),
		],
		messages: [],
	};
	/*
		Schauen, ob schon Nachrichten in dem Regelwerk-Kanal existieren.
		Falls ja, werden sie der Reihenfolge nach bearbeitet, falls nein, werden sie neu erstellt.
	*/
	const messages = await Discord.getMessages(bot, regelwerk_channel_id);
	if (messages.size == 0) await create(regelwerk);
	else {
		regelwerk.messages = messages.array().sort((a, b) => a.timestamp - b.timestamp);
		await modify(regelwerk);
	}
}

/**
 * Erstellt die Nachrichten des Regelwerks komplett neu.
 */
async function create(regelwerk: RegelwerkUpdate) {
	for (const content of regelwerk.contents) {
		await Discord.sendMessage(regelwerk.bot, regelwerk_channel_id, { content });
	}
}

/**
 * Modifiziert die existierenden Nachrichten des Regelwerks.
 */
async function modify(regelwerk: RegelwerkUpdate) {
	if (regelwerk.contents.length != regelwerk.messages.length) {
		throw new Error(
			`Das Regelwerk hat ${regelwerk.contents.length} Abschnitte, aber es gibt ${regelwerk.messages.length} Nachrichten im Regelwerk-Kanal.`,
		);
	}

	for (let i = 0; i < regelwerk.messages.length; ++i) {
		const message = regelwerk.messages[i];
		const content = regelwerk.contents[i];
		await Discord.editMessage(regelwerk.bot, regelwerk_channel_id, message.id, { content });
	}
}
