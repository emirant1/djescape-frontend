import './App.css'
import Header from "./components/header/Header.tsx";
import Footer from "./components/footer/Footer.tsx";
import Nav from "./components/nav/Nav.tsx";

function App() {

  return (
    <main>
        <Header />
        <Nav />
        <div className="body">
            <p className="about">About:</p>
            <p className="txt">DJ Escape "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
        </div>
        <Footer />
    </main>
  )
}

export default App
