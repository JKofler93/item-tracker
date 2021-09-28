import './App.css';

// import pages
import Items from './pages/Items';
// app will launch in an authenticated state, 
// logged in as a team member named "Sarah T". 
// When interacting with the API, you will always supply "Sarah T" as the team member where applicable.

function App() {

  return (
    <div className="App">
      <h1 className="reset">Deep Structure - Checklist Manager</h1>
          <Items/>
    </div>
  );
}

export default App;