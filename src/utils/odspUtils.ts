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
import { IGetContainerService } from "../fluidStatic/FluidStatic";

export const pushServiceToken =
  "";
export const sharePointToken =
  "";

export class OdspService implements IGetContainerService {
  public readonly documentServiceFactory: IDocumentServiceFactory;
  public readonly urlResolver: IUrlResolver;
  public readonly generateCreateNewRequest: (id: string) => IRequest;

  constructor(sharePointToken: string, pushServiceToken: string) {
    this.documentServiceFactory = new OdspDocumentServiceFactory(
      async () => Promise.resolve(sharePointToken),
      async () => Promise.resolve(pushServiceToken),
      undefined
    );
    this.urlResolver = createUrlResolver(sharePointToken);
    this.generateCreateNewRequest = (id: string) => {
      return getOdspCreateNewRequest("Tab Docs", id, sharePointToken, {
        siteUrl:
          "https://a830edad9050849844e21031200-my.sharepoint.com/personal/fhldev15_a830edad9050849844e21031200_onmicrosoft_com",
        driveId:
          "b!3imsHJcKN0qaCL_38rB9iXK1swbXCnBAov0Tb4jDrAQEQdrBZUsbQJwqX8FCZtpo",
      });
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
