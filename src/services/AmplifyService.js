import { Auth } from "aws-amplify";

export default class {

    static getCurrentUserJTW = async () => {
        try {
            const result = await Auth.currentSession();
            const jwtToken = result?.accessToken?.jwtToken;
            return jwtToken;
        } catch (e) {
            // TODO no current user logged in ~ redirect to login page
            return undefined;
        }

    }
}