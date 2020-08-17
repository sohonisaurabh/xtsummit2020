const { ApolloServer, gql } = require("apollo-server");
const mockTalks = require("./mocks/talks");
const mockSpeakers = require("./mocks/speakers");

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    talks: () => mockTalks,
    // talks: {
    //   title: (parent) => mockTalks[0].title,
    //   talkSpeakers: (parent) =>
    //     mockSpeakers.filter((speaker) => speaker.id === parent.speakers),
    // },
    talk: (parent, args, context, info) =>
      mockTalks.filter((talk) => talk.id === args.id)[0],
    speakers: () => mockSpeakers,
    speaker: (parent, args, context, info) =>
      mockSpeakers.filter((speaker) => speaker.id === args.id)[0],
  },
  Talk: {
    speakers: (talk) => {
      const speakers = [];
      talk.speakers.forEach((talkSpeaker) => {
        const talkSpeakerDetails = mockSpeakers.filter(
          (speaker) => speaker.id === talkSpeaker
        )[0];
        speakers.push(talkSpeakerDetails);
      });

      return speakers;
    },
  },
};

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  type Speaker {
    id: ID
    name: String
    bio: String
  }
  type Talk {
    id: ID
    title: String
    description: String
    duration: Int
    speakers: [Speaker]
  }
  type Query {
    speaker(id: ID!): Speaker
    speakers: [Speaker]
    talks: [Talk]
    talk(id: ID!): Talk
  }
`;

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
