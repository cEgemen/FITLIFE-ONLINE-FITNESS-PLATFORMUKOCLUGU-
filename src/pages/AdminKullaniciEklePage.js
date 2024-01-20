import "../styles/EntryPage.css";
import React,{useRef, useState,useContext} from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth,db} from "../firebase/firebaseInit";
import { doc,setDoc } from "firebase/firestore";
import InputState from "../InputState";
import "../styles/LoginPage.css";
import { getStorage,ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { SistemKullanicilarContext } from "../context/SistemKullanicilarContext";


export default function AdminKullaniciEklePage () {
    const navigate = useNavigate();
    const {sistemKullanicilar,sistemKullanicilarChange,loading,loadingChange} = useContext(SistemKullanicilarContext);
    const [email, emailChange, emailReset] = InputState("");
    const [password, passwordChange, passwordReset] = InputState("");
    const [cinsiyet, cinsiyetChange, cinsiyetReset] = InputState("Other");
    const [birtday, birtdayChange, birtdayReset] = InputState("");
    const [kullaniciAd, kullaniciAdChange, kullaniciAdReset] = InputState("");
    const [kullaniciSoyad, kullaniciSoyadChange, kullaniciSoyadReset] = InputState("");
    const [kullaniciType, kullaniciTypeChange, kullaniciTypeReset] = InputState("Danisman");
    const [tel, telChange, telReset] = InputState("");
    const [img, imgChange] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");
    const [imgFile,imgFileChange] = useState();
    const [buttonDisable,buttonDisableChange] = useState(false);
    const inputRef = useRef(); 
    const handelSignIn = async e => {
        console.log("kullanici ekle page sistemlullanicilari ===>> ",sistemKullanicilar);
        e.preventDefault();
        try{
             const  res =await createUserWithEmailAndPassword(auth,email,password);
            if(kullaniciType === "Danisman")   
             {
                await setDoc(doc(db,"SistemKullanici","sistemKullanicilari"), {adminler:[...sistemKullanicilar.adminler],danismanlar : [...sistemKullanicilar.danismanlar,res.user.uid],antrenorlar : [...sistemKullanicilar.antrenorlar],kullaniciHistoryCount:[...sistemKullanicilar.kullaniciHistoryCount,((sistemKullanicilar.adminler.length+sistemKullanicilar.antrenorlar.length+sistemKullanicilar.danismanlar.length)+1)]});
                await setDoc(doc(db,"DanismanProgramlar",res.user.uid),{beslenmeProgram:{},egzersizProgram:[{}]})
                loadingChange(true)
                sistemKullanicilarChange({adminler:[...sistemKullanicilar.adminler],danismanlar : [...sistemKullanicilar.danismanlar,res.user.uid],antrenorlar : [...sistemKullanicilar.antrenorlar] ,kullaniciHistoryCount:[...sistemKullanicilar.kullaniciHistoryCount,((sistemKullanicilar.adminler.length+sistemKullanicilar.antrenorlar.length+sistemKullanicilar.danismanlar.length)+1)]})
                loadingChange(false)
                await setDoc(doc(db, "Users", res.user.uid), {kullaniciAd:kullaniciAd,kullaniciSoyad:kullaniciSoyad,cinsiyet:cinsiyet,birtday:birtday,email:email,password:password,tel:tel,type:kullaniciType,img:img,id:res.user.uid, boy:null, kilo:null, yag:null, kas:null, kütleIndex:null, hedefler:null ,disable:false,});
                
            }
           else if(kullaniciType === "Antrenor")   
             {
               
                await setDoc(doc(db,"SistemKullanici","sistemKullanicilari"), {adminler:[...sistemKullanicilar.adminler],danismanlar : [...sistemKullanicilar.danismanlar],antrenorlar : [...sistemKullanicilar.antrenorlar,res.user.uid],kullaniciHistoryCount:[...sistemKullanicilar.kullaniciHistoryCount,((sistemKullanicilar.adminler.length+sistemKullanicilar.antrenorlar.length+sistemKullanicilar.danismanlar.length)+1)]});
                loadingChange(true)
                sistemKullanicilarChange({adminler:[...sistemKullanicilar.adminler],danismanlar : [...sistemKullanicilar.danismanlar],antrenorlar : [...sistemKullanicilar.antrenorlar,res.user.uid],kullaniciHistoryCount:[...sistemKullanicilar.kullaniciHistoryCount,((sistemKullanicilar.adminler.length+sistemKullanicilar.antrenorlar.length+sistemKullanicilar.danismanlar.length)+1)]})
                loadingChange(false)
                await setDoc(doc(db, "Users", res.user.uid), {kullaniciAd:kullaniciAd,kullaniciSoyad:kullaniciSoyad,cinsiyet:cinsiyet,birtday:birtday,email:email,password:password,tel:tel,type:kullaniciType,img:img,id:res.user.uid,deneyim:null,hedefler:null ,disable:false});
                
            }
            else   
             {
               
                await setDoc(doc(db,"SistemKullanici","sistemKullanicilari"), {adminler:[...sistemKullanicilar.adminler,res.user.uid],danismanlar : [...sistemKullanicilar.danismanlar],antrenorlar : [...sistemKullanicilar.antrenorlar],kullaniciHistoryCount:[...sistemKullanicilar.kullaniciHistoryCount,((sistemKullanicilar.adminler.length+sistemKullanicilar.antrenorlar.length+sistemKullanicilar.danismanlar.length)+1)]});
                loadingChange(true)
                sistemKullanicilarChange({adminler:[...sistemKullanicilar.adminler,res.user.uid],danismanlar : [...sistemKullanicilar.danismanlar],antrenorlar : [...sistemKullanicilar.antrenorlar],kullaniciHistoryCount:[...sistemKullanicilar.kullaniciHistoryCount,((sistemKullanicilar.adminler.length+sistemKullanicilar.antrenorlar.length+sistemKullanicilar.danismanlar.length)+1)]})
                loadingChange(false)
                await setDoc(doc(db, "Users", res.user.uid), {kullaniciAd:kullaniciAd,kullaniciSoyad:kullaniciSoyad,cinsiyet:cinsiyet,birtday:birtday,email:email,password:password,tel:tel,type:"Admin",img:img,id:res.user.uid, boy:null, kilo:null, yag:null, kas:null, kütleIndex:null, hedefler:null ,disable:false});
                
            }

            }
        catch(err)
        {
            console.log(err);
        }
    }
    function handleClick ( )
    {
        inputRef.current.click();
    }
    async function handelFile  (e) 
    {
       const fileObj = e.target.files && e.target.files[0];
       imgFileChange(fileObj);
   if (!fileObj) {
     return;
   }
   imgChange("");
   const storage = getStorage();
   const imageName = new Date().getTime() + fileObj.name;
   const storageRef = ref(storage, imageName);
   const uploadTask = uploadBytesResumable(storageRef,fileObj);
   uploadTask.on('state_changed',(snapshot) => {
       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       console.log('Upload is ' + progress + '% done');
       if(progress < 100)
       {
         buttonDisableChange(true);
       }
       
     }, 
     (error) => {
       console.log("storage errrorrr",error);
     }, 
     () => {
       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
           imgChange(downloadURL);
                           buttonDisableChange(false);
         console.log("image url", downloadURL);
       });
     }
   );
   }
   const getImg = (file) => {
        if(img === "https://cdn-icons-png.flaticon.com/512/149/149071.png") 
        {
           return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }
        else{
            return window.URL.createObjectURL(file);
        }

   }
    return <div className="container-fluid" style={{backgroundColor:"rgba(0,0,0,0.6)"}}>
            <div className="row ">
                <div className="col-11">
                    <h2 className=" text-center page-title" style={{color:"white"}}>KULLANICI KAYIT FORM</h2>
                </div>
                <div className="col-1">
                  <button style={{color:"white",backgroundColor:"transparent", border:"none"}} onClick={() => navigate("/kullanici/admin")}>X</button>
            </div>
            </div>
            <div className="row mt-2 mb-2 justify-content-center">
                <div className="col-6">
                    <div>
                        <img src={getImg(imgFile)} className="rounded-circle  align-self-end" style={{ width: "100px", height:"100px"}} />
                        <button className="btn btn-success btn-sm img-button "  onClick={(e) => handleClick(e)} >Image</button>
                      <input type="file" ref={inputRef} accept="image/*,.pdf" style={{display: "none"}} onChange={(e) => handelFile(e)} />

                    </div>
                </div>
            </div>
            <form>
                <div className="row mt-3 mb-2 justify-content-center">
                    <div className="col-6">
                        <label htmlFor="kullaniciIsmi" style={{color:"white"}}>Kullanici Ismi</label>
                        <input className="form-control" id="kullaniciIsmi" type="text" placeholder="Isim" value={kullaniciAd}
                            onChange={kullaniciAdChange}
                        />
                    </div>
                </div>
                <div className="row mt-3 mb-2 justify-content-center">
                    <div className="col-6">
                        <label htmlFor="kullaniciSoyismi" style={{color:"white"}}>Kullanici SoyIsmi</label>
                        <input className="form-control" id="kullaniciSoyismi" type="text" placeholder="Soyisim" value={kullaniciSoyad} onChange={kullaniciSoyadChange} />
                    </div>
                </div>
                <div className="row mt-3 mb-2 justify-content-center">
                    <div className="col-md-3">
                        <label htmlFor="kullaniciCinsiyet" style={{color:"white"}}>Cinsiyet</label>
                        <select className="form-select" id="kullaniciCinsiyet" value={cinsiyet} onChange={cinsiyetChange}>
                            <option value={"Other"}>Other</option>
                            <option value={"Erkek"}>Erkek</option>
                            <option value={"Kadın"}>Kadın</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="kullaniciBirtday" style={{color:"white"}}>Dogum Gunu</label>
                        <input className="form-control" id="kullaniciBirtday" type="date" value={birtday} onChange={
                            birtdayChange
                        } />
                    </div>
                </div>
                <div className="row mt-3 mb-2 justify-content-center">
                    <div className="col-6">
                        <label htmlFor="kullaniciEmail" style={{color:"white"}}>Email</label>
                        <input className="form-control" id="kullaniciEmail" type="email" placeholder="example@gmail.com" onChange={emailChange} value={email} />
                    </div>
                </div>
                <div className="row mt-3 mb-2 justify-content-center">
                    <div className="col-6">
                        <label htmlFor="kullaniciPassword" style={{color:"white"}}>Password</label>
                        <input className="form-control" id="kullaniciPassword" type="password" value={password} onChange={passwordChange} />
                    </div>
                </div>
                <div className="row mt-3 mb-2 justify-content-center">
                    <div className="col-md-3">
                        <label htmlFor="kullaniciType" style={{color:"white"}}>Type</label>
                        <select className="form-select" id="kullaniciType" value={kullaniciType} onChange={kullaniciTypeChange}>
                            <option value={"Danisman"}>Danisman</option>
                            <option value={"Antrenor"}>Antrenor</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                    <label htmlFor="kullaniciTel" style={{color:"white"}}>Telefon Numarasi</label>
                        <input className="form-control" id="kullaniciTel" type="tel" placeholder="xxx-xxx-xx-xx" onChange={telChange} value={tel} />
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-1 ">
                        <button disabled={buttonDisable}  className="btn btn-success mt-3" onClick={handelSignIn}>Ekle</button>
                    </div>
                </div>

            </form>
        </div>
}