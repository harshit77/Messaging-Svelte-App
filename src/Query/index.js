import { gql } from "apollo-boost";

const Queries = {
  newUserSubscription: gql`
    subscription newUser {
      newUser {
        id
        username
      }
    }
  `,
  newChannelMessageSubscription: gql`
    subscription newChannelMessage($channelId: ID!) {
      newChannelMessage(channelId: $channelId) {
          text
        user {
          username
          id
        }
        channel {
          id
          name
        }
        createdAt
      }
    }
  `,

  newTeamSubscription: gql`
    subscription newTeamMessage {
      newTeamMessage {
        id
        name
        owner {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  `,
  newUserMessageSubscription: gql`
  subscription newUserMessage($receiverId: Int!) {
    newUserMessage(receiverId: $receiverId) {
          id
          createdAt
          senderId
          receiverId
          text
      }
  }
`,

  getAllUsers: gql`
    query getAllUsers {
      getAllUsers {
        id
        username
        email
      }
    }
  `,
  teams: gql`
    query allTeams {
      allTeams {
        id
        name
        owner {
          id
        }
        channels {
          id
          name
        }
      }
      otherTeams {
        id
        name
        owner {
          id
        }
        channels {
          id
          name
        }
      }
    }
  `,
  allMessages: gql`
    query allMessages($channelId: ID!) {
      allMessages(channelId: $channelId) {
        ok
        message {
          id
          text
          user {
            username
            id
          }
          channel {
            id
            name
          }
          createdAt
        }
      }
    }
  `,
  getAllUserMessageById: gql`
  query getAllUserMessageById($receiverId:Int!) {
    getAllUserMessageById(receiverId: $receiverId) {
        ok
        message {
          id
          createdAt
          senderId
          receiverId
          text
        }
      }
    }
`,
  register: gql`
    mutation register($username: String!, $email: String!, $password: String!) {
      register(username: $username, email: $email, password: $password) {
        ok
        user {
          id
          username
        }
        errors {
          path
          message
        }
      }
    }
  `,
  login: gql`
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        ok
        token
        errors {
          path
          message
        }
      }
    }
  `,
  createTeam: gql`
    mutation createTeam($name: String!) {
      createTeam(name: $name) {
        ok
        id
        name
        owner {
          id
          username
        }
        channels {
          id
          name
        }
        errors {
          message
          path
        }
      }
    }
  `,
  createChannel: gql`
    mutation createChannel($name: String!) {
      createChannel(name: $name) {
        ok
        channel {
          id
          name
        }
        errors {
          message
          path
        }
      }
    }
  `,
  createMember: gql`
    mutation createMember($email: String!, $teamId: Int!) {
      createMember(email: $email, teamId: $teamId) {
        ok
        errors {
          message
          path
        }
      }
    }
  `,
  createMessage: gql`
    mutation createMessage($channelId: ID!, $text: String!) {
      createMessage(channelId: $channelId, text: $text) {
        ok
        message {
          id
          createdAt
          text
          user {
            id
            username
          }
          channel {
            id
            name
          }
        }
      }
    }
  `,
  createuserTouserMessage: gql`
    mutation createuserTouserMessage($receiverId: Int!, $text: String!) {
      createuserTouserMessage(receiverId: $receiverId, text: $text) {
        ok
        message {
          id
          createdAt
          senderId
          receiverId
          text
        }
      }
    }
  `,
  upload: gql`
  mutation upload($file: Upload!) {
    uploadFiles(file: $file) {
      id
      fileName
      mimeType
      path
    }
  }
  `
};

export default Queries;
