import { AvatarVideoFormat } from "./Exports.js";
/**
 * Defines the talking avatar configuration.
 * @class AvatarConfig
 * Added in version 1.33.0
 *
 * @experimental This feature is experimental and might change or have limited support.
 */
export declare class AvatarConfig {
    private privCustomized;
    private privBackgroundColor;
    /**
     * Defines the avatar character.
     */
    character: string;
    /**
     * Defines the avatar style.
     */
    style: string;
    /**
     * Defines the talking avatar output video format.
     */
    videoFormat: AvatarVideoFormat;
    /**
     * Indicates if the talking avatar is customized.
     */
    get customized(): boolean;
    /**
     * Sets if the talking avatar is customized.
     */
    set customized(value: boolean);
    /**
     * Sets the background color.
     */
    get backgroundColor(): string;
    /**
     * Gets the background color.
     */
    set backgroundColor(value: string);
    /**
     * Creates and initializes an instance of this class.
     * @constructor
     * @param {string} character - The avatar character.
     * @param {string} style - The avatar style.
     * @param {AvatarVideoFormat} videoFormat - The talking avatar output video format.
     */
    constructor(character: string, style: string, videoFormat: AvatarVideoFormat);
}
