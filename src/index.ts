import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import tlvRoutes from './routes/tlvRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tlv', tlvRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SmartVista TLV Parser API with Validation',
    version: '2.0.0',
    features: [
      'TLV Parsing (EMV Field 55 & Field 48)',
      'Transaction Type Validation',
      'SmartVista ISO8583 Compliance',
      'Tag Requirements Checking',
      'Processing Code Inference'
    ],
    endpoints: {
      parse: 'POST /api/tlv/parse - Parse TLV data with optional validation',
      validate: 'POST /api/tlv/validate - Validate tag list against requirements',
      requirements: 'GET /api/tlv/requirements/:requestType - Get tag requirements',
      requestTypes: 'GET /api/tlv/request-types - Get all supported request types',
      tags: 'GET /api/tlv/tags - Get all supported tags',
      health: 'GET /api/tlv/health - Health check'
    },
    examples: {
      parseWithValidation: {
        url: 'POST /api/tlv/parse',
        body: {
          data: '9F2608B2E8B5C71A4BC3209A031909259C01009F3704AE9B0A8A',
          field: 'emv',
          requestType: 'financial',
          validateTags: true
        }
      },
      getRequirements: {
        url: 'GET /api/tlv/requirements/financial?field=emv'
      },
      validateTags: {
        url: 'POST /api/tlv/validate',
        body: {
          tags: ['9F26', '9A', '9C'],
          requestType: 'financial',
          field: 'emv'
        }
      }
    }
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`TLV Parser API server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
  console.log('Features:');
  console.log('  ✓ TLV Parsing (EMV Field 55 & Field 48)');
  console.log('  ✓ Transaction Type Validation');
  console.log('  ✓ SmartVista ISO8583 Compliance');
  console.log('  ✓ Tag Requirements Checking');
});

export default app;