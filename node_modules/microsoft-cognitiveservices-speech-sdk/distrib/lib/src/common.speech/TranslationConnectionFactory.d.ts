import { IConnection, IStringDictionary } from "../common/Exports.js";
import { ConnectionFactoryBase } from "./ConnectionFactoryBase.js";
import { AuthInfo, RecognizerConfig } from "./Exports.js";
export declare class TranslationConnectionFactory extends ConnectionFactoryBase {
    create(config: RecognizerConfig, authInfo: AuthInfo, connectionId?: string): IConnection;
    getEndpointUrl(config: RecognizerConfig, returnRegionPlaceholder?: boolean): string;
    setQueryParams(queryParams: IStringDictionary<string>, config: RecognizerConfig, endpointUrl: string): void;
}
