import "../styles/EntryPage.css";
import React, { useRef, useState, useParams } from "react";
import { doc, setDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { db , auth } from "../firebase/firebaseInit";
import InputState from "../InputState";
import "../styles/LoginPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getStorage,uploadBytesResumable,ref,getDownloadURL } from "firebase/storage";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from '@mui/x-charts/BarChart';
export default function DanismanInfoPage(props) {
    const navigate = useNavigate();
    const danismanData = useLocation().state;
    const  isReadOnly  = props.isReadOnly;
    console.log("isReadyOnly ==> ", isReadOnly)
    console.log("danisman data => ", danismanData)
    const currentDanismanDatas = { ...danismanData }
    console.log("currentDanismanDatas ==========>>>>>>>", currentDanismanDatas);
    const [email, emailChange, emailReset] = InputState(currentDanismanDatas.email);
    const [password, passwordChange, passwordReset] = InputState(currentDanismanDatas.password);
    const [cinsiyet, cinsiyetChange, cinsiyetReset] = InputState(currentDanismanDatas.cinsiyet);
    const [birtday, birtdayChange, birtdayReset] = InputState(currentDanismanDatas.birtday);
    const [kullaniciAd, kullaniciAdChange, kullaniciAdReset] = InputState(currentDanismanDatas.kullaniciAd);
    const [kullaniciSoyad, kullaniciSoyadChange, kullaniciSoyadReset] = InputState(currentDanismanDatas.kullaniciSoyad);
    const [tel, telChange, telReset] = InputState(currentDanismanDatas.tel);
    const [img, imgChange] = useState(currentDanismanDatas.img);
    const [imgFile,imgFileChange] = useState();
    const [buttonDisable,buttonDisableChange] = useState(false)
    const [kullaniciKilo, kullaniciKiloChange] = InputState(currentDanismanDatas.kilo === null ? "Bilgi Yok" : currentDanismanDatas.kilo[currentDanismanDatas.kilo.length-1] );
    const [kullaniciBoy, kullaniciBoyChange] = InputState(currentDanismanDatas.kilo === null ? "Bilgi Yok" : currentDanismanDatas.boy[currentDanismanDatas.boy.length-1]);
    const inputRef = useRef();
    let hedeflerName = ["Kilo Verme", "Kilo Alma", "Kilo Koruma", "Kas Kazanma"];
    const [hedeflerIsmi, hedeflerIsmiChange] = useState(currentDanismanDatas.kilo === null ? [] : currentDanismanDatas.hedefler);
    const [hedefler, hedeflerChange] = useState(() => {
        console.log("hedefler ismi ==> ==>", hedeflerIsmi)
        let newBooleArray = [];
        if(currentDanismanDatas.kilo === null)
        {
            newBooleArray = [false,false,false,false];
        }
        else
        {
            for (let i = 0; i < 4; i++) {
            let k = 0;
            for (let j = 0; j < hedeflerIsmi.length; j++) {
                if (hedeflerIsmi[j] === hedeflerName[i]) {
                    k++;
                }
            }
            if (k === 0) {
                newBooleArray.push(false);
            }
            else {
                newBooleArray.push(true);
            }
        }
        console.log(newBooleArray)}
        return newBooleArray;
    });
    const handleCheckBoxChange = (index) => {
        if(hedeflerIsmi.length < 1 || hedefler[index] === true)
        {let newArray = [];
        let newHedeflerIsimArray = [];
        for (let i = 0; i < 4; i++) {
          if (index === i) {
            newArray.push(!hedefler[i]);
          }
          else {
            newArray.push(hedefler[i]);
          }
        }
        hedeflerChange(newArray);
        for (let i = 0; i < 4; i++) {
          if (newArray[i] === true) {
            newHedeflerIsimArray.push(hedeflerName[i]);
          }
        }
        hedeflerIsmiChange(newHedeflerIsimArray);
        console.log(newHedeflerIsimArray);
        console.log(newArray);}
      }

    const handelSignIn = async e => {
        e.preventDefault();
        try {
            if(currentDanismanDatas.password !== password)
            {
              updatePassword(auth.currentUser, password).then(() => {
                  console.log("password is updated old password => ",currentDanismanDatas.password,"new password => ",password)
                }).catch((error) => {
                  console.log("password is not updated",error)
                });
            }
            const cDabismanData = {kullaniciAd:kullaniciAd,kullaniciSoyad:kullaniciSoyad, cinsiyet: cinsiyet, birtday: birtday, kilo: kullaniciKilo, boy: kullaniciBoy, email: email, password: password, tel: tel, img: img, hedefler: hedeflerIsmi,disable:currentDanismanDatas.disable,id:currentDanismanDatas.id,type:currentDanismanDatas.type,antrenorlar:currentDanismanDatas.antrenorlar,yag:currentDanismanDatas.yag[0],kütleIndex:currentDanismanDatas.kütleIndex[0],kas:currentDanismanDatas.kas[0]}
            await setDoc(doc(db, "Users", currentDanismanDatas.id), {...cDabismanData});
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
        if(img === currentDanismanDatas.img) 
        {
           return currentDanismanDatas.img;
        }
        else{
            return window.URL.createObjectURL(file);
        }

   }
    const handeleData = (datas) => {
        let data = [];
        if (datas.length !== 0) {
            for (let i = 0; i < datas.length; i++) {
                data.push(Number.parseInt(datas[i]));
            }
            return data;
        }
        return [0];
    }

    const handelDay = (datas) => {
        let day = [];
        if (datas.length !== 0) {
            for (let i = 0; i < datas.length; i++) {
                day.push(i + 1);
            }
            return day;
        }
        return [0];
    }

    return <div className="container-fluid " style={{ backgroundColor: "rgba(256,256,256,0.25)" }}>
        <div className="row ">
            <div className="col-11">
                <h4 className="text-center">BILGILER</h4>
            </div>
            <div className="col-1">
                <button style={{ color: "black", backgroundColor: "transparent", border: "none" }} onClick={() => navigate(-1)}>X</button>
            </div>
        </div>
        <div className="row">
            <div className="col-6 align-self-center">
                <form>
                    <div className="row">
                        <div className="col-6">
                            <div className="row justify-content-center">
                                <div className="col-8 ml-4 ">
                                <img src={getImg(imgFile)} className="rounded-circle  align-self-end" style={{ width: "100px", height: "100px" }} />
                           {!isReadOnly && <> <button className="btn btn-success btn-sm img-button " onClick={(e) =>{  
                                 e.preventDefault()
                                handleClick() }} >Image</button>
                            <input type="file" ref={inputRef} accept="image/*,.pdf" style={{ display: "none" }} onChange={(e) => {
                                e.preventDefault();
                                handelFile(e)
                            } } /> </>}
                                </div>
                            </div>
                            <div className="row mt-3 mb-2 justify-content-center">
                                <div className="col-md-6">
                                    <label htmlFor="kullaniciKilo" style={{ color: "black" }}>Kilo (kg)</label>
                                    <input readOnly={isReadOnly} className="form-control" id="kullaniciKilo" type="text" value={kullaniciKilo} onChange={
                                        kullaniciKiloChange
                                    } />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="kullaniciBoy" style={{ color: "black" }}>Boy (cm)</label>
                                    <input readOnly={isReadOnly} className="form-control" id="kullaniciBoy" type="text" value={kullaniciBoy} onChange={
                                        kullaniciBoyChange
                                    } />
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col" >
                                    <div className="form-check">
                                        <h5 className="display-5 " style={{ color: "black" }}>Hedefler</h5>
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault1" checked={hedefler[0]} onChange={() => {
                                            if (!isReadOnly) { handleCheckBoxChange(0) }
                                        }} />
                                        <label className="form-check-label" style={{ color: "black" }} htmlFor="flexCheckDefault1">
                                            Kilo Verme
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked2" checked={hedefler[1]} onChange={() => {
                                            if (!isReadOnly) { handleCheckBoxChange(1) }
                                        }} />
                                        <label className="form-check-label" style={{ color: "black" }} htmlFor="flexCheckChecked2">
                                            Kilo Alma
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault3" checked={hedefler[2]} onChange={() => {
                                            if (!isReadOnly) { handleCheckBoxChange(2) }
                                        }} />
                                        <label className="form-check-label" style={{ color: "black" }} htmlFor="flexCheckDefault3">
                                            Kilo koruma
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked4" checked={hedefler[3]} onChange={() => {
                                            if (!isReadOnly) { handleCheckBoxChange(3) }
                                        }} />
                                        <label className="form-check-label" style={{ color: "black" }} htmlFor="flexCheckChecked4">
                                            Kas Kazanımı
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row mt-3 mb-2 justify-content-center">
                                <div className="col">
                                    <label htmlFor="kullaniciIsmi" style={{ color: "black" }}>Kullanici Ismi</label>
                                    <input readOnly={isReadOnly} className="form-control" id="kullaniciIsmi" type="text" placeholder="Isim" value={kullaniciAd}
                                        onChange={kullaniciAdChange}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3 mb-2 justify-content-center">
                                <div className="col">
                                    <label htmlFor="kullaniciSoyismi" style={{ color: "black" }}>Kullanici SoyIsmi</label>
                                    <input readOnly={isReadOnly} className="form-control" id="kullaniciSoyismi" type="text" placeholder="Soyisim" value={kullaniciSoyad} onChange={kullaniciSoyadChange} />
                                </div>
                            </div>
                            <div className="row mt-3 mb-2 justify-content-center">
                                <div className="col-md-6">
                                    <label htmlFor="kullaniciCinsiyet" style={{ color: "black" }}>Cinsiyet</label>
                                    <select className="form-select" id="kullaniciCinsiyet" value={cinsiyet} 
                                    onChange={(value)=>{
                                         if(!isReadOnly)
                                        {cinsiyetChange(value)}
                                        }} >
                                        <option  value={"Other"} >Other</option>
                                        <option value={"Erkek"} >Erkek</option>
                                        <option value={"Kadın"} >Kadın</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="kullaniciBirtday" style={{ color: "black" }}>Dogum Gunu</label>
                                    <input readOnly={isReadOnly} className="form-control" id="kullaniciBirtday" type="date" value={birtday} onChange={
                                        birtdayChange
                                    } />
                                </div>
                            </div>
                            <div className="row mt-3 mb-2 justify-content-center">
                                <div className="col">
                                    <label htmlFor="kullaniciEmail" style={{ color: "black" }}>Email</label>
                                    <input readOnly={true} className="form-control" id="kullaniciEmail" type="email" placeholder="example@gmail.com" onChange={emailChange} value={email} />
                                </div>
                            </div>
                          {!isReadOnly  && <div className="row mt-3 mb-2 justify-content-center">
                                <div className="col">
                                    <label htmlFor="kullaniciPassword" style={{ color: "black" }}>Password</label>
                                    <input  className="form-control" id="kullaniciPassword" type="password" value={password} onChange={passwordChange} />
                                </div>
                            </div>}
                            <div className="row mt-3 mb-2 justify-content-center">
                                <div className="col">
                                    <label htmlFor="kullaniciTel" style={{ color: "black" }}>Telefon Numarasi</label>
                                    <input readOnly={isReadOnly} className="form-control" id="kullaniciTel" type="tel" placeholder="xxx-xxx-xx-xx" onChange={telChange} value={tel} />
                                </div>
                            </div>

                        </div>
                    </div>
                   {!isReadOnly  && <div className="row justify-content-center">
                        <div className="col-1 ">
                            <button disabled={buttonDisable} className="btn btn-success mt-2 " onClick={handelSignIn}>Guncelle</button>
                        </div>
                    </div>}
                </form>
            </div>
            <div className="col-6 p-1">
                <div className="row m-0">
                    <div className="col-6" style={{ boxSizing: "border-box" }}>
                        <h5 className="text-center">Kilo Ilerleme</h5>
                        {currentDanismanDatas.kilo !== null  && <BarChart
                            xAxis={[{ scaleType: 'band', data: ['kilo'] }]}
                            series={ currentDanismanDatas.kilo.map(b => { return { data: [b] } })}
                            width={320}
                            height={180}
                        />}
                         {currentDanismanDatas.kilo === null  && <BarChart
                            xAxis={[{ scaleType: 'band', data: ['kilo'] }]}
                            series={  [{data : [0]} ] }
                            width={320}
                            height={180}
                        />}
                    </div>
                    <div className="col-5 p-0" style={{ boxSizing: "border-box" }}>
                        <h5 className="text-center" >Kas Kütle Ilerleme</h5>
                       {currentDanismanDatas.kas !== null &&  <LineChart
                            xAxis={[{ data: handelDay(currentDanismanDatas.kas) }]}
                            series={[
                                {
                                    data: handeleData(currentDanismanDatas.kas),
                                },
                            ]}
                            width={320}
                            height={180}
                        />}
                        {currentDanismanDatas.kas === null &&  <LineChart
                            xAxis={[{ data: [1] }]}
                            series={[
                                {
                                    data: [0],
                                },
                            ]}
                            width={320}
                            height={180}
                        />}

                    </div>
                </div>
                <div className="row m-0">
                    <div className="col-6" style={{ boxSizing: "border-box" }}>
                        <h5 className="text-center" >Boy Ilerleme</h5>
                       {currentDanismanDatas.kilo !== null && <BarChart
                            xAxis={[{ scaleType: 'band', data: ['boy'] }]}
                            series={currentDanismanDatas.boy.map(b => { return { data: [b] } })}
                            width={320}
                            height={180}
                        />}
                        {currentDanismanDatas.kilo === null && <BarChart
                            xAxis={[{ scaleType: 'band', data: ['boy'] }]}
                            series={[{data:[0]}]}
                            width={320}
                            height={180}
                        />}
                    </div>
                    <div className="col-5 p-0" style={{ boxSizing: "border-box" }}>
                        <h5 className="text-center" >Kalori Ilerleme</h5>
                       {currentDanismanDatas.kilo !== null && <LineChart
                            xAxis={[{ data: handelDay(currentDanismanDatas.kalori) }]}
                            series={[
                                {
                                    data: handeleData(currentDanismanDatas.kalori),
                                },
                            ]}
                            width={320}
                            height={180}
                        />}
                         {currentDanismanDatas.kilo === null && <LineChart
                            xAxis={[{ data:[1]}]}
                            series={[
                                {
                                    data:[0],
                                },
                            ]}
                            width={320}
                            height={180}
                        />}
                    </div>
                </div>
                <div className="row m-0">
                    <div className="col-6" style={{ boxSizing: "border-box" }} >
                        <h5 className="text-center" >Yag Oranı Ilerleme</h5>
                        {currentDanismanDatas.kilo !== null && <BarChart
                            xAxis={[{ scaleType: 'band', data: ['yag'] }]}
                            series={currentDanismanDatas.yag.map(b => { return { data: [b] } })}
                            width={320}
                            height={180}
                        />}
                         {currentDanismanDatas.kilo === null && <BarChart
                            xAxis={[{ scaleType: 'band', data: ['yag'] }]}
                            series={[{data:[0]}]}
                            width={320}
                            height={180}
                        />}
                    </div>
                    <div className="col-5 p-0" style={{ boxSizing: "border-box" }}>
                        <h5 className="text-center">Kütle Indeks Ilerleme</h5>
                      {currentDanismanDatas.kilo !== null &&  <LineChart
                            xAxis={[{ data: handelDay(currentDanismanDatas.kütleIndex) }]}
                            series={[
                                {
                                    data: handeleData(currentDanismanDatas.kütleIndex),
                                },
                            ]}
                            width={320}
                            height={180}
                        />}
                         {currentDanismanDatas.kilo === null &&  <LineChart
                            xAxis={[{ data:[1]}]}
                            series={[
                                {
                                    data: [0],
                                },
                            ]}
                            width={320}
                            height={180}
                        />}
                    </div>
                </div>
            </div>
        </div>
    </div>

}