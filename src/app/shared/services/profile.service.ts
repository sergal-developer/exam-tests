import { ProfileEntity, SettingsEntity } from '../data/entities/entities';
import { Utils } from '../data/utils/utils';
import { LocalStorage } from './storage/localstorage';

export class ProfileService {
  context = 'profile';
  contextSettings = 'settings';
  storage = new LocalStorage(this.context);
  utils = new Utils();

  constructor() {}

  getProfiles() {
    return this.storage.getData(this.context);
  }

  getCurrentProfile() {
    const users = this.getProfiles();
    return users ? users.filter((x: ProfileEntity) => x.current)[0] : null;
  }

  saveProfile(data: ProfileEntity) {
    data.userId = data.userId ?? this.utils.createPattern('userxxxx');
    return this.storage.saveInArray(data, 'userId', this.context);
  }

  getSettings(): SettingsEntity {
    let data = this.storage.getData(this.contextSettings);
    if(!data) {
      this.loadDefaultSettings();
      data = this.storage.getData(this.contextSettings);
    }
    return data;
  }

  saveSettings(data: SettingsEntity) {
    return this.storage.saveInObject(data, this.contextSettings);
  }

  loadDefaultSettings() {
    const data: SettingsEntity = {
      colors: ['#E8F1F5', '#FFE4BB', '#E4D7FF', '#FFD6D9', '#E9F5E8', '#E3F4F8'],
      language: 'ESPAÑOL',
      permissions: {
        create: false,
        delete: false,
        duplicate: true,
        edit: false
      },
      theme: 'white'
    }
    this.saveSettings(data);
  }
}
