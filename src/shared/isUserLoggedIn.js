import isDevelopment from "../utils/isDevelopment";
import { storage } from "./constant";
import { getKeyFromLocalStorage } from "./loadLocalStorage";
import AmplifyService from '../services/AmplifyService'

export default async () => {
    try {
        if (isDevelopment()) {
            return true;
        }
        const result = await AmplifyService.getCurrentUserJTW();
        return Boolean(result);
    } catch (e) {
        return false;
    }
}