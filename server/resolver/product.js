
const resolvers = {
  Query: {
    products: async (_, args=null, context) => {
      return "read users"
    },
    product: async (_, args=null, req) => {
      return "read user"
    }


      
  },
  Mutation: {
     
      
  }
  
};

export default resolvers;
