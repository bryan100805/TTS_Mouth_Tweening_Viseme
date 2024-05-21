import { DynamicGrammarBuilder } from "./Exports.js";
interface Context {
    [section: string]: any;
}
/**
 * Represents the JSON used in the speech.context message sent to the speech service.
 * The dynamic grammar is always refreshed from the encapsulated dynamic grammar object.
 */
export declare class SpeechContext {
    private privContext;
    private privDynamicGrammar;
    constructor(dynamicGrammar: DynamicGrammarBuilder);
    /**
     * Gets a section of the speech.context object.
     * @param sectionName Name of the section to get.
     * @return string or Context JSON serializable object that represents the value.
     */
    getSection(sectionName: string): string | Context;
    /**
     * Adds a section to the speech.context object.
     * @param sectionName Name of the section to add.
     * @param value JSON serializable object that represents the value.
     */
    setSection(sectionName: string, value: string | Context): void;
    /**
     * @Internal
     * This is only used by pronunciation assessment config.
     * Do not use externally, object returned will change without warning or notice.
     */
    setPronunciationAssessmentParams(params: string, contentAssessmentTopic: string, isSpeakerDiarizationEnabled?: boolean): void;
    setDetailedOutputFormat(): void;
    setWordLevelTimings(): void;
    setSpeakerDiarizationAudioOffsetMs(audioOffsetMs: number): void;
    toJSON(): string;
}
export {};
