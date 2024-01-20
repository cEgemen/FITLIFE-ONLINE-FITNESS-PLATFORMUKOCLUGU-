import { Outlet, useLocation, useNavigate } from "react-router-dom";
import admin from "../images/admin.jpg"
import "../styles/EntryPage.css"
import React,{useEffect,useContext, useState} from "react";
import { CurrentUserContext } from "../context/AuthContext";
import {auth} from "../firebase/firebaseInit";
import { signOut } from "firebase/auth";

export default function AdminPageNavBar(props) {
    const navigate = useNavigate()
    const location = useLocation();
    const {currentAdmin,dispatch} = useContext(CurrentUserContext);
    const [adminDatas,adminDatasChange] = useState({});
    useEffect(() => {
        console.log("useEffect calıstı",location.state);
        adminDatasChange({...location.state}); },[])

    const handelRoute = name =>{
          console.log(location.pathname)
          switch(name)
          {
            case "home":
            return navigate("/");
            case "antrenor":
              return navigate("/kullanici/admin/antrenorler");
            case "danisman":
              return navigate("/kullanici/admin/danisanlar");
            case "ekle":
             return   navigate("/kullanici/admin/kullaniciEkle")  ;
            case "signout":
              signOut(auth).then(() => {
                console.log("cıkıs basarılı");
             }).catch((error) => {
               console.log(error);
             });
             dispatch({type:"LOGOUT",user:{}});
                         return navigate("/"); 
            default :
            return ;
          }
     }
     return <div className="body" style={{background:`url(${admin})` , backgroundRepeat:"no-repeat" , backgroundSize:"100% 100%"}}>
               <div className="container-fluid ">
                <div className="row border-bottom border-dark bg-body-secondary bg-opacity-75" style={{backgroundColor:"transparent"}}>
                    <div className="col">
                    <ul className="nav justify-content-end">
                    <li className="nav-item">
  <button className="btn btn btn-outline-secondary btn-sm m-1" onClick={()=>{handelRoute("ekle")}}>Kullanici Ekle</button>
  </li>
                    <li className="nav-item">
  <button className="btn btn btn-outline-secondary btn-sm m-1" onClick={()=>{handelRoute("danisman")}}>Danisanlar</button>
  </li>
                    <li className="nav-item">
  <button className="btn btn btn-outline-secondary btn-sm m-1" onClick={()=>{handelRoute("antrenor")}}>Antrenorlar</button>
  </li>
  <li className="nav-item">
  <button className="btn btn btn-outline-secondary btn-sm m-1" onClick={()=>{handelRoute("signout")}}>Sign Out</button>
  </li>
  <li className="nav-item">
  <button className="btn btn btn-outline-secondary btn-sm m-1" onClick={()=>{handelRoute("home")}}>Home</button>
  </li>
</ul>
                    </div>
                </div>
               </div>
               <Outlet></Outlet>
             {props.children} 
    </div>

}