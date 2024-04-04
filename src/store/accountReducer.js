// action - state management
import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT } from './actions';

export const initialState = {
    token: '',
    isLoggedIn: false,
    role: '',
    perm: '',
    fullname: '',
    isInitialized: false
};

//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
            const { isLoggedIn, token, role,perm, fullname } = action.payload;
            return {
                ...state,
                isLoggedIn,
                role,
                perm,
                fullname,
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
                token: '',
                role: '',
                perm:[],
                fullname: ''
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
