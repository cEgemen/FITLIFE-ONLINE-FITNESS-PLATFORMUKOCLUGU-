import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope,faCommentDots } from '@fortawesome/free-solid-svg-icons'
import entry4 from "../images/entry4.jpg"
import "../styles/EntryPage.css"
import React,{useEffect,useContext, useState} from "react";
import { CurrentUserContext } from "../context/AuthContext";
import { doc ,setDoc , getDoc} from "firebase/firestore";
import {db,auth} from "../firebase/firebaseInit";
import { signOut } from "firebase/auth";
import InputState from "../InputState";
import { IlerlemeContext } from "../context/IlerlemeContext";


export default function DanismanPageNavBar(/* props */) {
    const navigate = useNavigate()
    const location = useLocation();
    const {state,dispatch} = useContext(CurrentUserContext);
    const ilerleme = useContext(IlerlemeContext);
    const [danismanDatas,danismanDatasChange] = useState({});
    const [kilo,kiloChange] = InputState("0");
    const [boy,boyChange] = InputState("0");
    const [yag,yagChange] = InputState("0");
    const [kalori,kaloriChange] = InputState("0");
    const [kullanicilarEgzersizProgramlar, kullaniciEgzersizProgramlarChange] = useState([{beslenmeProgram:{},egzersizProgram:[]}]);
    const [messageState , messageStateChange] = useState(true)
    console.log("danisman nav page build state","location.state = ",state,"location.state = ",location.state)
    console.log("kullanicilarEgzersizProgramlar[0].egzersizProgram.length = ",kullanicilarEgzersizProgramlar[0].egzersizProgram.length)
    console.log("kilo = ",kilo,"yag = ",yag,"kilo === '' = ",kilo === "")
    console.log("boy =",boy,"kalori = ",kalori)
    useEffect(() => {
        console.log("danisman page nav bar useEffect calıstı")  
        console.log("danisman ::",location);
        console.log("ilerleme ::",ilerleme);
        const getProgramlar =async () => {
          let egzersizDatas = [];
          let dt ;
          const docRef2 = doc(db, "Users",state.user.id);
          const docSnap2 = await getDoc(docRef2);
          console.log("docSnap2.data()", docSnap2.data())
          if (docSnap2.exists()) {
             dt = docSnap2.data();
          }
          else {
            console.log("No such document!");          
          }  
          const docRef = doc(db, "DanismanProgramlar",state.user.id);
          const docSnap = await getDoc(docRef);
          console.log("docSnap.data().egzersiz", docSnap.data().egzersizProgram)
          if (docSnap.exists()) {
             egzersizDatas.push(docSnap.data());
          }
          else {
            console.log("No such document!");          
          }  
      console.log("egzersiz datas => ",egzersizDatas);
      console.log("danisman data => ",dt);
       kullaniciEgzersizProgramlarChange(egzersizDatas)
       danismanDatasChange(dt)

        }  
        messageStateChange(true);
          getProgramlar();
      },[])
    const handelIlerleme =async () => {
      console.log("danismanData id", state.user.id);
      const k = kilo === "0" || kilo === "" ? +ilerleme.ilerleme.kilo[ilerleme.ilerleme.kilo.length-1] : +kilo ;
      console.log("kilo", k);
      const b = boy === "0" || boy === "" ? +ilerleme.ilerleme.boy[ilerleme.ilerleme.boy.length-1]: +boy ;
      console.log("boy", b);
      const y = yag === "0" || yag === "" ? +ilerleme.ilerleme.yag[ilerleme.ilerleme.yag.length-1] : +yag;
      const klr = kalori === "0" || kalori === "" ? 0 : +kalori ;
      const kütleIndex = +(((k) / (b * b)) * 10000).toFixed(2);
      console.log("kütleIndex", kütleIndex);
      const kas = k * (1 - (y / 100));
      console.log("kas kütle", kas);
      await setDoc(doc(db,"DanismanIlerleme", state.user.id), { boy: [...ilerleme.ilerleme.boy,b], kilo: [...ilerleme.ilerleme.kilo,k], yag: [...ilerleme.ilerleme.yag,y], kas: [...ilerleme.ilerleme.kas,kas], kütleIndex: [...ilerleme.ilerleme.kütleIndex,kütleIndex], kalori: [...ilerleme.ilerleme.kalori,klr] });
      ilerleme.ilerlemeChange({ boy: [...ilerleme.ilerleme.boy,b], kilo: [...ilerleme.ilerleme.kilo,k], yag: [...ilerleme.ilerleme.yag,y], kas: [...ilerleme.ilerleme.kas,kas], kütleIndex: [...ilerleme.ilerleme.kütleIndex,kütleIndex], kalori: [...ilerleme.ilerleme.kalori,klr] }); 
    }   
    const handelRoute = name =>{
          console.log(location.pathname)
          switch(name)
          {
            case "profile":
              messageStateChange(false);
                const path =`${location.pathname}`+"/"+name;
                console.log("currentDanisman data ===> ",danismanDatas)
            return  navigate(path , { replace: true, state: { currentDanisman: {...danismanDatas} } });
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
            case "antrenorler":
              messageStateChange(false);
              return navigate("/kullanici/danisman/antrenorler",{replace : true, state : {currentDanisman: {...danismanDatas}}})
            default:
            return ;
          }
     }
      
     function handelMessage(id,otherId)
     {
      console.log("other person id => ",otherId)
      if(otherId === undefined)
      {
       navigate("/kullanici/message",{state:{id:id,otherId:-1}}) 
      }
      else{
       navigate("/kullanici/message",{state:{id:id,otherId:otherId}}) 
      }
     }
     async function handelPlanlar(planName,data,index){
      console.log("kullanici[i].programlar => ",kullanicilarEgzersizProgramlar[0]);
      if(planName === "beslenme")
      {
       console.log("kullanici[0].beslenmeProgram => ",kullanicilarEgzersizProgramlar[0].beslenmeProgram);
       let isReadyData = true;
       let docData =kullanicilarEgzersizProgramlar[0].beslenmeProgram;            
           if(kullanicilarEgzersizProgramlar[0].beslenmeProgram.hedef === undefined)
           {
             isReadyData = false;
             docData = { beslenmeProgram: { hedef: "", kahvalti: "", ara1: "", ogle: "", ara2: "", aksam: "", ara3: "", extra: "", kalori: "" } }
             console.log("beslenmeProgram.hedef is undefined")
           }
           navigate("/kullanici/danismanBeslenme", { state: { danismanData: data, programlar: [{beslenmeProgram:docData}], isReadOnly:true, isReadyData: isReadyData } })
         }
         else{
           console.log("kullanici[0].egzersizProgram => ",kullanicilarEgzersizProgramlar[0].egzersizProgram);
           console.log("kullanici[0].egzersizProgram.length => ",kullanicilarEgzersizProgramlar[0].egzersizProgram.length);
           console.log("kullanicilarEgzersizProgramlar[0].egzersizProgram[0].hedef => ",kullanicilarEgzersizProgramlar[0].egzersizProgram[0].hedef);
           let isReadyData = true;
           let docData =kullanicilarEgzersizProgramlar[0].egzersizProgram[index];  
           if (kullanicilarEgzersizProgramlar[0].egzersizProgram[0].hedef === undefined) {
             isReadyData = false;
             docData={hedef:"",baslangıcData:"",bitisDate:"",pazartesi:{},sali:{},carsamba:{},persembe:{},cuma:{},cumartesi:{},pazar:{}};
             navigate("/kullanici/danismanEgzersiz", { state: { danismanData: data, programlar: [{egzersizProgram:docData}], isReadOnly: true, isReadyData: isReadyData,index:index} })
           }
           else {
             console.log("egzersizProgram:kullanicilarEgzersizProgramlar[i].egzersizProgram[index] => ",{egzersizProgram:kullanicilarEgzersizProgramlar[0].egzersizProgram[index]} )
             navigate("/kullanici/danismanEgzersiz", { state: { danismanData: data, programlar: [{egzersizProgram:kullanicilarEgzersizProgramlar[0].egzersizProgram[index]}], isReadOnly:true, isReadyData: isReadyData,index:index } })
           }
 
         }
     }   
  
    
     return <div className="body" style={{background:`url(${entry4})` , backgroundRepeat:"no-repeat" , backgroundSize:"100% 100%"}}>
              {(messageState || location.state.messageState) && <button className="btn btn-outline-success" style={{border:"none",backgroundColor:"transparent",position:"fixed" , bottom:"10px" , right:"10px"}} onClick={() => {handelMessage(danismanDatas.id,danismanDatas.antrenorlar[0])}}>{<FontAwesomeIcon icon={faCommentDots} size="2xl" />}</button>}
    <div className="modal fade "  id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Gunluk Ilerleme Kayıt</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="kilo" className="col-form-label">Yeni Kilo (kg)</label>
            <input type="text" className="form-control" id="kilo" value={kilo} onChange={kiloChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="boy" className="col-form-label">Yeni Boy (cm)</label>
            <input type="text" className="form-control" id="boy" value={boy} onChange={boyChange}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="yag" className="col-form-label">Yeni Vücüt Yag Oranı (%)</label>
            <input className="form-control" id="yag" type="text" value={yag} onChange={yagChange}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="kalori" className="col-form-label">Yakılan Kalaori</label>
            <input type="text" className="form-control" id="kalori" value={kalori} onChange={kaloriChange}></input>
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={handelIlerleme}>Kaydet</button>
      </div>
    </div>
  </div>
</div>
                   
<div className="modal fade" id="staticExe" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticExe" aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="staticExe">Egzersiz Programları</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Egzersiz Programını Seciniz
                  </div>
                  <div className="modal-footer justify-content-center">
                         {kullanicilarEgzersizProgramlar[0].egzersizProgram.map((d,index) => {return <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelPlanlar("egzersiz",danismanDatas,index)}>{index+1}. Egzersiz Program</button>})}
                  </div> 
                </div>
              </div>
            </div>


               <div className="container-fluid ">
                <div className="row border-bottom border-dark bg-body-secondary bg-opacity-75" style={{backgroundColor:"transparent"}}>
                    <div className="col">
                    <ul className="nav justify-content-end">
  <li className="nav-item">
  <button className="btn btn btn-outline-secondary btn-sm m-1"  data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">Ilerleme Kayıt</button>
  </li>
  <li className="nav-item ">
  <button type="button" class="btn btn btn-outline-secondary btn-sm m-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  Programlar
</button>
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Programlar</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Gormek Istediginiz Programı Seciniz
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => {handelPlanlar("beslenme",danismanDatas,0)}}>Beslenme Programı</button>
      {kullanicilarEgzersizProgramlar[0].egzersizProgram.length !== 0 && <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#staticExe" >Egzersiz Programı</button>}
    {kullanicilarEgzersizProgramlar[0].egzersizProgram.length === 0 &&  <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={(e) => {
                             e.preventDefault();
                            handelPlanlar("egzersiz",danismanDatas,0)
                    }}>Egzersiz Programı</button>}
           
      </div>
    </div>
  </div>
</div>
  </li>
  <li className="nav-item ">
    <button className="btn btn btn-outline-secondary btn-sm m-1" onClick={() => {handelRoute("antrenorler")}}>Antrenorler</button>
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
               <Outlet ></Outlet>
            {/* {props.children} */}
    </div>
  

 

}

<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">Open modal for @getbootstrap</button>




