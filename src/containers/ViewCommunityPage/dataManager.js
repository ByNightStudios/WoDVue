import {
    getCommunityPostService, deleteCommunityPostService
} from "../../service/CommunityServices";
export const getCommunityPost = (id) => {
    return getCommunityPostService(id)
        .then(data => {
            return data;
        })
        .catch(error => {
            throw error;
        })
}
export const deleteCommunityPostList = (id) => {
    return deleteCommunityPostService(id)
        .then(data => {
            return data;
        })
        .catch(error => {
            throw error;
        })
}