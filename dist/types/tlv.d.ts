export interface TLVTag {
    tag: string;
    length: number;
    value: string;
    description?: string;
    parsedValue?: any;
}
export interface ParsedTLV {
    success: boolean;
    data?: TLVTag[];
    error?: string;
    totalLength?: number;
    validation?: ValidationResult;
}
export interface EMVTagDefinition {
    tag: string;
    name: string;
    description: string;
    format: 'n' | 'an' | 'ans' | 'anp' | 'b' | 'x';
    length?: number;
    mandatory?: boolean;
}
export interface ValidationResult {
    isValid: boolean;
    requestType?: string;
    missingMandatoryTags?: EMVTagDefinition[];
    invalidTags?: string[];
    extraTags?: string[];
    errors?: string[];
}
export type RequestType = 'authorization' | 'financial' | 'trickle_feed' | 'reversal' | 'batch_upload' | 'settlement' | 'network_management' | 'pin_change' | 'unknown';
export interface TransactionRequirements {
    mandatoryTags: string[];
    optionalTags: string[];
    description: string;
}
//# sourceMappingURL=tlv.d.ts.map