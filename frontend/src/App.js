import React, { useEffect, useState } from "react";

function App() {
	  const [backendStatus, setBackendStatus] = useState("Loading...");

	  useEffect(() => {
		      fetch("/api/health")
		        .then((res) => res.json())
		        .then((data) => {
				        setBackendStatus(data.message);
				      })
		        .catch((err) => {
				        setBackendStatus("Backend not reachable");
				      });
		    }, []);

	  return (
		      <div style={{ padding: "50px", fontFamily: "Arial" }}>
		        <h1>Three Tier Application</h1>

		        <h3>Frontend: React JS</h3>
		        <h3>Backend: Node.js</h3>
		        <h3>Database: MongoDB</h3>

		        <hr />

		        <h2>Backend Status:</h2>
		        <p>{backendStatus}</p>
		      </div>
		    );
}

export default App;
