import { ParsedTLV, RequestType, TLVTag } from "../types/tlv";
export declare class TLVParser {
    /**
     * Parse TLV data from hex string with optional validation
     */
    static parseTLV(hexData: string, isField48?: boolean, requestType?: RequestType): ParsedTLV;
    /**
     * Parse next TLV tag from the data
     */
    private static parseNextTag;
    /**
     * Parse tag from current position
     */
    private static parseTag;
    /**
     * Parse length from current position
     */
    private static parseLength;
    /**
     * Parse value based on tag definition format
     */
    private static parseValue;
    /**
     * Convert hex to ASCII string
     */
    private static hexToAscii;
    /**
     * Parse amount from hex (for format 'x')
     */
    private static parseAmount;
    /**
     * Format TLV data for better readability
     */
    static formatTLVForDisplay(tags: TLVTag[]): any[];
    /**
     * Get tag name from tag definitions
     */
    private static getTagName;
}
//# sourceMappingURL=tlvParser.d.ts.map