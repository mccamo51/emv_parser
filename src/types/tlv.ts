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

export type RequestType = 
  | 'authorization'      // 0100/0110
  | 'financial'         // 0200/0210
  | 'trickle_feed'      // 0220/0230
  | 'reversal'          // 0400/0410
  | 'batch_upload'      // 0320/0330
  | 'settlement'        // 0520/0530
  | 'network_management' // 0800/0810
  | 'pin_change'        // PIN change transactions
  | 'unknown';

export interface TransactionRequirements {
  mandatoryTags: string[];
  optionalTags: string[];
  description: string;
}