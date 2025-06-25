"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIELD48_REQUIREMENTS = exports.TRANSACTION_REQUIREMENTS = exports.FIELD48_TAGS = exports.EMV_TAGS = void 0;
exports.EMV_TAGS = {
    '5F2A': {
        tag: '5F2A',
        name: 'Transaction Currency Code',
        description: 'Currency code of the transaction',
        format: 'n',
        length: 2,
        mandatory: true
    },
    '5F34': {
        tag: '5F34',
        name: 'Application PAN Sequence Number',
        description: 'Application Primary Account Number (PAN) Sequence Number',
        format: 'n',
        length: 1
    },
    '71': {
        tag: '71',
        name: 'Issuer Script Template 1',
        description: 'Scripts from the issuer sent to the terminal for delivery to the ICC',
        format: 'b'
    },
    '72': {
        tag: '72',
        name: 'Issuer Script Template 2',
        description: 'Scripts from the issuer sent to the terminal for delivery to the ICC',
        format: 'b'
    },
    '82': {
        tag: '82',
        name: 'Application Interchange Profile',
        description: 'Specifies the application functions that is supported by the card',
        format: 'b',
        length: 2,
        mandatory: true
    },
    '84': {
        tag: '84',
        name: 'Application Identifier (AID)',
        description: 'Application Identifier / Dedicated File (DF) Name',
        format: 'b'
    },
    '86': {
        tag: '86',
        name: 'Issuer Script Command',
        description: 'Contains a command for transmission to the ICC',
        format: 'b'
    },
    '8A': {
        tag: '8A',
        name: 'Authorization Response Code',
        description: 'Response Code from terminal or Issuer for online authorizations',
        format: 'an',
        length: 2
    },
    '91': {
        tag: '91',
        name: 'Issuer Authentication Data',
        description: 'Sent by the issuer if on-line issuer authentication is required',
        format: 'b',
        length: 16
    },
    '95': {
        tag: '95',
        name: 'Terminal Verification Results',
        description: 'Status of the different functions as seen by the terminal',
        format: 'b',
        length: 5,
        mandatory: true
    },
    '9A': {
        tag: '9A',
        name: 'Transaction Date',
        description: 'Transaction Date formatted as YYMMDD',
        format: 'n',
        length: 3,
        mandatory: true
    },
    '9B': {
        tag: '9B',
        name: 'Transaction Status Information',
        description: 'Indicates the functions performed in a transaction',
        format: 'b',
        length: 2
    },
    '9C': {
        tag: '9C',
        name: 'Transaction Type',
        description: 'Transaction Type taken from transaction data',
        format: 'n',
        length: 1,
        mandatory: true
    },
    '9F02': {
        tag: '9F02',
        name: 'Amount, Authorized',
        description: 'Transaction Amount taken from transaction data',
        format: 'n',
        length: 6,
        mandatory: true
    },
    '9F03': {
        tag: '9F03',
        name: 'Amount, Other',
        description: 'Secondary amount associated with the transaction (cashback)',
        format: 'n',
        length: 6
    },
    '9F09': {
        tag: '9F09',
        name: 'Application Version Number',
        description: 'Terminal Application Version Number',
        format: 'b',
        length: 2
    },
    '9F10': {
        tag: '9F10',
        name: 'Issuer Application Data',
        description: 'Issuer Application Data retrieved from the card',
        format: 'b'
    },
    '9F18': {
        tag: '9F18',
        name: 'Issuer Script Identifier',
        description: 'Identification of the Issuer Script',
        format: 'b',
        length: 4
    },
    '9F1A': {
        tag: '9F1A',
        name: 'Terminal Country Code',
        description: 'Terminal Country Code from terminal initialization',
        format: 'n',
        length: 2,
        mandatory: true
    },
    '9F1E': {
        tag: '9F1E',
        name: 'Interface Device Serial Number',
        description: 'Unique and permanent serial number assigned to the Interface Device',
        format: 'an',
        length: 8
    },
    '9F26': {
        tag: '9F26',
        name: 'Application Cryptogram',
        description: 'Used to approve offline transactions',
        format: 'b',
        length: 8,
        mandatory: true
    },
    '9F27': {
        tag: '9F27',
        name: 'Cryptogram Information Data',
        description: 'Used to approve offline transactions',
        format: 'b',
        length: 1,
        mandatory: true
    },
    '9F33': {
        tag: '9F33',
        name: 'Terminal Capabilities',
        description: 'Specifies the capabilities of the terminal',
        format: 'b',
        length: 3
    },
    '9F34': {
        tag: '9F34',
        name: 'Cardholder Verification Method Results',
        description: 'Result of the last cardholder verification method',
        format: 'b',
        length: 3
    },
    '9F35': {
        tag: '9F35',
        name: 'Terminal Type',
        description: 'Specifies the type of terminal',
        format: 'n',
        length: 1
    },
    '9F36': {
        tag: '9F36',
        name: 'Application Transaction Counter',
        description: 'Application Transaction Counter from the card',
        format: 'b',
        length: 2,
        mandatory: true
    },
    '9F37': {
        tag: '9F37',
        name: 'Unpredictable Number',
        description: 'Value to provide variability and uniqueness to the generation of cryptogram',
        format: 'b',
        length: 4,
        mandatory: true
    },
    '9F41': {
        tag: '9F41',
        name: 'Transaction Sequence Counter',
        description: 'Counter maintained by the terminal that is incremented by one for each transaction',
        format: 'n',
        length: 4
    },
    '9F4C': {
        tag: '9F4C',
        name: 'ICC Dynamic Number',
        description: 'Time-variant number generated by the ICC, to be captured by the terminal',
        format: 'b'
    },
    '9F53': {
        tag: '9F53',
        name: 'Transaction Category Code',
        description: 'Transaction Category Code / Merchant Category Code',
        format: 'an',
        length: 1
    },
    '9F5B': {
        tag: '9F5B',
        name: 'Issuer Script Results',
        description: 'Result of script processing',
        format: 'b'
    },
    '4F': {
        tag: '4F',
        name: 'Application Identifier',
        description: 'Identifies the application',
        format: 'b'
    },
    '9F6E': {
        tag: '9F6E',
        name: 'Form Factor Indicator',
        description: 'Form Factor Indicator, length depends on EMV implementation',
        format: 'b'
    }
};
// Field 48 Additional Data tags
exports.FIELD48_TAGS = {
    '001': {
        tag: '001',
        name: 'Fee Percent',
        description: 'Fee percent in format: KOMUC (%): <fee percent>',
        format: 'ans'
    },
    '002': {
        tag: '002',
        name: 'New PIN Data',
        description: 'New PIN data',
        format: 'b',
        length: 8
    },
    '003': {
        tag: '003',
        name: 'Service ID',
        description: 'Service identifier',
        format: 'ans'
    },
    '004': {
        tag: '004',
        name: 'Customer External Account Number',
        description: 'Customer external account number',
        format: 'ans'
    },
    '005': {
        tag: '005',
        name: 'Customer Mobile Phone Number',
        description: 'Customer mobile phone number',
        format: 'ans'
    },
    '013': {
        tag: '013',
        name: 'Card Verification Value',
        description: 'CVV2/CVC2/CID/CAV for card-not-present service',
        format: 'ans',
        length: 6
    },
    '014': {
        tag: '014',
        name: 'Card Verification Value Result',
        description: 'Card verification value result code for card-not-present service',
        format: 'ans',
        length: 1
    },
    '030': {
        tag: '030',
        name: 'Original RRN',
        description: 'Original Retrieval Reference Number',
        format: 'anp',
        length: 12
    }
};
// Transaction requirements defined here since they need to be in the same file
exports.TRANSACTION_REQUIREMENTS = {
    authorization: {
        mandatoryTags: ['95', '9A', '9C', '82'],
        optionalTags: ['9F26', '9F27', '9F36', '9F37', '9F1A', '9F33', '9F1E', '5F2A', '84', '5F34'],
        description: 'Authorization Request/Response (0100/0110) - Balance inquiry, card verification'
    },
    financial: {
        mandatoryTags: ['5F2A', '82', '95', '9A', '9C', '9F02', '9F26', '9F27', '9F36', '9F37'],
        optionalTags: ['9F03', '9F09', '9F10', '9F1A', '9F1E', '9F33', '9F34', '9F35', '84', '5F34', '9F41', '9F53'],
        description: 'Financial Transaction (0200/0210) - Purchase, cash advance, etc.'
    },
    trickle_feed: {
        mandatoryTags: ['95', '9A', '9C', '9F26', '9F27', '9F36'],
        optionalTags: ['5F2A', '82', '9F02', '9F03', '9F1A', '9F33', '9F34', '9F35', '84', '9F10'],
        description: 'Trickle Feed Transaction (0220/0230) - Offline approved transactions'
    },
    reversal: {
        mandatoryTags: ['95', '9F1E', '9F10', '9F36', '9F5B'],
        optionalTags: ['9A', '9C', '9F26', '9F27', '82', '5F2A'],
        description: 'Reversal Transaction (0400/0410) - Transaction cancellation'
    },
    batch_upload: {
        mandatoryTags: ['9A', '9C'],
        optionalTags: ['95', '9F26', '9F27', '9F36', '9F37', '5F2A', '82', '9F02', '9F03'],
        description: 'Batch Upload (0320/0330) - End of day batch processing'
    },
    settlement: {
        mandatoryTags: [],
        optionalTags: ['9A'],
        description: 'Settlement (0520/0530) - Financial reconciliation'
    },
    network_management: {
        mandatoryTags: [],
        optionalTags: ['9A'],
        description: 'Network Management (0800/0810) - Sign-on, sign-off, echo test'
    },
    pin_change: {
        mandatoryTags: ['95', '9A', '9C', '82'],
        optionalTags: ['9F26', '9F27', '9F36', '9F37', '5F2A', '84'],
        description: 'PIN Change Transaction - PIN modification and confirmation'
    },
    unknown: {
        mandatoryTags: [],
        optionalTags: [],
        description: 'Unknown transaction type - no validation applied'
    }
};
// Field 48 requirements based on transaction type
exports.FIELD48_REQUIREMENTS = {
    authorization: {
        mandatoryTags: [],
        optionalTags: ['001', '013', '014'],
        description: 'Authorization - Fee data, CVV verification'
    },
    financial: {
        mandatoryTags: [],
        optionalTags: ['001', '003', '004', '005', '013', '014', '030'],
        description: 'Financial - Service ID, customer data, verification values'
    },
    trickle_feed: {
        mandatoryTags: [],
        optionalTags: ['001', '003', '030'],
        description: 'Trickle Feed - Basic transaction data'
    },
    reversal: {
        mandatoryTags: [],
        optionalTags: ['030'],
        description: 'Reversal - Original RRN reference'
    },
    batch_upload: {
        mandatoryTags: [],
        optionalTags: ['001', '003'],
        description: 'Batch Upload - Fee and service data'
    },
    settlement: {
        mandatoryTags: [],
        optionalTags: [],
        description: 'Settlement - No additional data typically required'
    },
    network_management: {
        mandatoryTags: [],
        optionalTags: [],
        description: 'Network Management - No additional data required'
    },
    pin_change: {
        mandatoryTags: ['002'],
        optionalTags: [],
        description: 'PIN Change - New PIN data required'
    },
    unknown: {
        mandatoryTags: [],
        optionalTags: [],
        description: 'Unknown transaction type - no validation applied'
    }
};
//# sourceMappingURL=emvTags.js.map