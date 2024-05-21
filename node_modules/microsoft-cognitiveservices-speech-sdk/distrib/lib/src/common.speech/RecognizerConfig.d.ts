import { PropertyCollection } from "../sdk/Exports.js";
import { SpeechServiceConfig } from "./Exports.js";
export declare enum RecognitionMode {
    Interactive = 0,
    Conversation = 1,
    Dictation = 2
}
export declare enum SpeechResultFormat {
    Simple = 0,
    Detailed = 1
}
export declare class RecognizerConfig {
    private privRecognitionMode;
    private privLanguageIdMode;
    private privSpeechServiceConfig;
    private privRecognitionActivityTimeout;
    private privParameters;
    private privMaxRetryCount;
    private privEnableSpeakerId;
    constructor(speechServiceConfig: SpeechServiceConfig, parameters: PropertyCollection);
    get parameters(): PropertyCollection;
    get recognitionMode(): RecognitionMode;
    set recognitionMode(value: RecognitionMode);
    get SpeechServiceConfig(): SpeechServiceConfig;
    get recognitionActivityTimeout(): number;
    get isContinuousRecognition(): boolean;
    get languageIdMode(): string;
    get autoDetectSourceLanguages(): string;
    get recognitionEndpointVersion(): string;
    get sourceLanguageModels(): {
        language: string;
        endpoint: string;
    }[];
    get maxRetryCount(): number;
    get isSpeakerDiarizationEnabled(): boolean;
    set isSpeakerDiarizationEnabled(value: boolean);
}
