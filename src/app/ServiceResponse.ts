export interface ServiceResponse {

    payload: any;
    responseTime: number;
}

export class ServiceResponseProvider {

    static createServiceResponse(responseData: any): ServiceResponse {

        return <ServiceResponse>{

            responseTime: Date.now(),
            payload: responseData
        };
    }
}