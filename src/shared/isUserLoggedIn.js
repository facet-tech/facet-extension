import { storage } from "./constant";
import { getKeyFromLocalStorage } from "./loadLocalStorage";

export default async () => {
    const username = await getKeyFromLocalStorage(storage.username);
    return Boolean(username);
}