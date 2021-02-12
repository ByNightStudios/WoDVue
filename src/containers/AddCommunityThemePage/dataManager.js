import CommunityThemeServiceFile from '../../service/CommunityThemeService';
const CommunityThemeService = new CommunityThemeServiceFile();

class AddCommunityThemeManager {
  addCommunityTheme(inputs) {
    let payload = {
      theme: inputs.theme,
      image_uuid: inputs.image_uuid ? inputs.image_uuid : null
    };
    return CommunityThemeService.addCommunityTheme(payload);
  }
}

export default AddCommunityThemeManager;
