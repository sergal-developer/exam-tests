import { ProfileEntity } from '../data/entities/entities';
import { Utils } from '../data/utils/utils';
import { LocalStorage } from './storage/localstorage';

export class ProfileService {
  context = 'profile';
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
    return this.storage.saveInArray(data, data.userId, this.context);
  }
}
