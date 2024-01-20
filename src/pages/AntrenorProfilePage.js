import "../styles/EntryPage.css";
import React, { useRef, useState } from "react";
import { doc, setDoc} from "firebase/firestore";
import { updateEmail,updatePassword } from "firebase/auth";
import { db, auth } from "../firebase/firebaseInit";
import { getStorage,uploadBytesResumable,ref,getDownloadURL } from "firebase/storage";
import InputState from "../InputState";
import "../styles/LoginPage.css";
import {useLocation, useNavigate } from "react-router-dom";
export default function AntrenorProfilePage() {
    const navigate = useNavigate();
    const currentAntrenorDatas = { ...useLocation().state }
    const [email, emailChange, emailReset] = InputState(currentAntrenorDatas.currentAntrenor.email);
    const [password, passwordChange, passwordReset] = InputState(currentAntrenorDatas.currentAntrenor.password);
    const [cinsiyet, cinsiyetChange, cinsiyetReset] = InputState(currentAntrenorDatas.currentAntrenor.cinsiyet);
    const [birtday, birtdayChange, birtdayReset] = InputState(currentAntrenorDatas.currentAntrenor.birtday);
    const [kullaniciAd, kullaniciAdChange, kullaniciAdReset] = InputState(currentAntrenorDatas.currentAntrenor.kullaniciAd);
    const [kullaniciSoyad, kullaniciSoyadChange, kullaniciSoyadReset] = InputState(currentAntrenorDatas.currentAntrenor.kullaniciSoyad);
    const [tel, telChange, telReset] = InputState(currentAntrenorDatas.currentAntrenor.tel);
    const [img, imgChange] = useState(currentAntrenorDatas.currentAntrenor.img);
    const [imgFile,imgFileChange] = useState();
    const [buttonDisable,buttonDisableChange] = useState(false)
    const [deneyim, deneyimChange] = InputState(currentAntrenorDatas.currentAntrenor.deneyim);
    let  hedeflerName = ["Kilo Verme","Kilo Alma","Kilo Koruma","Kas Kazanma"]; 
    const [hedeflerIsmi,hedeflerIsmiChange] = useState(currentAntrenorDatas.currentAntrenor.hedefler);
    const [hedefler,hedeflerChange] = useState(() => {
        let newBooleArray = [] ;
        for(let i =0 ; i<4 ; i++)
        {
            let k = 0;
              for(let j =0 ; j<hedeflerIsmi.length ; j++)
              {
                    if(hedeflerIsmi[j] === hedeflerName[i])
                     {
                         k++;
                     }
             }
             if(k === 0)
             {
                 newBooleArray.push(false);
             }
             else{
                  newBooleArray.push(true);
             }
        }
        console.log(newBooleArray)
        return newBooleArray;
});
    const inputRef = useRef();
    const handleCheckBoxChange = (index) => {
        let newArray = [];          
        let newHedeflerIsimArray = [];
        for(let i =0 ; i< 4 ; i++)
                  {
                       if(index === i)
                       {
                          newArray.push( !hedefler[i] ) ;
                       }
                       else{
                          newArray.push(hedefler[i] );
                       }
                  }
              hedeflerChange(newArray);    
          for(let i = 0 ; i<4 ;i++)
          {
                if(newArray[i] === true)
                {
                     newHedeflerIsimArray.push(hedeflerName[i]);
                }
          }
              hedeflerIsmiChange(newHedeflerIsimArray);
              console.log(newHedeflerIsimArray);
              console.log(newArray);
    } 

    const handelSignIn = async e => {
        e.preventDefault();
        console.log(currentAntrenorDatas.currentAntrenor);
        try {
            if(currentAntrenorDatas.currentAntrenor.password !== password)
            {
              updatePassword(auth.currentUser, password).then(() => {
                  console.log("password is updated old password => ",currentAntrenorDatas.currentAntrenor.password,"new password => ",password)
                }).catch((error) => {
                  console.log("password is not updated",error)
                });
            }

            await setDoc(doc(db, "Users", currentAntrenorDatas.currentAntrenor.id), {...currentAntrenorDatas.currentAntrenor,kullaniciAd: kullaniciAd, kullaniciSoyad: kullaniciSoyad, cinsiyet: cinsiyet, birtday: birtday,hedefler:hedeflerIsmi,deneyim: deneyim, email: email, password: password, tel: tel, img: img });
        }
        catch (err) {
            console.log(err);
        } 
    }
    function handleClick() {
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
        if(img === currentAntrenorDatas.currentAntrenor.img) 
        {
           return currentAntrenorDatas.currentAntrenor.img;
        }
        else{
            return window.URL.createObjectURL(file);
        }

   }
    return <div className="container-fluid " style={{ backgroundColor: "rgba(0,0,0,0.6)"}}>
        <div className="row ">
            <div className="col-11">
                <h3 className=" text-center page-title" style={{color:"white"}}>ANTRENOR PROFILE FORM</h3>
            </div>
            <div className="col-1">
                  <button style={{color:"white",backgroundColor:"transparent" ,border:"none"}} onClick={() => navigate("/kullanici/antrenor")}>X</button>
            </div> 
        </div>
        <form>
            <div className="row ">
                <div className="col-6">
                    <div className="row justify-content-center">
                        <div className="col-4 ml-4">
                            <img src={getImg(imgFile)} className="rounded-circle  align-self-end" style={{ width: "100px", height: "100px" }} />
                            <button className="btn btn-success btn-sm img-button " onClick={(e) =>{  
                                 e.preventDefault()
                                handleClick() }} >Image</button>
                            <input type="file" ref={inputRef} accept="image/*,.pdf" style={{ display: "none" }} onChange={(e) => {
                                e.preventDefault();
                                handelFile(e)
                            } } />
                        </div>
                    </div>
                    <div className="row mt-3 mb-2 justify-content-center">
                        <div className="col">
                            <label htmlFor="deneyim" className="form-label" style={{ color: "white" }}>Deneyimler</label>
                            <textarea className="form-control" id="deneyim" rows="5" value={deneyim} onChange={deneyimChange}></textarea>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col" >
                            <div className="form-check">
                                <h5 className="display-5 " style={{ color: "white" }}>Uzmanlık Alanları</h5>
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault1" checked={hedefler[0]} onChange={() => handleCheckBoxChange(0)}/>
                                <label className="form-check-label" style={{ color: "white" }} htmlFor="flexCheckDefault1">
                                    Kilo Verme
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked2" checked={hedefler[1]} onChange={() => handleCheckBoxChange(1)}/>
                                <label className="form-check-label" style={{ color: "white" }} htmlFor="flexCheckChecked2">
                                    Kilo Alma
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault3" checked={hedefler[2]} onChange={() => handleCheckBoxChange(2)}/>
                                <label className="form-check-label" style={{ color: "white" }} htmlFor="flexCheckDefault3">
                                    Kilo koruma
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked4" checked={hedefler[3]} onChange={() => handleCheckBoxChange(3)}/>
                                <label className="form-check-label" style={{ color: "white" }} htmlFor="flexCheckChecked4">
                                    Kas Kazanımı
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 ">
                    <div className="row mt-3 mb-2 justify-content-center">
                        <div className="col">
                            <label htmlFor="kullaniciIsmi" style={{ color: "white" }}>Kullanici Ismi</label>
                            <input className="form-control" id="kullaniciIsmi" type="text" placeholder="Isim" value={kullaniciAd}
                                onChange={kullaniciAdChange}
                            />
                        </div>
                    </div>
                    <div className="row mt-3 mb-2 justify-content-center">
                        <div className="col">
                            <label htmlFor="kullaniciSoyismi" style={{ color: "white" }}>Kullanici SoyIsmi</label>
                            <input className="form-control" id="kullaniciSoyismi" type="text" placeholder="Soyisim" value={kullaniciSoyad} onChange={kullaniciSoyadChange} />
                        </div>
                    </div>
                    <div className="row mt-3 mb-2 justify-content-center">
                        <div className="col-md-6">
                            <label htmlFor="kullaniciCinsiyet" style={{ color: "white" }}>Cinsiyet</label>
                            <select className="form-select" id="kullaniciCinsiyet" value={cinsiyet} onChange={cinsiyetChange}>
                                <option value={"Other"} >Other</option>
                                <option value={"Erkek"} >Erkek</option>
                                <option value={"Kadın"} >Kadın</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="kullaniciBirtday" style={{ color: "white" }}>Dogum Gunu</label>
                            <input className="form-control" id="kullaniciBirtday" type="date" value={birtday} onChange={
                                birtdayChange
                            } />
                        </div>
                    </div>
                    <div className="row mt-3 mb-2 justify-content-center">
                        <div className="col">
                            <label htmlFor="kullaniciEmail" style={{ color: "white" }}>Email</label>
                            <input readOnly={true} className="form-control" id="kullaniciEmail" type="email" placeholder="example@gmail.com" onChange={emailChange} value={email} />
                        </div>
                    </div>
                    <div className="row mt-3 mb-2 justify-content-center">
                        <div className="col">
                            <label htmlFor="kullaniciPassword" style={{ color: "white" }}>Password</label>
                            <input  className="form-control" id="kullaniciPassword" type="password" value={password} onChange={passwordChange} />
                        </div>
                    </div>
                    <div className="row mt-3 mb-2 justify-content-center">
                        <div className="col">
                            <label htmlFor="kullaniciTel" style={{ color: "white" }}>Telefon Numarasi</label>
                            <input className="form-control" id="kullaniciTel" type="tel" placeholder="xxx-xxx-xx-xx" onChange={telChange} value={tel} />
                        </div>
                    </div>

                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-1 ">
                    <button className="btn btn-success mt-4 " disabled={buttonDisable} onClick={handelSignIn}>Guncelle</button>
                </div>
            </div>
        </form>
    </div>



}


