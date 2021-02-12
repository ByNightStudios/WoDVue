import {
  addBlogService,
  getCommunityPostService
} from '../../service/CommunityServices';

export const updateBlog = state => {
  let body = {
    community_feed_id: state.community_feed_id,
    title: state.title,
    author: state.author,
    image_uuid: state.image_uuid,
    category_id: 1,
    status: state.status,
    content: state.content,
    description: state.description,
    theme_id: state.theme_id
  };
  return addBlogService(body)
    .then(data => {
      return data;
    })
    .catch(error => {
      throw error.response.data;
    });
};
export const getCommunityPost = id => {
  return getCommunityPostService(id)
    .then(data => {
      return data;
    })
    .catch(error => {
      throw error.response.data;
    });
};
