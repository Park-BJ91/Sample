import './App.css';
import { useState } from "react";
import TimeTest from "./components/timeTest";
import useFetchApi from './components/gpTest';

// import C1 from './componets/C1';
import C1 from '@components/C1';
import C2 from '@components/C2';
import SplitPane from './components/SplitPane';
// import WelcomeDialog from './componets/WelcomeDialog';


function App() {
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState("");
  const [msgPost, setPostMsg] = useState("");
  const [show, setShow] = useState(false);

  const { res, resPost } = useFetchApi({ bool: !show });

  const fetchMsg = () => {
    fetch("/api/test")
      .then(res => res.json())
      .then(data => setMsg(data.message));
  };


  const fetchMsgPost = () => {
    fetch("/api/test", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      // body: ms,
      body: JSON.stringify({
        message: "POST MESSASGE"
      }),
    })
      .then(res => res.json())
      .then(data => {
        return setPostMsg(JSON.stringify(data.message));
      });
  };


  return (
    <div style={{ textAlign: "center", marginTop: "50px" }} >
      <h1>TEST</h1>
      <div>
        <p>Clicked : {count} </p>
        <button onClick={() => setCount(count + 1)} >Clike Me</button>
      </div>

      <div>
        <p>Message : {msg}</p>
        <button onClick={fetchMsg}>Server Message Call</button>

        <p>Message POST : {msgPost}</p>
        <button onClick={fetchMsgPost}>Server Message Call</button>



      </div>

      <div>
        <p> ON/ OFF  Current : {show} </p>
        <button onClick={() => setShow(!show)}>
          {show ? "타이머 ON" : "타이머 OFF"}
        </button>
        <h2>Timer</h2>
        {show && <TimeTest />}
        <h2>GET || POST</h2>

        <div>
          <p>GET Response: {show && res}</p>
          <p>POST Response: {!show && resPost}</p>
        </div>

      </div>

      <div style={{ marginBlock: "150px" }}>

        <h1>Split Pane</h1>

        <SplitPane warn={show}
          l={<C1 />} r={<C2 />} >
          <p>???</p>
        </SplitPane>
        <div>
          <p>Children</p>
        </div>
      </div>

      <div>
        {/* <SignUpDialog /> */}
        {/* <WelcomeDialog /> */}
      </div>


    </div>
  );
}

export default App;
