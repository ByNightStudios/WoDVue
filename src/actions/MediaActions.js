import { IMAGE_UPLOAD_URL, ICON_UPLOAD_URL } from "../common/backendConstants";

export const imageUpload = (file, file_type) => (
  dispatch,
  getState,
  { api }
) => {
  var bodyFormData = new FormData();
  bodyFormData.append("file", file);
  bodyFormData.set("file_type", file_type);

  return api
    .post(IMAGE_UPLOAD_URL, bodyFormData)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error.response.data;
    });
};

export const iconUpload = (file, owner_type, file_type) => (
  dispatch,
  getState,
  { api }
) => {
  var bodyFormData = new FormData();
  bodyFormData.append("file", file);
  bodyFormData.set("file_type", file_type);
  bodyFormData.set("owner_type", owner_type);

  return api
    .post(ICON_UPLOAD_URL, bodyFormData)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error.response.data;
    });
};
