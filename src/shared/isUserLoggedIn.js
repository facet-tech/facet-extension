import isDevelopment from "../utils/isDevelopment";
import { storage } from "./constant";
import { getKeyFromLocalStorage } from "./loadLocalStorage";

export default async () => {
    if(isDevelopment()) {
        return true;
    }
    const username = await getKeyFromLocalStorage(storage.username);
    return Boolean(username);
}