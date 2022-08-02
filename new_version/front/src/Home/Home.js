import "./style/Home.css";
import NavbarHome from "./NavbarHome.js";
import Login from "./Login.js";
import HomePres1 from './HomePres1.js';
import HomePres2 from './HomePres2.js';
import HomePres3 from './HomePres3.js';
import ReportBug from './ReportBug.js';

function Home() {
  return(
    <div className="MainContainerConnexion">

      <NavbarHome/>

      <Login />

      <HomePres1 />
      <HomePres2 />
      <HomePres3 />
      <ReportBug />

    </div>
  );
}

export default Home;
