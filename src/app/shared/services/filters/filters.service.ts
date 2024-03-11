import { Injectable } from "@angular/core";
import { StorageWeb } from "../storage/storage.session";

@Injectable()
export class FiltersServicesApi {
    db: StorageWeb;
    context = 'FILTERS';

    constructor() {
        this.db = new StorageWeb();
    }
    //#endregion FILTER SERVICES
}