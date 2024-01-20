
import "../styles/EntryPage.css";
import entry3 from "../images/entry3.jpg";
import {db,auth} from "../firebase/firebaseInit";
import { doc ,getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword,updatePassword } from "firebase/auth";
import ToggleState from "../ToggleState";
import { updateDoc } from "firebase/firestore";
import "../styles/LoginPage.css";
import InputState from "../InputState";
import { CurrentUserContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IlerlemeContext } from "../context/IlerlemeContext";
import { SistemKullanicilarContext } from "../context/SistemKullanicilarContext";

export default function LoginPage () {
      const navigate = useNavigate();
      const sistemKullanicilarContext = useContext(SistemKullanicilarContext);
      const {ilerlemeChange,loadingChange} = useContext(IlerlemeContext);
      const {state,dispatch} = useContext(CurrentUserContext);
      const [loginValue,loginValueChange] = ToggleState(false);
      const [email,emailChange,emailReset] = InputState("");
      const [password,passwordChange,passwordReset] = InputState("");    
      const [newPassword,newPasswordChange] = InputState("");
      const [repeatNewPassword,repeatNewPasswordChange] = InputState("");

    const handelLogin = e =>{
      e.preventDefault();
      let datas ;
      let ilerlemeData;
      signInWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const user = userCredential.user;
    const docRef = doc(db, "Users",`${user.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
       datas = {...docSnap.data()};  
      console.log("Document data:", docSnap.data());
      console.log(datas.type);

      switch(datas.type)
      {
             case "Admin":
              console.log("admin case",sistemKullanicilarContext);                        
             navigate("/kullanici/admin");
             break;
           case "Danisman":
            if(datas.disable === true)
           {
            return ;
           }
           else
           { 
            if(docSnap.data().hedefler === null)
            {
             navigate("/kullanici/signin/setupdanisman" ,{replace:true,state:{...datas}});
             break;     
            }  
            else
            {loadingChange(true);
            let docRef2 ;
            let docSnap2;
               docRef2 = doc(db, "DanismanIlerleme",`${user.uid}`);
               docSnap2 = await getDoc(docRef2);
           if(docSnap2.exists())
           {
             console.log("docSnap2.data",docSnap2.data())
             ilerlemeData ={...docSnap2.data()};
             ilerlemeChange({...ilerlemeData});
              loadingChange(false);
              navigate("/kullanici/danisman",{state:{...datas}});
           }
           else {
             console.log("No such document!");
           }}
          }
        
              break;
            default :
            if(datas.disable === true)
            {    
              return ;
            }
             else
             {  
              if(docSnap.data().hedefler === null)
              {
                navigate("/kullanici/signin/setupantrenor",{replace:true,state:{...datas}});
               break;     
              }
              navigate("/kullanici/antrenor",{state:{...datas}});}
               break;
              } 
      console.log("ilerlemeData ==> ",ilerlemeData)                 
    dispatch({type:"LOGIN",user:{id:user.uid,type:datas.type}});
    } else {
      console.log("No such document!");
    }
   
  })
  .catch((error) => {
      loginValueChange(true);
  });
    } 
    
    const handelResetPassword =async (e) => {
                e.preventDefault();
                console.log("new password = ",newPassword," repeat new password = ",repeatNewPassword)
                signInWithEmailAndPassword(auth, email, password)
                .then( (userCredential) => {
                       const handelUpdate =async () => {
                        const user = userCredential.user;
                          updatePassword(auth.currentUser, newPassword).then(async () => {
                            const userRef = doc(db, "Users", user.uid);
                            await updateDoc(userRef, {
                              password: newPassword
                            });     
                          }).catch((error) => {
                        console.log("error",error);
                          });                               
                       } 
                       handelUpdate()
                })
                .catch((error) => {
                  console.log("error",error);
                });

    }
    
    const handelYeniKayit = (e) => {
      e.preventDefault();
      navigate("/kullanici/signin");     
    }
  return <div className="body" style={{background:`url(${entry3})`, backgroundRepeat:"no-repeat" ,backgroundSize:"100% 100%"}}>
            <div className="container-fluid" style={{backgroundColor:"rgba(0,0,0,0.6)" , height:"100%" , width:"100%" }}>
            <div className="row ">
             <div className="col">
                <h1 className="display-5 text-center page-title text-white" >KULLANICI GIRIS FORM</h1>
            </div>  
          </div>   
            <form>
                <div className="row mt-3 mb-2 justify-content-center">
                <div className="col-6">
                <label htmlFor="kullaniciEmail text-white">Email</label>
                    <input className="form-control" id="kullaniciEmail" type="email" placeholder="example@gmail.com" onChange={emailChange} value={email}/>
                </div>  
                </div>
                <div className="row mt-3 mb-2 justify-content-center">
                <div className="col-6">
                <label htmlFor="kullaniciPassword text-white">Password</label>
                    <input className="form-control" id="kullaniciPassword" type="password" onChange={passwordChange} value={password}/>
                </div>  
                </div>
                <div className="row justify-content-center">
                   <div className="col-2">
                   <button className="btn btn-success giris-btn" onClick={handelLogin} >Giris</button>
                   </div>
                   <div className="col-2">
                   <button className="btn btn-success giris-btn" onClick={(e) => {
                              handelYeniKayit(e);
                   }}>Yeni Kayit</button>
                   </div>
                   <div className="col-2 ">
                    <button type="button" className="btn btn-success giris-btn" data-bs-toggle="modal" data-bs-target={`#staticResetPasswordModel`} onClick={async (e) => {
              e.preventDefault();
            }}>
              Sifre Sifirla
            </button>
          {<div className="modal fade" id={`staticResetPasswordModel`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`staticResetPasswordModel`} aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id={`staticResetPasswordModel`}>Sifre Sıfırlama</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                   {
                     
                   ((email === "" ) || (password === "") ) ? "Lütfen Email ve Eski Sifrenizi Giriniz" : "Yeni Sifreyi Giriniz"}
                  </div>
                  {((email !== "") && (password !== "") ) && <div className="modal-footer justify-content-center">
                             <form>
                             <label htmlFor="newPassword" >Yeni Sifre</label>
                      <input className="form-control" id="newPassword" type="text" value={newPassword} onChange={
                          
                          (e) =>{
                            newPasswordChange (e)
                          }

                      } /> 
                       <label htmlFor="repeatNewPassword" >Tekrar Yeni Sifre</label>
                      <input className="form-control" id="repeatNewPassword" type="text" value={repeatNewPassword} onChange={
                       (e) =>{
                        repeatNewPasswordChange(e)
                      }
                      } /> 
                             <button disabled={!((repeatNewPassword !== "") && (newPassword !== "" ) && (newPassword === repeatNewPassword) )}  className="btn btn-success btn-sm mt-2 ms-5"  onClick={handelResetPassword}>Onayla</button>
                             </form>  
                  </div>}
                </div>
              </div>
            </div>}
  
                 </div>
                </div>
               
             </form>
             <div className="row justify-content-center mt-4">
                  <div className="col-6" style={{color: "red",textAlign:"center"}}>
                     <span>{loginValue && "Password ya da Email Yanlıs"}</span>
                     <button className="text-white ms-4"  onClick={loginValueChange} style={{borderColor:"transparent", backgroundColor:"transparent", display: loginValue || "none"}}>X</button>
                  </div>
                </div>
            </div>
  </div>

}
