import * as path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import type { McpRequestMessage } from './processors/request-mutator';
import { handleCheckRequest } from './processors/request-mutator';
import type { McpResponseMessage } from './processors/response-enricher';
import { handleCheckResponse } from './processors/response-enricher';

const PROTO_PATH = path.resolve(__dirname, '../proto/ext_mcp.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

interface ExtMcpPackage {
  agentgateway?: {
    dev?: {
      ext_mcp?: {
        ExtMcp?: {
          service: grpc.ServiceDefinition;
        };
      };
    };
  };
}

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as ExtMcpPackage;
const extMcpService = protoDescriptor.agentgateway?.dev?.ext_mcp?.ExtMcp?.service;

if (!extMcpService) {
  console.error('Failed to load ExtMcp service definition from proto file:', PROTO_PATH);
  process.exit(1);
}

const server = new grpc.Server();

const serviceImplementation: grpc.UntypedServiceImplementation = {
  CheckRequest: (
    call: grpc.ServerUnaryCall<McpRequestMessage, unknown>,
    callback: grpc.sendUnaryData<unknown>,
  ) => {
    const result = handleCheckRequest(call.request);
    callback(null, result);
  },
  CheckResponse: (
    call: grpc.ServerUnaryCall<McpResponseMessage, unknown>,
    callback: grpc.sendUnaryData<unknown>,
  ) => {
    const result = handleCheckResponse(call.request);
    callback(null, result);
  },
};

server.addService(extMcpService, serviceImplementation);

const PORT = process.env.GUARDRAILS_PORT ?? '9001';
const HOST = process.env.GUARDRAILS_HOST ?? '0.0.0.0';
const BIND_ADDR = `${HOST}:${PORT}`;

server.bindAsync(BIND_ADDR, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error('Failed to bind ExtMCP gRPC server:', err);
    process.exit(1);
  }
  console.info(
    `AgentGateway ExtMCP Guardrail gRPC server listening on ${BIND_ADDR} (port ${boundPort})`,
  );
});
