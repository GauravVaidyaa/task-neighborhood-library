const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const util = require("util");

const PROTO_PATH = path.join(__dirname, "../../proto/library.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDef).library;

const client = new proto.LibraryService(
  "grpc-server:50051",
  grpc.credentials.createInsecure()
);

// Promisify methods
client.CreateBook = util.promisify(client.CreateBook.bind(client));
client.ListBooks = util.promisify(client.ListBooks.bind(client));
client.UpdateBook = util.promisify(client.UpdateBook.bind(client));
client.DeleteBook = util.promisify(client.DeleteBook.bind(client));

client.CreateMember = util.promisify(client.CreateMember.bind(client));
client.ListMembers = util.promisify(client.ListMembers.bind(client));
client.UpdateMember = util.promisify(client.UpdateMember.bind(client));
client.DeleteMember = util.promisify(client.DeleteMember.bind(client));

client.BorrowBook = util.promisify(client.BorrowBook.bind(client));
client.ReturnBook = util.promisify(client.ReturnBook.bind(client));
client.ListBorrowedBooks = util.promisify(client.ListBorrowedBooks.bind(client));

module.exports = client;
