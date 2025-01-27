import { useState, useEffect } from "react"
import { SearchInput } from "./SearchInput"
import { QuestionCard } from "./QuestionCard"
import { Pagination } from "./Pagination"

export default function QuestSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [allQuestions, setAllQuestions] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const questionsPerPage = 5

  useEffect(() => {
    const controller = new AbortController()

    const searchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}&pageSize=${questionsPerPage}`,
          { signal: controller.signal },
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setAllQuestions(data.questions || [])
        setFilteredQuestions(data.questions || [])
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error searching questions:", error)
        }
      }
    }

    searchQuestions()

    return () => controller.abort()
  }, [searchQuery, currentPage])

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)
  const startIndex = (currentPage - 1) * questionsPerPage
  const displayedQuestions = filteredQuestions.slice(startIndex, startIndex + questionsPerPage)

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const getTypeCount = (type) => {
    return allQuestions.filter((q) => q.type === type).length
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.body.style.backgroundColor = darkMode ? "white" : "black"
    document.body.style.color = darkMode ? "black" : "white"
  }

  const filterdata = (type) => {
    if (type === "ALL") {
      setFilteredQuestions(allQuestions)
    } else {
      const data = allQuestions.filter((d) => d.type === type)
      setFilteredQuestions(data)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="space-y-8">
        <div>
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold mb-4">Question Search</h1>
            <button
              onClick={toggleDarkMode}
              className={`dark-mode-toggle ${
                darkMode ? " text-white border-gray-600" : " text-black border-gray-300"
              }`}
            >
              {darkMode ? "☀️" : "🌑"}
            </button>
          </div>
          <SearchInput
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by title or type (e.g., ANAGRAM, MCQ, READ_ALONG)"
          />

          {searchQuery && (
            <div className="mt-2 text-sm text-muted-foreground">
              Found {filteredQuestions.length} results
              {searchQuery && (
                <span className="ml-1">
                  (ANAGRAM: {getTypeCount("ANAGRAM")}, MCQ: {getTypeCount("MCQ")}, READ_ALONG:{" "}
                  {getTypeCount("READ_ALONG")})
                </span>
              )}
              <br />
              
            </div>
          )}
        </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => filterdata("ALL")}
                  className="px-3 py-1 text-sm font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  All
                </button>
                <button
                  onClick={() => filterdata("ANAGRAM")}
                  className="px-3 py-1 text-sm font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Anagram
                </button>
                <button
                  onClick={() => filterdata("MCQ")}
                  className="px-3 py-1 text-sm font-medium rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  MCQ
                </button>
                <button
                  onClick={() => filterdata("READ_ALONG")}
                  className="px-3 py-1 text-sm font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Read Aloud
                </button>
              </div>

        <div className="space-y-4">
          {displayedQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No questions found matching your search.</div>
          ) : (
            displayedQuestions.map((question) => <QuestionCard key={question._id} question={question} />)
          )}
        </div>

        {filteredQuestions.length > questionsPerPage && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  )
}

