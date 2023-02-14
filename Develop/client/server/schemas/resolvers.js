const { User } = require('../models');
const{AuthenticationError} = require("apollo-server-express")
const {signToken} = require("../utils/auth");
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if(context.user){
        return User.findOne({_id: context.user._id});
      }
      throw new AuthenticationError("You must be logged in.")

    },
    
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args)
      const token = signToken(user)
      return{token, user}
    },
    createVote: async (parent, { _id, techNum }) => {
      const vote = await Matchup.findOneAndUpdate(
        { _id },
        { $inc: { [`tech${techNum}_votes`]: 1 } },
        { new: true }
      );
      return vote;
    },
  },
};

module.exports = resolvers;
