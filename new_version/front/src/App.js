import "./App.css";

function App() {
  return (
    <div className="MainContainerConnexion">
      <h1 className="TitleConnexion">Connection to PLD Generator</h1>

      <div className="ContainerConnexion">
        <div className="SmallerContainerConnexion">
          <h2>Connect</h2>
          <form action="../../post" method="post" className="FormConnexion">
            <label for="identity">Id :</label>
            <input placeholder="example@gmail.com" name="identity"/>

            <label for="password">Password :</label>
            <input placeholder="*******" name="password"/>

            <button type="submit">Connect</button>
          </form>
          <p><a>Don't have an account yet ?</a></p>
        </div>
      </div>
    </div>
  );
}

export default App;
