import { IPrimaryLanguage, ITranslations } from "../Exports.js";
export interface ITranslationHypothesis {
    Duration: number;
    Offset: number;
    PrimaryLanguage?: IPrimaryLanguage;
    Text: string;
    Translation: ITranslations;
}
export declare class TranslationHypothesis implements ITranslationHypothesis {
    private privTranslationHypothesis;
    private constructor();
    static fromJSON(json: string): TranslationHypothesis;
    static fromTranslationResponse(translationHypothesis: {
        SpeechHypothesis: ITranslationHypothesis;
    }): TranslationHypothesis;
    get Duration(): number;
    get Offset(): number;
    get Text(): string;
    get Translation(): ITranslations;
    get Language(): string;
}
