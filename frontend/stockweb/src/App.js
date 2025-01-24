import './App.css';
import Body from './components/Body';
import {Toaster} from "react-hot-toast"
import './utils/axiosConfig';

function App() {
  return (
    <div className="App">
      <Body/>
      <Toaster/>
    </div>
  );
}

export default App;
