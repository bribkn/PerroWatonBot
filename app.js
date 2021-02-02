const { WebClient } = require("@slack/web-api");
const { createEventAdapter } = require("@slack/events-api");
const fetch = require("node-fetch");

const slackSigningSecret = "59b380c8a73a38327f717068ba318925";
const slackToken = "xoxb-1695103100593-1698696593365-LpkO81cJoIMeN8Mk2zg2Ycyx";

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

slackEvents.on("app_mention", (event) => {
    var user = event.text.substring(event.text.lastIndexOf("<"), event.text.lastIndexOf(">") + 2);
    var message = event.text.replace(user, "");
    if (message === "guau") {
        (async () => {
            try {
                await slackClient.chat.postMessage({ channel: event.channel, text: `GUAU GUAU GUAU  <@${event.user}>!: :rage:` });
            } catch (error) {
                console.log(error);
            }
        })();
    } else if (message.indexOf("dofus") >= 0) {
        var item = message.substring(6, message.length);
        var FetchURL = `https://fr.dofus.dofapi.fr/equipments/${item}`;
        fetch(FetchURL, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                (async () => {
                    try {
                        await slackClient.chat.postMessage({
                            channel: event.channel,
                            text: `${data["name"]}\n${data["imgUrl"]}`,
                        });
                    } catch (error) {
                        console.log(error);
                    }
                })();
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        (async () => {
            try {
                await slackClient.chat.postMessage({ channel: event.channel, text: `Guau  <@${event.user}>!: :tada:` });
            } catch (error) {
                console.log(error);
            }
        })();
    }
});

slackEvents.on("error", console.error);

slackEvents.start(3000).then(() => {
    console.log("Server started on port 3000");
});
