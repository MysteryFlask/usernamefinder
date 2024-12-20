import { useState } from "react"
import './style.css'

function App() {
  const [names, setNames] = useState([])
  const [minLength, setMinLength] = useState(3)
  const [maxLength, setMaxLength] = useState(16)
  const [rare, setRare] = useState('none')

  const getNames = async () => {
    let listResult
    let page = 1

    const updateNames = (name) => {
      setNames((prevNames) => [...prevNames, name])
    }

    do {
      const response = await fetch(`/get/api/v3/names?order_by=available_from&order=ASC&page=${page}&popularity=0&min_length=${minLength}&max_length=${maxLength}&is_og=${rare}`)
      listResult = await response.json()
      if (Array.isArray(listResult) && listResult.length > 0) {
        for (let index = 0; index < listResult.length; index++) {
            const name = listResult[index].name
            let retry = true
            while (retry) {
              const checkResponse = await fetch(`check/users/profiles/minecraft/${name}`)
              if (checkResponse.status === 404) {
                updateNames(name)
                retry = false
              } else if (checkResponse.status === 429) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              } else {
                retry = false
              }
            }
        }
      }
      page++
    } while (Array.isArray(listResult) && listResult.length > 0)
  }

  return (
    <>
      <div className="container">
        <h1>Username Finder</h1>
        <h2>By 0456</h2>
        <div className="rangecontainer">
          <div className="numbercontainer">
            <div>
              <label htmlFor="min">Min - {minLength}</label>
              <input type="range" min={3} max={16} name="min" value={minLength} onChange={() => {setMinLength(event.target.value)}}></input>
            </div>
            <div>
              <label htmlFor="max">Max - {maxLength}</label>
              <input type="range" min={3} max={16} name="max" value={maxLength} onChange={() => {setMaxLength(event.target.value)}}></input>
            </div>
          </div>
        </div>
        <div className="buttoncontainer">
          <div className="checkboxcontainer">
            <label htmlFor="og">OG Name</label>
            <input type="checkbox" name="og" checked={rare === 'show'} onChange={() => {setRare(event.target.checked ? 'show' : 'none')}}></input>
          </div>
          <button onClick={() => {getNames()}}>Generate</button>
        </div>
      </div>
      <ul>{names.map((name, index) => (<li key={index} onClick={() => {window.open(`https://namemc.com/search?q=${name}`, '_blank', 'noopener,noreferrer');}}>{name}</li>))}</ul>
    </>
  )
}

export default App