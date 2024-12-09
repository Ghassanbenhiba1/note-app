import Login from "./components/Login";
import NotesList from "./components/NotesList";
import { useState } from "react";

function App() {
  const [isConect, setisConect] = useState(false);

  return (
    <div>{isConect ? <NotesList /> : <Login setisConect={setisConect} />}</div>
  );
}

export default App;