
const AuthReducer = (state,action) => {
    switch(action.type)
    {
      case "LOGIN":
        return {
            user : action.user
        }
        case "LOGOUT":
            return {
                user:null
            }
         default : 
         return state;
    }
 
}

export default AuthReducer;