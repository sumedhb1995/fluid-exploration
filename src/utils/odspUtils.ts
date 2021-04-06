import { IDriveInfo } from "@fluid-dev/m365-utils";
import { IRequest } from "@fluidframework/core-interfaces";
import {
  OdspDocumentServiceFactory,
  OdspDriverUrlResolverForShareLink,
  TokenFetcher,
  OdspResourceTokenFetchOptions,
} from "@fluidframework/odsp-driver";
import {
  IDocumentServiceFactory,
  IUrlResolver,
} from "@fluidframework/driver-definitions";
import { IGetContainerService } from "../fluidStatic/getContainer";

export class OdspService implements IGetContainerService {
  public readonly documentServiceFactory: IDocumentServiceFactory;
  public readonly urlResolver: IUrlResolver;
  public readonly generateCreateNewRequest: (id: string) => IRequest;

  constructor(sharePointToken: string, pushServiceToken: string, driveInfo: IDriveInfo) {
    this.documentServiceFactory = new OdspDocumentServiceFactory(
      async () => Promise.resolve(sharePointToken),
      async () => Promise.resolve(pushServiceToken),
      undefined
    );
    this.urlResolver = createUrlResolver(sharePointToken);
    this.generateCreateNewRequest = (id: string) => {
      return getOdspCreateNewRequest("Tab Docs", id, sharePointToken, driveInfo);
    };
  }
}

export function createUrlResolver(
  sharePointToken: string
): OdspDriverUrlResolverForShareLink {
  const sharingLinkTokenFetcher: TokenFetcher<OdspResourceTokenFetchOptions> = (
    _options: OdspResourceTokenFetchOptions
  ) => {
    return Promise.resolve(sharePointToken);
  };
  return new OdspDriverUrlResolverForShareLink(sharingLinkTokenFetcher);
}

export function getOdspCreateNewRequest(
  folderName: string,
  fileName: string,
  sharePointToken: string,
  driveInfo: IDriveInfo
): IRequest {
  const urlResolver = createUrlResolver(sharePointToken);
  return urlResolver.createCreateNewRequest(
    driveInfo.siteUrl ?? "",
    driveInfo.driveId ?? "",
    folderName,
    fileName
  );
}

export const encodeContentUrlParam = (value: string): string =>
  encodeURIComponent(btoa(value));

export const decodeContentUrlParam = (encodedValue: string): string =>
  atob(decodeURIComponent(encodedValue));
