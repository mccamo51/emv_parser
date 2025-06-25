"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLVValidator = void 0;
const emvTags_1 = require("../constants/emvTags");
class TLVValidator {
    /**
     * Validate TLV tags against transaction requirements
     */
    static validateTags(tags, requestType, isField48 = false) {
        const requirements = isField48
            ? emvTags_1.FIELD48_REQUIREMENTS[requestType]
            : emvTags_1.TRANSACTION_REQUIREMENTS[requestType];
        const tagDefinitions = isField48 ? emvTags_1.FIELD48_TAGS : emvTags_1.EMV_TAGS;
        const presentTags = tags.map(tag => tag.tag);
        // Check for missing mandatory tags
        const missingMandatoryTags = [];
        for (const mandatoryTag of requirements.mandatoryTags) {
            if (!presentTags.includes(mandatoryTag)) {
                const tagDef = tagDefinitions[mandatoryTag];
                if (tagDef) {
                    missingMandatoryTags.push(tagDef);
                }
            }
        }
        // Check for invalid/unknown tags
        const invalidTags = [];
        const validTags = [...requirements.mandatoryTags, ...requirements.optionalTags];
        for (const presentTag of presentTags) {
            if (!validTags.includes(presentTag) && !tagDefinitions[presentTag]) {
                invalidTags.push(presentTag);
            }
        }
        // Check for extra tags (valid but not expected for this transaction type)
        const extraTags = [];
        for (const presentTag of presentTags) {
            if (tagDefinitions[presentTag] && !validTags.includes(presentTag)) {
                extraTags.push(presentTag);
            }
        }
        // Build validation errors
        const errors = [];
        if (missingMandatoryTags.length > 0) {
            errors.push(`Missing mandatory tags: ${missingMandatoryTags.map(t => `${t.tag} (${t.name})`).join(', ')}`);
        }
        if (invalidTags.length > 0) {
            errors.push(`Invalid/unknown tags: ${invalidTags.join(', ')}`);
        }
        const isValid = missingMandatoryTags.length === 0 && invalidTags.length === 0;
        return {
            isValid,
            requestType,
            missingMandatoryTags: missingMandatoryTags.length > 0 ? missingMandatoryTags : undefined,
            invalidTags: invalidTags.length > 0 ? invalidTags : undefined,
            extraTags: extraTags.length > 0 ? extraTags : undefined,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    /**
     * Get validation requirements for a specific request type
     */
    static getRequirements(requestType, isField48 = false) {
        const requirements = isField48
            ? emvTags_1.FIELD48_REQUIREMENTS[requestType]
            : emvTags_1.TRANSACTION_REQUIREMENTS[requestType];
        const tagDefinitions = isField48 ? emvTags_1.FIELD48_TAGS : emvTags_1.EMV_TAGS;
        return {
            requestType,
            description: requirements.description,
            mandatoryTags: requirements.mandatoryTags.map(tag => ({
                ...tagDefinitions[tag],
                required: true
            })).filter(Boolean),
            optionalTags: requirements.optionalTags.map(tag => ({
                ...tagDefinitions[tag],
                required: false
            })).filter(Boolean)
        };
    }
    /**
     * Determine request type from processing code (Field 3)
     */
    static inferRequestType(processingCode) {
        if (!processingCode)
            return 'unknown';
        const transactionType = processingCode.substring(0, 2);
        switch (transactionType) {
            case '31': return 'authorization'; // Balance inquiry
            case '37': return 'authorization'; // Check card
            case '00': return 'financial'; // Purchase
            case '01': return 'financial'; // Cash advance
            case '09': return 'financial'; // Purchase with cashback
            case '20': return 'financial'; // Return/Refund
            case '21': return 'financial'; // Cash deposit
            case '50': return 'financial'; // Utility payment
            case '17': return 'financial'; // Loyalty purchase
            case '79': return 'pin_change'; // PIN change
            case '90': return 'network_management'; // Merchant log-on
            case '92': return 'network_management'; // Merchant log-off
            case '99': return 'network_management'; // Network management
            case '93': return 'financial'; // Pre-authorization
            case '94': return 'financial'; // Pre-authorization completion
            default: return 'unknown';
        }
    }
}
exports.TLVValidator = TLVValidator;
//# sourceMappingURL=tlvValidator.js.map