const { ApolloServer, gql } = require("apollo-server");
// const mockTalks = require("./mocks/talks");
// const mockSpeakers = require("./mocks/speakers");
// const mockReviews = require("./mocks/reviews");
// const mockUsers = require("./mocks/users");
const fetch = require("isomorphic-fetch");

const TALKS = "talks";
const SPEAKERS = "speakers";
const REVIEWS = "reviews";
const USERS = "users";

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    talks: async () => {
      return await getMockTalks();
    },
    talk: async (parent, args, context, info) => {
      const mockTalks = await getMockTalks();
      return mockTalks.filter((talk) => talk.id === args.id)[0];
    },
    speakers: async () => {
      return await getMockSpeakers();
    },
    speaker: async (parent, args, context, info) => {
      const mockSpeakers = await getMockSpeakers();
      return mockSpeakers.filter((speaker) => speaker.id === args.id)[0];
    },
    reviews: async () => {
      return await getMockReviews();
    },
    review: async (parent, args, context, info) => {
      const mockReviews = await getMockReviews();
      return mockReviews.filter((review) => review.id === args.id)[0];
    },
  },
  Talk: {
    speakers: async (talk) => {
      const speakers = [];
      const mockSpeakers = await getMockSpeakers();

      talk.speakers.forEach((talkSpeaker) => {
        const talkSpeakerDetails = mockSpeakers.filter(
          (speaker) => speaker.id === talkSpeaker
        )[0];
        speakers.push(talkSpeakerDetails);
      });

      return speakers;
    },
    reviews: async (talk) => {
      const mockReviews = await getMockReviews();
      return mockReviews.filter((review) => review.reviewFor === talk.id);
    },
  },
  Review: {
    reviewBy: async (review) => {
      const mockUsers = await getMockUsers();
      return mockUsers.filter((user) => user.id === review.reviewBy)[0];
    },
    reviewFor: async (review) => {
      const mockTalks = await getMockTalks();
      return mockTalks.filter((talk) => talk.id === review.reviewFor)[0];
    },
  },
  User: {
    reviews: async (user) => {
      const mockReviews = await getMockReviews();
      return mockReviews.filter((review) => review.reviewBy === user.id);
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
    reviews: [Review]
  }
  type User {
    id: ID
    name: String
    reviews: [Review]
  }
  type Review {
    id: ID
    rating: Int
    description: String
    reviewBy: User
    reviewFor: Talk
  }
  type Query {
    speaker(id: ID!): Speaker
    speakers: [Speaker]
    talks: [Talk]
    talk(id: ID!): Talk
    reviews: [Review]
    review(id: ID): Review
  }
`;

function fetchData(url) {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "secret-key":
        "$2b$10$MFkl88qaV6.uEPITnIT3wOvGlGLMPRil6exTdd9CflJB6.2gOye4O",
    },
  });
}

const APIMapper = {
  [TALKS]: "https://api.jsonbin.io/b/5f3d3719af209d1016bed794",
  [SPEAKERS]: "https://api.jsonbin.io/b/5f3d41b74d9399103618358f",
  [USERS]: "https://api.jsonbin.io/b/5f3d41814d93991036183563",
  [REVIEWS]: "https://api.jsonbin.io/b/5f3d411f4d9399103618352a",
};

async function getMockTalks() {
  const mockTalks = inMemoryCache.get(TALKS);
  if (!mockTalks) {
    const response = await fetchData(APIMapper[TALKS]);
    const mockTalks = await response.json();
    console.log("Talks are---", mockTalks);
    inMemoryCache.set(TALKS, mockTalks);
    return mockTalks;
  } else {
    return mockTalks;
  }
}

async function getMockSpeakers() {
  const mockSpeakers = inMemoryCache.get(SPEAKERS);
  if (!mockSpeakers) {
    const response = await fetchData(APIMapper[SPEAKERS]);
    const mockSpeakers = await response.json();
    console.log("Speakers are---", mockSpeakers);
    inMemoryCache.set(SPEAKERS, mockSpeakers);
    return mockSpeakers;
  } else {
    return mockSpeakers;
  }
}

async function getMockUsers() {
  const mockUsers = inMemoryCache.get(USERS);
  if (!mockUsers) {
    const response = await fetchData(APIMapper[USERS]);
    const mockUsers = await response.json();
    inMemoryCache.set(USERS, mockUsers);
    console.log("Users are---",  mockUsers);
    return mockUsers;
  } else {
    return mockUsers;
  }
}

async function getMockReviews() {
  const mockReviews = inMemoryCache.get(REVIEWS);
  if (!mockReviews) {
    const response = await fetchData(APIMapper[REVIEWS]);
    const mockReviews = await response.json();
    inMemoryCache.set(REVIEWS, mockReviews);
    console.log("Reviews are---",  mockReviews);
    return mockReviews;
  } else {
    return mockReviews;
  }
}

const inMemoryCache = {
  get: function (key) {
    console.log("Cache is---", this);
    return this[key];
  },
  set: function (key, value) {
    console.log("Setting for---", key)
    this[key] = value;
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
});

// The `listen` method launches a web server.
server.listen().then(async ({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
