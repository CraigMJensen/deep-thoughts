const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');

        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },

    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};

      return Thought.find(params).sort({ createdAt: -1 });
    },
  },
};

module.exports = resolvers;
