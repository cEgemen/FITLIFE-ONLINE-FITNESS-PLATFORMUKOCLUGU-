import { Link, Outlet } from "react-router-dom";
import img from "../images/entry2.jpg"
import "../styles/EntryPage.css"

export default function EntryPageNavBar(){
    return <div className= "body" style={{background : `url(${img})`, backgroundRepeat :"repeat" , backgroundSize:"cover"}}>
          <div className="container">
                 <div className="row justify-content-end">
                         <div className=" col-4  border-bottom">
                         <ul className="nav justify-content-evenly">
  <li className="nav-item">
    <Link to="/kullanici/login" className="nav-link link">LOG IN</Link>
  </li>
  <li className="nav-item">
   <Link to="/kullanici/signin" className="nav-link link">SIGN IN</Link>
  </li>
</ul>
                         </div>
                 </div>
          </div>
          <Outlet/>
    </div>
}