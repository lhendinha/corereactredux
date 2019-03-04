const setNameType = "SET_NAME";
const setUsernameType = "SET_USERNAME";
const setFirstNameType = "SET_FIRST_NAME";
const setLastNameType = "SET_LAST_NAME";
const setEmailType = "SET_EMAIL";
const setPasswordType = "SET_PASSWORD";
const setConfirmPasswordType = "SET_CONFIRM_PASSWORD";
const setUserType = "SET_USER";

const initialState = {
  name: "",
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  user: {}
};

export const actionCreators = {
  setName: name => ({ type: setNameType, payload: name }),
  setUsername: username => ({ type: setUsernameType, payload: username }),
  setFirstName: firstName => ({ type: setFirstNameType, payload: firstName }),
  setLastName: lastName => ({ type: setLastNameType, payload: lastName }),
  setEmail: email => ({ type: setEmailType, payload: email }),
  setPassword: password => ({ type: setPasswordType, payload: password }),
  setConfirmPassword: confirmPassword => ({
    type: setConfirmPasswordType,
    payload: confirmPassword
  }),
  setUser: user => ({ type: setUserType, payload: user })
};

// Object assign instead of Spread operator is because of performance, 54% faster than spread syntax.
export const reducer = (state = initialState, action) => {
  state = state || initialState;

  switch (action.type) {
    case setUserType:
      //return { ...state, user: action.payload };
      return Object.assign({}, state, { user: action.payload });
      break;

    case setNameType:
      //return { ...state, name: action.payload };
      return Object.assign({}, state, { name: action.payload });
      break;

    case setUsernameType:
      //return { ...state, username: action.payload}
      return Object.assign({}, state, { username: action.payload });
      break;

    case setFirstNameType:
      //return { ...state, firstName: action.payload };
      return Object.assign({}, state, { firstName: action.payload });
      break;

    case setLastNameType:
      //return { ...state, lastName: action.payload };
      return Object.assign({}, state, { lastName: action.payload });
      break;

    case setEmailType:
      //return { ...state, email: action.payload };
      return Object.assign({}, state, { email: action.payload });
      break;

    case setPasswordType:
      //return { ...state, password: action.payload };
      return Object.assign({}, state, { password: action.payload });
      break;

    case setConfirmPasswordType:
      //return { ...state, confirmPassword: action.payload };
      return Object.assign({}, state, { confirmPassword: action.payload });
      break;

    default:
      return state;
      break;
  }
};
