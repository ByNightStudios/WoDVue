import {
  addBlogService,
  addCommunityPostService,
} from '../../service/CommunityServices';

export const addBlog = (state) => {
  let body = {
    community_feed_id: state.community_feed_id,
    title: state.title,
    author: state.author,
    image_uuid: state.image_uuid,
    category_id: 1,
    status: state.status,
    content: state.content,
    description: state.description,
    theme_id: state.theme_id,
  };

  return addBlogService(body)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const createFeed = () => {
  return addCommunityPostService({
    category_id: 1,
  })
    .then((res) => {
      return res.data.id;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
