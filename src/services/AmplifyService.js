import { Auth } from "aws-amplify";

export default class {

    static getCurrentUserJTW = async () => {
        const result = await Auth.currentSession();
        const jwtToken = result?.accessToken?.jwtToken;
        return jwtToken;
    }
}