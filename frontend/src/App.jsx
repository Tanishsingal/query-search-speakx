import React, { useState } from "react"

function App() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const searchQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=10`)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setResults(data.questions)
      setTotalPages(Math.ceil(data.total / 10))
    } catch (error) {
      console.error("Error searching questions:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question Search</h1>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Search questions..."
        />
        <button onClick={searchQuestions} className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </div>
      <div>
        {results.map((question) => (
          <div key={question.id} className="mb-2">
            <span className="font-bold">{question.type}:</span> {question.title}
          </div>
        ))}
      </div>
      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => {
              setPage(i + 1)
              searchQuestions()
            }}
            className={`mr-2 p-2 ${page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App

