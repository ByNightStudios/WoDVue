import * as APIs from '../common/backendConstants';
import { axiosInstance } from '../store/store'


export const addEventService = (body) => {
    return axiosInstance.put(APIs.ADD_EVENT_URL, body);
};
export const addBlogService = (body) => {
    return axiosInstance.put(APIs.ADD_BLOG_URL, body);
};
export const addOfferService = (body) => {
    return axiosInstance.put(APIs.ADD_OFFER_URL, body);
};
export const addCommunityPostService = (body) => {
    return axiosInstance.post(APIs.ADD_COMMUNITY_POST_URL, body);
}
export const getCommunityPostListService = (page = 1, query = '', status = null) => {
    let url = `${APIs.COMMUNITY_POSTLIST_URL}?page=${page}`
    if (query)
        url = `${url}&query=${query}`;

    if (status)
        url = `${url}&category=${status}`;
    // return axiosInstance.get(url);
    return axiosInstance.get(url);

};

export const getCommunityPostService = (param) => {
    return axiosInstance.get(APIs.GET_COMMUNITY_POST_URL.replace(':id', param));
};

export const deleteCommunityPostService = (body) => {
    return axiosInstance.delete(APIs.DELETE_COMMUNITY_POST_URL.replace(':id', body));
}