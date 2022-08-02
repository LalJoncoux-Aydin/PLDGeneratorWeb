import "./style/Login.css";

function Login() {
  return(
    <div className="ContainerConnexion">
      <div className="ContainerTopConnexion">
        <div className="SmallerContainerConnexion">
        <h2 className="SmallerContainerTitleConnexion">Connect</h2>
        <form action="../../createAccount" method="post" className="FormConnexion">
          <label for="identity">Id :</label>
          <input placeholder="example@gmail.com" name="identity" className="InputIDConnexion"/>

          <label for="password">Password :</label>
          <input placeholder="*******" name="password"  className="InputPwConnexion"/>

          <button type="submit" className="ButtonConnexion">Connect</button>
        </form>
        </div>
        <div className="ArrowRegisterConnexion">
          <p><a>Register</a></p>
        </div>
      </div>
      <div className="ArrowLearnMoreConnexion">
        <p>Learn more</p>
      </div>
    </div>
  );
}

export default Login;
