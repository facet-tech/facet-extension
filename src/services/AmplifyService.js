import { Auth } from "aws-amplify";

export default class {

    static getCurrentUserJTW = async () => {
        try {
            const result = await Auth.currentSession();
            const jwtToken = result?.accessToken?.jwtToken;
            return jwtToken;
        } catch (e) {
            console.log('[ERROR][getCurrentUserJTW]', e)
            return undefined;
        }
    }
}