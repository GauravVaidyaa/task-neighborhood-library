const client = require("../grpc/libraryClient");
const logger = require("../logger");
const { mapGrpcErrorToHttp } = require("../utils/grpcErrorMapper");

/**
 * Create Member
 */
exports.createMember = async (req, res) => {
  try {
    const response = await client.CreateMember(req.body);
    return res.status(201).json(response);
  } catch (err) {
    logger.error("CreateMember failed", {
      route: "POST /members",
      payload: req.body,
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};

/**
 * List Members
 */
exports.listMembers = async (req, res) => {
  try {
    const response = await client.ListMembers({});
    return res.json(response.members);
  } catch (err) {
    logger.error("ListMembers failed", {
      route: "GET /members",
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};

/**
 * Update Member
 */
exports.updateMember = async (req, res) => {
  try {
    const response = await client.UpdateMember({
      id: Number(req.params.id),
      ...req.body,
    });

    return res.json(response);
  } catch (err) {
    logger.error("UpdateMember failed", {
      route: "PUT /members/:id",
      params: req.params,
      payload: req.body,
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};

/**
 * Delete Member
 */
exports.deleteMember = async (req, res) => {
  try {
    const response = await client.DeleteMember({
      id: Number(req.params.id),
    });

    return res.json(response);
  } catch (err) {
    logger.error("DeleteMember failed", {
      route: "DELETE /members/:id",
      params: req.params,
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};
