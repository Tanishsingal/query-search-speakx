const path = require("path")
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
const mongoose = require("mongoose")
const Question = require("../models/Question")

// Connect to MongoDB
mongoose.connect("mongodb+srv://tanishsingal245:HAPoko1WV9etGKXp@cluster0.f6yyg.mongodb.net/questions_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Load proto file
const protoPath = path.join(__dirname, "..", "proto", "questions.proto")
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const questionsProto = grpc.loadPackageDefinition(packageDefinition).questions

// Implement the SearchQuestions RPC method
const searchQuestions = async (call, callback) => {
  const { query, page, pageSize } = call.request
  const skip = (page - 1) * pageSize

  try {
    Question.collection.createIndex({ title: 1 })
    const questions = await Question.find({ title: { $regex: query, $options: "i" } }, null, { skip, limit: 5000 })
    const total = await Question.countDocuments({ title: { $regex: query, $options: "i" } })

    callback(null, { questions, total })
  } catch (error) {
    callback(error)
  }
}

// Create gRPC server
const server = new grpc.Server()
server.addService(questionsProto.QuestionService.service, { SearchQuestions: searchQuestions })

// Start server
server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(error)
    return
  }
  console.log(`gRPC Server running at http://0.0.0.0:${port}`)
  server.start()
})

