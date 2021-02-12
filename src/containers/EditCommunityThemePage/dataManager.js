import CommunityThemeServiceFile from '../../service/CommunityThemeService';
const CommunityThemeService = new CommunityThemeServiceFile();

class EditCommunityThemeManager {
  editCommunityTheme(inputs) {
    let payload = {
      theme: inputs.theme,
      image_uuid: inputs.image_uuid ? inputs.image_uuid : null,
      theme_id: inputs.themeID
    };
    return CommunityThemeService.editCommunityTheme(payload);
  }

  getCommunityThemeByID(inputs) {
    return CommunityThemeService.getCommunityThemeByID(inputs);
  }
}

export default EditCommunityThemeManager;
