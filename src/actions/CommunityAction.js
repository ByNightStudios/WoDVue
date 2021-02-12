import * as Types from '../common/backendConstants';
import { getCommunityPostListService } from '../service/CommunityServices';

export const dispatchAddBlog = (body) => (dispatch) => {
  dispatch({
    type: Types.ADDBLOG,
    payload: body,
  });
};
export const dispatchCommunityFailure = (error) => (dispatch) => {
  dispatch({
    type: Types.COMMUNITYFAILURE,
    payload: { error },
  });
};

export const dispatchAddOffer = (body) => (dispatch) => {
  dispatch({
    type: Types.ADDOFFER,
    payload: body,
  });
};

export const dispatchAddEvent = (body) => (dispatch) => {
  dispatch({
    type: Types.ADDEVENT,
    payload: body,
  });
};

export const getCommunityPostList = (body) => (dispatch) => {
  return getCommunityPostListService(body)
    .then((data) => {
      dispatch({
        type: Types.COMMUNITYPOSTLIST,
        payload: data,
      });
    })
    .catch((error) => {
      dispatch({
        type: Types.COMMUNITYFAILURE,
        payload: { error },
      });
    });
};
