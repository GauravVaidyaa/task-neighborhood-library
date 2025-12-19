const grpc = require("@grpc/grpc-js");

function mapGrpcErrorToHttp(err) {
  switch (err.code) {
    case grpc.status.INVALID_ARGUMENT:
      return { status: 400, message: err.details };

    case grpc.status.NOT_FOUND:
      return { status: 404, message: err.details };

    case grpc.status.ALREADY_EXISTS:
    case grpc.status.FAILED_PRECONDITION:
      return { status: 409, message: err.details };

    case grpc.status.PERMISSION_DENIED:
      return { status: 403, message: err.details };

    case grpc.status.UNAUTHENTICATED:
      return { status: 401, message: err.details };

    case grpc.status.UNAVAILABLE:
      return { status: 503, message: "Service unavailable" };

    default:
      return { status: 500, message: err.details || "Internal server error" };
  }
}

module.exports = { mapGrpcErrorToHttp };
