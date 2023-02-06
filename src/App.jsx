import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Table from './components/Table'


function App() {
  const [isAuthed, setAuthed] = useState(false);
  const [data, setData] = useState([]);
  const [verifying, setVerifying] = useState(false);
  const [errors, setErrors] = useState([]);
  

  const baseUrl = "https://mailist.onrender.com/api/admin";
  // console.log(`baseUrl is ${baseUrl}`)

  useEffect(() => {
    if(localStorage.getItem('token')){
      if(Date.now() < parseInt(localStorage.getItem('loginTime'))+21600*1000)
        setAuthed(true)
    }
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    var pass = e.target.elements[0].value;
    // console.log(pass);
    setVerifying(true);
    axios
      .post(
        `${baseUrl}/login`,
        {
          name: "FeliQ",
          password: pass,
        }
      )
      .then((response) => {
        setVerifying(false)
        setAuthed(true)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem('loginTime',Date.now())
      })
      .catch((err) => {
        setVerifying(false)
        setErrors([...errors, err.response]) 
        console.log(err.response.data)
      });
  };

  // useEffect(() => {setTimeout(() => setErrors([]), 5000)},[errors.length>0])

  return (
    <div className="App max-w-400 p-4 flex justify-center items-center h-screen">
      { isAuthed ? (<Table baseUrl={baseUrl} setAuthed={setAuthed}/>) : (
        <div>
          
          <h1 className="text-center text-xl text-blue-900 pb-7">Admin Portal</h1>
          {(errors.length!==0)?<div
              className="bg-red-100 rounded border-red-500 text-red-700 px-3 py-2 mb-2"
              role="alert"
            >
              
              <p className="text-xs">
                {errors[0].data.msg}
              </p>
            </div>:<></>}
          <form className="block  h-fit" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter password
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="flex justify-end items-center">
            {(verifying)?<i className="fas fa-spin fa-spinner h-fit mr-4"></i>:<></>}
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
