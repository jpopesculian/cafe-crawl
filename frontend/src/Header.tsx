import "./Header.css";

function Header() {
  return (
    <div className="Header">
      <div className="HeaderContent content">
        <img className="Logo" src="./cafecrawl.png" />
        <div className="nav-items">
          <div className="nav-item">
            <a href="#about">what the fudge?</a>
          </div>
          <div className="nav-item">
            <a href="#spots">spots</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
