
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}


const { useState, useEffect } = React

function App() {
  
  const WORDS = [
    "apple",
    "banana",
    "orange",
    "grape",
    "mango",
    "peach",
    "cherry",
    "melon",
    "kiwi",
    "pear"
  ]

  const maxStrikes = 3
  const maxPasses = 3


  
  const [words, setWords] = useState(() => {
    const saved = localStorage.getItem("words")
    return saved ? JSON.parse(saved) : shuffle(WORDS)
  })

  const [currentWord, setCurrentWord] = useState(() => {
    const saved = localStorage.getItem("currentWord")
    return saved || ""
  })

  const [scrambled, setScrambled] = useState("")
  const [guess, setGuess] = useState("")
  const [message, setMessage] = useState("")

  const [points, setPoints] = useState(() => {
    return Number(localStorage.getItem("points")) || 0
  })

  const [strikes, setStrikes] = useState(() => {
    return Number(localStorage.getItem("strikes")) || 0
  })

  const [passes, setPasses] = useState(() => {
    return Number(localStorage.getItem("passes")) ?? maxPasses

  })

  const [gameOver, setGameOver] = useState(false)


  useEffect(() => {
    if (!currentWord && words.length > 0) {
      nextWord()
    } else {
      setScrambled(shuffle(currentWord))
    }
  }, [])

 
  useEffect(() => {
    localStorage.setItem("words", JSON.stringify(words))
    localStorage.setItem("currentWord", currentWord)
    localStorage.setItem("points", points)
    localStorage.setItem("strikes", strikes)
    localStorage.setItem("passes", passes)
  }, [words, currentWord, points, strikes, passes])

  
  useEffect(() => {
    if (strikes >= maxStrikes || words.length === 0) {
      setGameOver(true)
    }
  }, [strikes, words])

  function nextWord() {
    if (words.length === 0) return

    const newWord = words[0]
    setCurrentWord(newWord)
    setScrambled(shuffle(newWord))
    setWords(words.slice(1))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (guess.toLowerCase() === currentWord) {
      setMessage(<div className="message-correct">
        <p>Correct : {currentWord}</p>
      </div>)
      setPoints(points + 1)
      nextWord()
    } else {
      setMessage("Incorrect! :( ")
      setMessage(<div className="message-incorrect">
        <p>Incorrect</p>
      </div>)
      setStrikes(strikes + 1)
    }

    setGuess("") 
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(passes - 1)
      setMessage(<div className="message-pass">
        <p>Passed </p>
      </div>)
      nextWord()
    }
  }

  function restartGame() {
    const newWords = shuffle(WORDS)

    setWords(newWords)
    setPoints(0)
    setStrikes(0)
    setPasses(maxPasses)
    setGameOver(false)
    setMessage("")
    setGuess("")

    const firstWord = newWords[0]
    setCurrentWord(firstWord)
    setScrambled(shuffle(firstWord))
    setWords(newWords.slice(1))

    localStorage.clear()
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>Scramble Game</h1>

      {gameOver ? (
        <div>
          <h2>Game Over</h2>
          <p>Points: {points}</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <h2>Scrambled Word:</h2>
          <h1>{scrambled}</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter guess"
            />
            <button type="submit">Guess</button>
          </form>

          <br />

          <button onClick={handlePass} disabled={passes === 0}>
            Pass ({passes} left)
          </button>

          <p>{message}</p>

          <h3>Points: {points}</h3>
          <h3>Strikes: {strikes} / {maxStrikes}</h3>
          <h3>Passes: {passes} / {maxPasses}</h3>
        </div>
      )}
    </div>
  )
}

const root = ReactDOM.createRoot(document.body)
root.render(<App />);