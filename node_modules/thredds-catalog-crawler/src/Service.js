export default class Service {

    constructor (serviceJson) {
        this.name = serviceJson.name
        this.type = serviceJson.serviceType
        this.baseUrl = serviceJson.base
    }

}
