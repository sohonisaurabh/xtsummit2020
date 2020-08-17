const SpeakerType = require("../speakers");

const TalkType = `type Talk {
    title: String
    description: String
    duration: Int
    speaker: ${SpeakerType}
}`;

module.exports = TalkType;
