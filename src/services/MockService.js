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

    static mockGetFacet = () => {
        return {
            "domainId": "MK-LOCAL-TEST",
            "urlPath": "/",
            "facet": [
                {
                    "enabled": false,
                    "name": "Facet-1",
                    "domElement": [
                        {
                            "name": "p#landing",
                            "path": "body>div#main>div#welcome>p#landing"
                        }
                    ]
                }
            ],
            "version": "0.0.1"
        }
    }
}