import {cashay} from 'cashay';
import jwtDecode from 'jwt-decode';
import {EventTypes} from 'redux-segment';
import ActionHTTPTransport from '../utils/ActionHTTPTransport';

const SET_AUTH_TOKEN = '@@authToken/SET_AUTH_TOKEN';
const REMOVE_AUTH_TOKEN = '@@authToken/REMOVE_AUTH_TOKEN';

const initialState = {
  token: null,
  obj: {
    // rol and tms are not guaranteed
    aud: null,
    exp: null,
    iat: null,
    iss: null,
    sub: null,
  }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_AUTH_TOKEN: {
      const {obj, token} = action.payload;
      return {obj, token};
    }
    case REMOVE_AUTH_TOKEN:
      return initialState;
    default:
      return state;
  }
}

export function setAuthToken(authToken, metaProfile = {}) {
  const profile = metaProfile || {};
  if (!authToken) {
    throw new Error('setAuthToken action created with undefined authToken');
  }
  let obj = null;
  try {
    obj = jwtDecode(authToken);
  } catch (e) {
    throw new Error(`unable to decode jwt: ${e}`);
  }
  cashay.create({httpTransport: new ActionHTTPTransport(authToken)});
  return {
    type: SET_AUTH_TOKEN,
    payload: {
      obj,
      token: authToken
    },
    meta: {
      analytics: {
        eventType: EventTypes.identify,
        eventPayload: {
          userId: obj.sub,
          traits: {
            avatar: profile.picture,
            createdAt: profile.created_at,
            email: profile.email,
            name: profile.name
          }
        }
      }
    }
  };
}

export function removeAuthToken() {
  return { type: REMOVE_AUTH_TOKEN };
}
