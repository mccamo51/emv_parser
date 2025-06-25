"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLVParser = void 0;
const emvTags_1 = require("../constants/emvTags");
const tlvValidator_1 = require("./tlvValidator");
class TLVParser {
    /**
     * Parse TLV data from hex string with optional validation
     */
    static parseTLV(hexData, isField48 = false, requestType) {
        try {
            // Remove spaces and convert to uppercase
            const cleanData = hexData.replace(/\s+/g, '').toUpperCase();
            if (cleanData.length % 2 !== 0) {
                return {
                    success: false,
                    error: 'Invalid hex data length (must be even)'
                };
            }
            const tags = [];
            let position = 0;
            while (position < cleanData.length) {
                const parseResult = this.parseNextTag(cleanData, position, isField48);
                if (!parseResult.tag) {
                    break;
                }
                tags.push(parseResult.tag);
                position = parseResult.nextPosition;
            }
            let validation;
            // Perform validation if request type is provided
            if (requestType && requestType !== 'unknown') {
                validation = tlvValidator_1.TLVValidator.validateTags(tags, requestType, isField48);
            }
            return {
                success: validation ? validation.isValid : true,
                data: tags,
                totalLength: cleanData.length / 2,
                validation,
                error: validation && !validation.isValid ?
                    `Validation failed: ${validation.errors?.join(', ')}` : undefined
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown parsing error'
            };
        }
    }
    /**
     * Parse next TLV tag from the data
     */
    static parseNextTag(data, position, isField48) {
        if (position >= data.length) {
            return { tag: null, nextPosition: position };
        }
        try {
            // Parse tag
            const tagResult = this.parseTag(data, position);
            if (!tagResult.tag) {
                return { tag: null, nextPosition: position };
            }
            // Parse length
            const lengthResult = this.parseLength(data, tagResult.nextPosition);
            if (lengthResult.length === -1) {
                return { tag: null, nextPosition: position };
            }
            // Parse value
            const valueLength = lengthResult.length * 2; // Convert to hex chars
            const valueStart = lengthResult.nextPosition;
            const valueEnd = valueStart + valueLength;
            if (valueEnd > data.length) {
                throw new Error(`Insufficient data for tag ${tagResult.tag}`);
            }
            const value = data.substring(valueStart, valueEnd);
            // Get tag definition
            const tagDef = isField48
                ? emvTags_1.FIELD48_TAGS[tagResult.tag]
                : emvTags_1.EMV_TAGS[tagResult.tag];
            const tlvTag = {
                tag: tagResult.tag,
                length: lengthResult.length,
                value: value,
                description: tagDef?.description || 'Unknown tag',
                parsedValue: this.parseValue(value, tagDef)
            };
            return {
                tag: tlvTag,
                nextPosition: valueEnd
            };
        }
        catch (error) {
            throw new Error(`Error parsing tag at position ${position}: ${error}`);
        }
    }
    /**
     * Parse tag from current position
     */
    static parseTag(data, position) {
        if (position >= data.length) {
            return { tag: '', nextPosition: position };
        }
        // EMV tags can be 1 or 2 bytes
        const firstByte = data.substring(position, position + 2);
        if (!firstByte || firstByte.length < 2) {
            return { tag: '', nextPosition: position };
        }
        const firstByteValue = parseInt(firstByte, 16);
        // Check if this is a two-byte tag (bit 5 of first byte is 1)
        if ((firstByteValue & 0x1F) === 0x1F) {
            // Two-byte tag
            if (position + 4 > data.length) {
                return { tag: '', nextPosition: position };
            }
            const tag = data.substring(position, position + 4);
            return { tag, nextPosition: position + 4 };
        }
        else {
            // One-byte tag
            return { tag: firstByte, nextPosition: position + 2 };
        }
    }
    /**
     * Parse length from current position
     */
    static parseLength(data, position) {
        if (position >= data.length) {
            return { length: -1, nextPosition: position };
        }
        const firstLengthByte = data.substring(position, position + 2);
        if (!firstLengthByte || firstLengthByte.length < 2) {
            return { length: -1, nextPosition: position };
        }
        const lengthValue = parseInt(firstLengthByte, 16);
        if (lengthValue <= 127) {
            // Short form - length is in the first byte
            return { length: lengthValue, nextPosition: position + 2 };
        }
        else {
            // Long form - first byte indicates how many additional bytes contain the length
            const lengthOfLength = lengthValue & 0x7F;
            if (lengthOfLength === 0 || position + 2 + (lengthOfLength * 2) > data.length) {
                return { length: -1, nextPosition: position };
            }
            let length = 0;
            for (let i = 0; i < lengthOfLength; i++) {
                const lengthByte = data.substring(position + 2 + (i * 2), position + 4 + (i * 2));
                length = (length << 8) + parseInt(lengthByte, 16);
            }
            return { length, nextPosition: position + 2 + (lengthOfLength * 2) };
        }
    }
    /**
     * Parse value based on tag definition format
     */
    static parseValue(hexValue, tagDef) {
        if (!tagDef || !hexValue) {
            return hexValue;
        }
        try {
            switch (tagDef.format) {
                case 'n': // Numeric
                    return hexValue;
                case 'an': // Alphanumeric
                case 'ans': // Alphanumeric + special
                case 'anp': // Alphanumeric + pad (space)
                    return this.hexToAscii(hexValue);
                case 'b': // Binary
                    return hexValue;
                case 'x': // Amount with sign
                    return this.parseAmount(hexValue);
                default:
                    return hexValue;
            }
        }
        catch (error) {
            return hexValue; // Return original if parsing fails
        }
    }
    /**
     * Convert hex to ASCII string
     */
    static hexToAscii(hex) {
        let result = '';
        for (let i = 0; i < hex.length; i += 2) {
            const hexPair = hex.substring(i, i + 2);
            const charCode = parseInt(hexPair, 16);
            if (charCode >= 32 && charCode <= 126) {
                result += String.fromCharCode(charCode);
            }
            else {
                result += `\\x${hexPair}`;
            }
        }
        return result;
    }
    /**
     * Parse amount from hex (for format 'x')
     */
    static parseAmount(hex) {
        if (hex.length === 0) {
            return { sign: '+', amount: '0' };
        }
        const firstChar = hex.charAt(0).toUpperCase();
        const sign = (firstChar === 'D') ? '-' : '+';
        const amount = hex.substring(1);
        return { sign, amount };
    }
    /**
     * Format TLV data for better readability
     */
    static formatTLVForDisplay(tags) {
        return tags.map(tag => ({
            tag: tag.tag,
            name: this.getTagName(tag.tag),
            description: tag.description,
            length: tag.length,
            rawValue: tag.value,
            parsedValue: tag.parsedValue
        }));
    }
    /**
     * Get tag name from tag definitions
     */
    static getTagName(tag) {
        const emvTag = emvTags_1.EMV_TAGS[tag];
        const field48Tag = emvTags_1.FIELD48_TAGS[tag];
        return emvTag?.name || field48Tag?.name || 'Unknown Tag';
    }
}
exports.TLVParser = TLVParser;
//# sourceMappingURL=tlvParser.js.map