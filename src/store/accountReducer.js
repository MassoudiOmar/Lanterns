// action - state management
import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT } from './actions';

export const initialState = {
    token: '',
    isLoggedIn: false,
    isInitialized: false
};

//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
            const { isLoggedIn, token } = action.payload;
            return {
                ...state,
                isLoggedIn,
                isInitialized: true,
                token
            };
        }
        case LOGIN: {
            return {
                ...state,
                isLoggedIn: true
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isLoggedIn: false,
                token: ''
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
