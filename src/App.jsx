import PathVisulizer from "./PathVisilizer/PathVisliser.jsx"
function App() {
    function handlemouse(e){
        e.preventDefault();
    }
  return (
    <div onClick={handlemouse} onMouseDown={handlemouse}>
      <PathVisulizer  />
    </div>
  )
}

export default App
