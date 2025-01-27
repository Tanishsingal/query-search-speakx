const mongoose = require("mongoose")

const BlockSchema = new mongoose.Schema({
  text: { type: String, required: true },
  showInOption: { type: Boolean, default: true },
  isAnswer: { type: Boolean, default: false },
})

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrectAnswer: { type: Boolean, default: false },
})

const QuizSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: {
    type: String,
    enum: ["MCQ", "ANAGRAM", "READ_ALONG", "CONTENT_ONLY"],
    required: true,
  },
  anagramType: {
    type: String,
    enum: ["WORD", "SENTENCE"],
    required: function () {
      return this.type === "ANAGRAM"
    },
  },
  blocks: {
    type: [BlockSchema],
    required: function () {
      return this.type === "ANAGRAM"
    },
  },
  options: {
    type: [OptionSchema],
    required: function () {
      return this.type === "MCQ"
    },
  },
  siblingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  solution: {
    type: String,
    required: function () {
      return this.type === "ANAGRAM"
    },
  },
  title: { type: String, required: true },
})

module.exports = mongoose.model("Question", QuizSchema)

