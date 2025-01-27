const express = require("express")
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
const cors = require("cors")
const path = require("path")

const app = express()
const port = 3001

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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
const client = new questionsProto.QuestionService("localhost:50051", grpc.credentials.createInsecure())

app.get("/api/search", (req, res) => {
  const { query, page, pageSize } = req.query

  client.SearchQuestions(
    { query, page: Number.parseInt(page), pageSize: Number.parseInt(pageSize) },
    (error, response) => {
      if (error) {
        console.error(error)
        res.status(500).json({ error: "An error occurred while searching questions" })
        return
      }
      res.json(response)
    },
  )
})

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`)
})

