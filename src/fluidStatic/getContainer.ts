import { IRequest } from "@fluidframework/core-interfaces";
import { IDocumentServiceFactory, IUrlResolver } from "@fluidframework/driver-definitions";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";
import { InsecureTinyliciousTokenProvider, InsecureTinyliciousUrlResolver } from "@fluidframework/tinylicious-driver";

export interface IGetContainerService {
    documentServiceFactory: IDocumentServiceFactory;
    urlResolver: IUrlResolver;
    generateCreateNewRequest(id: string): IRequest;
}

export class TinyliciousService implements IGetContainerService {
    public readonly documentServiceFactory: IDocumentServiceFactory;
    public readonly urlResolver: IUrlResolver = new InsecureTinyliciousUrlResolver();
    public readonly generateCreateNewRequest = (id: string) => ({ url: id });
    constructor() {
        const tokenProvider = new InsecureTinyliciousTokenProvider();
        this.documentServiceFactory = new RouterliciousDocumentServiceFactory(tokenProvider);
    }
}