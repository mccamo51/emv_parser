import { EMVTagDefinition, RequestType } from "../types/tlv";
export declare const EMV_TAGS: Record<string, EMVTagDefinition>;
export declare const FIELD48_TAGS: Record<string, EMVTagDefinition>;
export declare const TRANSACTION_REQUIREMENTS: Record<RequestType, {
    mandatoryTags: string[];
    optionalTags: string[];
    description: string;
}>;
export declare const FIELD48_REQUIREMENTS: Record<RequestType, {
    mandatoryTags: string[];
    optionalTags: string[];
    description: string;
}>;
//# sourceMappingURL=emvTags.d.ts.map