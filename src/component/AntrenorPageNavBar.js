import { Outlet, } from "react-router-dom";
import entry1 from "../images/entry1.1.png"
import {useLocation, useNavigate } from "react-router-dom";
import "../styles/EntryPage.css"
import React,{useEffect,useContext, useState} from "react";
import { CurrentUserContext } from "../context/AuthContext";
import { doc ,getDoc } from "firebase/firestore";
import {db,auth} from "../firebase/firebaseInit";
import { signOut } from "firebase/auth";


export default function AntrenorPageNaveBar () {
    const navigate = useNavigate()
    const location = useLocation();
    const {state,dispatch} = useContext(CurrentUserContext);
     const [antrenorDatas,antrenorDatasChange] = useState({});
    const [dataLoad,dataLoadChange] = useState(false);
    const [lock,lockChange] = useState(false);
          console.log("state ? ",state)
          const handelInit =async () => {
            dataLoadChange(false) 
         const  docRef2 = doc(db, "Users",`${state.user.id}`);
         const  docSnap2 = await getDoc(docRef2);
      if(docSnap2.exists())
      {
        antrenorDatasChange({...docSnap2.data()})
      }
      else {
        console.log("No such document!");
      } 
      dataLoadChange(true)
          }
     if(!lock)
     {
      handelInit();
      lockChange(!lock)
     } 
     const handelRoute = name =>{
          console.log(location.pathname)
          switch(name)
          {
            case "profile":
                const path =`${location.pathname}`+"/"+name;
            return  navigate(path , { replace: true, state: { currentAntrenor: {...antrenorDatas} } });
            case "home":
            return navigate("/");
            case "signout":
  signOut(auth).then(() => {
   console.log("cıkıs basarılı");
}).catch((error) => {
  console.log(error);
});
dispatch({type:"LOGOUT",user:{}});
            return navigate("/"); 
            case "danismanlar":
              return navigate("/kullanici/antrenor/danismanlar",{replace:true,state : {currentAntrenor:{...antrenorDatas,id:state.user.id}}})
            default: 
            return ;
          }
     }
     if(dataLoad === false)
     {
        return   <div className="body" style={{background:`url(${entry1})`,
        backgroundSize:"100% 100%",
        backgroundRepeat:"no-repeat",}}>
        
        <div > 
        <div className='container' style={{
marginTop:"15%" , marginLeft:"25%"}}>
              <div className='row justify-content-center'>
                    <div className='col-6'>
             <h4 style={{display:"inline"}}>LOADING</h4>
             <div className="spinner-grow spinner-grow-sm"  role="status">
            <span className="visually-hidden">Loading...</span>
           </div>    
           <div className="spinner-grow spinner-grow-sm "  role="status">
            <span className="visually-hidden">Loading...</span>
           </div>    
           <div className="spinner-grow spinner-grow-sm "  role="status">
            <span className="visually-hidden">Loading...</span>
           </div>    
                    </div>
              </div>
        </div>
       </div>
       </div>
     }
     else
     { return <div className="body" style={{background:`url(${entry1})`,
    backgroundSize:"cover",
    backgroundRepeat:"repeat",}}>
      
                   <div className="container-fluid ">
                <div className="row border-bottom border-dark bg-body-secondary bg-opacity-75" style={{backgroundColor:"transparent"}}>
                    <div className="col">
                    <ul className="nav justify-content-end">
                    <li className="nav-item">
  <button className="btn btn btn-outline-secondary btn-sm m-1" onClick={()=>{handelRoute("danismanlar")}}>Danismanlar</button>
  </li>                   
  <li className="nav-item">
  <button className="btn btn btn-outline-secondary btn-sm m-1" onClick={()=>{handelRoute("profile")}}>Profile</button>
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
      {/* {props.children} */}
    </div>
  }
} 


