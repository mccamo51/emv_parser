"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tlvValidator_1 = require("../utils/tlvValidator");
const tlvParser_1 = require("../utils/tlvParser");
const emvTags_1 = require("../constants/emvTags");
const router = (0, express_1.Router)();
/**
 * POST /parse
 * Parse TLV data and return JSON with optional validation
 */
router.post('/parse', (req, res) => {
    try {
        const { data, field = 'emv', requestType, processingCode, validateTags = false } = req.body;
        if (!data) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: data'
            });
        }
        if (typeof data !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Data must be a string'
            });
        }
        const isField48 = field === 'field48';
        // Determine request type for validation
        let finalRequestType = 'unknown';
        if (requestType) {
            finalRequestType = requestType;
        }
        else if (processingCode) {
            finalRequestType = tlvValidator_1.TLVValidator.inferRequestType(processingCode);
        }
        // Parse with validation if requested
        const result = validateTags
            ? tlvParser_1.TLVParser.parseTLV(data, isField48, finalRequestType)
            : tlvParser_1.TLVParser.parseTLV(data, isField48);
        if (!result.success) {
            return res.status(400).json({
                ...result,
                validation: result.validation
            });
        }
        const formattedData = result.data ? tlvParser_1.TLVParser.formatTLVForDisplay(result.data) : [];
        const response = {
            success: true,
            fieldType: field,
            totalTags: formattedData.length,
            totalLength: result.totalLength,
            tags: formattedData
        };
        // Include validation results if validation was performed
        if (result.validation) {
            response.validation = {
                isValid: result.validation.isValid,
                requestType: result.validation.requestType,
                errors: result.validation.errors,
                missingMandatoryTags: result.validation.missingMandatoryTags?.map(tag => ({
                    tag: tag.tag,
                    name: tag.name,
                    description: tag.description,
                    format: tag.format,
                    length: tag.length
                })),
                invalidTags: result.validation.invalidTags,
                extraTags: result.validation.extraTags
            };
        }
        // If validation failed, return 422 status
        if (result.validation && !result.validation.isValid) {
            return res.status(422).json(response);
        }
        res.json(response);
    }
    catch (error) {
        console.error('TLV parsing error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during TLV parsing'
        });
    }
});
/**
 * GET /requirements/:requestType
 * Get tag requirements for a specific request type
 */
router.get('/requirements/:requestType', (req, res) => {
    try {
        const { requestType } = req.params;
        const { field = 'emv' } = req.query;
        const validRequestTypes = [
            'authorization', 'financial', 'trickle_feed', 'reversal',
            'batch_upload', 'settlement', 'network_management', 'pin_change'
        ];
        if (!validRequestTypes.includes(requestType)) {
            return res.status(400).json({
                success: false,
                error: `Invalid request type. Valid types: ${validRequestTypes.join(', ')}`
            });
        }
        const isField48 = field === 'field48';
        const requirements = tlvValidator_1.TLVValidator.getRequirements(requestType, isField48);
        res.json({
            success: true,
            fieldType: field,
            ...requirements
        });
    }
    catch (error) {
        console.error('Error fetching requirements:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
/**
 * POST /validate
 * Validate TLV tags against specific transaction requirements
 */
router.post('/validate', (req, res) => {
    try {
        const { tags, requestType, field = 'emv' } = req.body;
        if (!tags || !Array.isArray(tags)) {
            return res.status(400).json({
                success: false,
                error: 'Missing or invalid tags array'
            });
        }
        if (!requestType) {
            return res.status(400).json({
                success: false,
                error: 'Missing requestType'
            });
        }
        const isField48 = field === 'field48';
        // Convert tag strings to TLVTag objects for validation
        const tlvTags = tags.map(tag => ({
            tag,
            length: 0,
            value: '',
            description: ''
        }));
        const validation = tlvValidator_1.TLVValidator.validateTags(tlvTags, requestType, isField48);
        const response = {
            success: validation.isValid,
            fieldType: field,
            validation: {
                isValid: validation.isValid,
                requestType: validation.requestType,
                errors: validation.errors,
                missingMandatoryTags: validation.missingMandatoryTags?.map(tag => ({
                    tag: tag.tag,
                    name: tag.name,
                    description: tag.description,
                    format: tag.format,
                    length: tag.length
                })),
                invalidTags: validation.invalidTags,
                extraTags: validation.extraTags
            }
        };
        // Return 422 if validation failed
        if (!validation.isValid) {
            return res.status(422).json(response);
        }
        res.json(response);
    }
    catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during validation'
        });
    }
});
/**
 * GET /tags
 * Get all supported EMV tags
 */
router.get('/tags', (req, res) => {
    try {
        const { field = 'emv' } = req.query;
        const tags = field === 'field48'
            ? Object.values(emvTags_1.FIELD48_TAGS)
            : Object.values(emvTags_1.EMV_TAGS);
        res.json({
            success: true,
            fieldType: field,
            totalTags: tags.length,
            tags: tags.map(tag => ({
                tag: tag.tag,
                name: tag.name,
                description: tag.description,
                format: tag.format,
                length: tag.length,
                mandatory: tag.mandatory
            }))
        });
    }
    catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
/**
 * GET /request-types
 * Get all supported request types
 */
router.get('/request-types', (req, res) => {
    try {
        const requestTypes = [
            'authorization',
            'financial',
            'trickle_feed',
            'reversal',
            'batch_upload',
            'settlement',
            'network_management',
            'pin_change'
        ];
        res.json({
            success: true,
            requestTypes: requestTypes.map(type => ({
                type,
                emvRequirements: tlvValidator_1.TLVValidator.getRequirements(type, false),
                field48Requirements: tlvValidator_1.TLVValidator.getRequirements(type, true)
            }))
        });
    }
    catch (error) {
        console.error('Error fetching request types:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'TLV Parser API is running',
        timestamp: new Date().toISOString(),
        features: [
            'TLV Parsing',
            'EMV Tag Validation',
            'Field 48 Support',
            'Transaction Type Validation',
            'SmartVista ISO8583 Compliance'
        ]
    });
});
exports.default = router;
//# sourceMappingURL=tlvRoutes.js.map