import { RequestType, TLVTag, ValidationResult } from "../types/tlv";
export declare class TLVValidator {
    /**
     * Validate TLV tags against transaction requirements
     */
    static validateTags(tags: TLVTag[], requestType: RequestType, isField48?: boolean): ValidationResult;
    /**
     * Get validation requirements for a specific request type
     */
    static getRequirements(requestType: RequestType, isField48?: boolean): {
        requestType: RequestType;
        description: string;
        mandatoryTags: {
            required: boolean;
            tag: string;
            name: string;
            description: string;
            format: "n" | "an" | "ans" | "anp" | "b" | "x";
            length?: number;
            mandatory?: boolean;
        }[];
        optionalTags: {
            required: boolean;
            tag: string;
            name: string;
            description: string;
            format: "n" | "an" | "ans" | "anp" | "b" | "x";
            length?: number;
            mandatory?: boolean;
        }[];
    };
    /**
     * Determine request type from processing code (Field 3)
     */
    static inferRequestType(processingCode?: string): RequestType;
}
//# sourceMappingURL=tlvValidator.d.ts.map