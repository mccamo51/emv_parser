import { Router, Request, Response } from "express";
import { RequestType } from "../types/tlv";
import { TLVValidator } from "../utils/tlvValidator";
import { TLVParser } from "../utils/tlvParser";
import { EMV_TAGS, FIELD48_TAGS } from "../constants/emvTags";

const router = Router();

interface ParseTLVRequest {
  data: string;
  field?: 'emv' | 'field48';
  requestType?: RequestType;
  processingCode?: string;
  validateTags?: boolean;
}

/**
 * POST /parse
 * Parse TLV data and return JSON with optional validation
 */
router.post('/parse', (req: Request, res: Response) => {
  try {
    const { 
      data, 
      field = 'emv', 
      requestType,
      processingCode,
      validateTags = false 
    }: ParseTLVRequest = req.body;

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
    let finalRequestType: RequestType = 'unknown';
    
    if (requestType) {
      finalRequestType = requestType;
    } else if (processingCode) {
      finalRequestType = TLVValidator.inferRequestType(processingCode);
    }

    // Parse with validation if requested
    const result = validateTags 
      ? TLVParser.parseTLV(data, isField48, finalRequestType)
      : TLVParser.parseTLV(data, isField48);

    if (!result.success) {
      return res.status(400).json({
        ...result,
        validation: result.validation
      });
    }

    const formattedData = result.data ? TLVParser.formatTLVForDisplay(result.data) : [];

    const response: any = {
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

  } catch (error) {
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
router.get('/requirements/:requestType', (req: Request, res: Response) => {
  try {
    const { requestType } = req.params;
    const { field = 'emv' } = req.query;

    const validRequestTypes: RequestType[] = [
      'authorization', 'financial', 'trickle_feed', 'reversal', 
      'batch_upload', 'settlement', 'network_management', 'pin_change'
    ];

    if (!validRequestTypes.includes(requestType as RequestType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid request type. Valid types: ${validRequestTypes.join(', ')}`
      });
    }

    const isField48 = field === 'field48';
    const requirements = TLVValidator.getRequirements(requestType as RequestType, isField48);

    res.json({
      success: true,
      fieldType: field,
      ...requirements
    });

  } catch (error) {
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
router.post('/validate', (req: Request, res: Response) => {
  try {
    const { 
      tags, 
      requestType, 
      field = 'emv' 
    }: { 
      tags: string[]; 
      requestType: RequestType; 
      field?: 'emv' | 'field48' 
    } = req.body;

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

    const validation = TLVValidator.validateTags(tlvTags, requestType, isField48);

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

  } catch (error) {
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
router.get('/tags', (req: Request, res: Response) => {
  try {
    const { field = 'emv' } = req.query;
    
    const tags = field === 'field48' 
      ? Object.values(FIELD48_TAGS)
      : Object.values(EMV_TAGS);

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

  } catch (error) {
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
router.get('/request-types', (req: Request, res: Response) => {
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
        emvRequirements: TLVValidator.getRequirements(type as RequestType, false),
        field48Requirements: TLVValidator.getRequirements(type as RequestType, true)
      }))
    });

  } catch (error) {
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
router.get('/health', (req: Request, res: Response) => {
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

export default router;