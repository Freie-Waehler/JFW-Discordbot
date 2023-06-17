import * as Discord from "$discord";
import * as Regelwerk from "../regelwerk.ts";

/*
  Hier wird nur geschaut, ob die gesendete Nachricht von einem bestimmten Webhook gesendet wurde.
  Falls es sich um die Webhook handelt, die die Regelwerkänderungen von Github in moderator-only schickt,
  soll das Regelwerk auch auf Discord aktualisiert werden.
*/
export function messageCreate(bot: Discord.Bot, message: Discord.Message) {
	if (message.webhookId == Regelwerk.github_webhook) {
		Regelwerk.update(bot);
	}
}
