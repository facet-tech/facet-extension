import { storage } from "../shared/constant"

/**
 * Class for mocking responses
 */
export default class MockService {

    static getWorkspaceId = () => {
        return 'NODE-ENV-LOCAL-TEST-WORKSPACE~ID'
    }

    static getMockDomainId = () => {
        return 'NODE-ENV-LOCAL-TEST-DOMAIN~ID'
    }

    static mockGetDomain = () => {
        return {
            response: {
                id: MockService.getMockDomainId()
            }
        }
    }

    static mockCreateDomain = () => {
        return {
            response: {
                id: MockService.getMockDomainId()
            }
        }
    }

    static mockGetKeyFromLocalStorage = (key) => {
        if (key === storage.username) {
            return "layani.kamora@primaryale.com";
        } else if (key === storage.password) {
            return "layani.kamora@primaryale.com";
        }
    }

    static mockGetFacet = () => {
        return {
            response: {
                "domainId": "NODE-ENV-LOCAL-TEST-DOMAIN~ID", "urlPath": "/",
                "facet": [
                    {
                        "enabled": false, "name": "Signup", "domElement":
                            [
                                { "name": "p#landing", "path": "body\u003ediv#main\u003ediv#welcome\u003ep#landing" },
                                { "name": "p#pprofessional", "path": "body\u003ediv#main\u003ediv:eq(1)\u003ediv:eq(0)\u003ep#pprofessional" },
                                { "name": "p#pAesthetic", "path": "body\u003ediv#main\u003ediv:eq(1)\u003ediv:eq(1)\u003ep#pAesthetic" },
                                { "name": "div", "path": "body\u003ediv#main\u003ediv:eq(3)\u003ediv\u003ediv\u003ediv" }]
                    }], "version": "0.0.1"
            },
            status: 200
        }

    }
}