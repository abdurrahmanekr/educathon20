function sendStatement(verb, object, objectId) {
  const player = GetPlayer();
  const userName = player.GetVar("userName");
  const avatarName = player.GetVar("avatarName");
  const conf = {
        endpoint: 'https://educathon20-lrs.lrs.io/xapi/',
        auth: 'Basic ' + toBase64('dejevh:arokos'),
    };

  ADL.XAPIWrapper.changeConfig(conf);

  const statement = {
    "actor": {
      "name": userName,
      "mbox": "mailto:educathon20@educathon20.herokuapp.com",
    },
    "verb": {
      "id": "https://educathon20.herokuapp.com/course/xapi/" + verb,
      "display": { "en-US": verb }
    },
    "object": {
      "id": "https://educathon20.herokuapp.com/course/" + objectId,
      "definition": {
        "name": {
          "en-US": object,
        },
        "description": {
          "en-US": object,
        },
      },
    },
  };

  const result = ADL.XAPIWrapper.sendStatement(statement);
}