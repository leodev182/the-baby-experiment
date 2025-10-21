import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="min-h-screen grid place-items-center">
        <h1 className="text-3xl font-bold text-green-400">Tailwind ON ✅</h1>
      </div>
      <div>
        <a
          target="_blank"
          href="https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=ZmE5N3VmZzd2YjBxNnZlcjN2MDdrY2ZnbWsgYXJva2VuMTgyQG0&amp;tmsrc=aroken182%40gmail.com"
          rel="noopener noreferrer"
        >
          <img
            // style={{ border: "0" }}
            src="https://calendar.google.com/calendar/images/ext/gc_button1_es.gif"
            alt="Google Calendar"
          />
        </a>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
