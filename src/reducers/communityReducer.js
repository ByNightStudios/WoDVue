import { ADDEVENT, ADDBLOG, ADDOFFER, COMMUNITYPOSTLIST, COMMUNITYFAILURE } from '../common/backendConstants'
export default function (state = {}, action) {
    switch (action.type) {
        case ADDBLOG:
            return {
                ...state,
                blog: action.payload
            }
        case ADDEVENT:
            return {
                ...state,
                event: action.payload
            }
        case ADDOFFER:
            return {
                ...state,
                offer: action.payload
            }
        case COMMUNITYPOSTLIST:
            return {
                ...state,
                list: action.payload
            }
        case COMMUNITYFAILURE:
            return {
                ...state,
                Error: action.payload
            }
        default:
            return state;
    }
}