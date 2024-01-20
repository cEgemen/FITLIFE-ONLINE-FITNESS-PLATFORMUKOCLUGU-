import { useState } from "react"
import { useNavigate,useLocation } from "react-router-dom"
import { db, } from "../firebase/firebaseInit"
import { getDoc,doc } from "firebase/firestore"

export default function AntrenorDanismanlarPage(){
 const antrenorDatas = { ...useLocation().state }
 const navigate = useNavigate()
 const [lock,lockChange] = useState(false)
 const [dataLoading,dataLoadingChange] = useState(true)
 const [danisanlarDataRow1,danisanlarDataRow1Change] = useState([]);
 const [danisanlarDataRow2,danisanlarDataRow2Change] = useState([]);
 const [kullanicilarEgzersizProgramlar, kullaniciEgzersizProgramlarChange] = useState([]);
 let danismanDataRow1 = [];
 let danismanDataRow2 = [];
 function handelRoute(name,data)
 {
        if(name === "bilgi")
        {
           navigate("/kullanici/antrenor/danismanlar/bilgi",{state:data})
        }
        else{
           navigate("/kullanici/antrenor/danismanlar/planlar",{state:data})
        }
 }
 
 async function handelPlanlar(planName,data,i,index)
 {
  console.log("kullanici[i].programlar => ",kullanicilarEgzersizProgramlar[i]);

       if(planName === "beslenme")
       {
        console.log("kullanici[i].beslenmeProgram => ",kullanicilarEgzersizProgramlar[i].beslenmeProgram);
        let isReadyData = true;
        let docData =kullanicilarEgzersizProgramlar[i].beslenmeProgram;            
            if(kullanicilarEgzersizProgramlar[i].beslenmeProgram.hedef === undefined)
            {
              isReadyData = false;
              docData = { beslenmeProgram: { hedef: "", kahvalti: "", ara1: "", ogle: "", ara2: "", aksam: "", ara3: "", extra: "", kalori: "" } }
              console.log("beslenmeProgram.hedef is undefined")
            }
            navigate("/kullanici/danismanBeslenme", { state: { danismanData: data, programlar: [{beslenmeProgram:docData}], isReadOnly: false, isReadyData: isReadyData } })
          }
          else{
            console.log("kullanici[i].egzersizProgram => ",kullanicilarEgzersizProgramlar[i].egzersizProgram);
            let isReadyData = true;
            let docData =kullanicilarEgzersizProgramlar[i].egzersizProgram[index];  
            if (kullanicilarEgzersizProgramlar[i].egzersizProgram.hedef === undefined) {
              isReadyData = false;
              docData={hedef:"",baslangıcData:"",bitisDate:"",pazartesi:[],sali:[],carsamba:[],persembe:[],cuma:[],cumartesi:[],pazar:[]};
              navigate("/kullanici/danismanEgzersiz", { state: { danismanData: data, programlar: [{egzersizProgram:docData}], isReadOnly: false, isReadyData: isReadyData,index:index} })
            }
            else {
              console.log("egzersizProgram:kullanicilarEgzersizProgramlar[i].egzersizProgram[index] => ",{egzersizProgram:kullanicilarEgzersizProgramlar[i].egzersizProgram[index]} )
              navigate("/kullanici/danismanEgzersiz", { state: { danismanData: data, programlar: [{egzersizProgram:kullanicilarEgzersizProgramlar[i].egzersizProgram[index]}], isReadOnly: false, isReadyData: isReadyData,index:index } })
            }
  
          }
 }

 function handelPlanEkle(name,data)
 {
     if(name === "beslenme")
     {
         navigate("/kullanici/beslenmeAdd",{state:{danismanData:data,type:"beslenme"}})
     }
     else{
         navigate("/kullanici/egzersizAdd",{state:{danismanData:data,type:"egzersiz"}})
     }
 }
 const handelInit =async () => {
  console.log("antrenorDatas <==> ",antrenorDatas)
   dataLoadingChange(true)
   let egzersizDatas= [];
  const docRef2 = doc(db, "AntrenorDanismanlari",`${antrenorDatas.currentAntrenor.id}`);
     const docSnap2 = await getDoc(docRef2);
  if(docSnap2.exists())
  {
    let syc = 1;     
    const cardData = docSnap2.data(); 
    console.log("cardData ===>>> ",cardData)
      for(const x in  cardData)
      {
        console.log("x",x);
        console.log("cardData",cardData)
        for(const y of cardData[x][0]["danismanlar"])
        {  
              const docRef  = doc(db,"Users",y);
                const docSnap = await getDoc(docRef);
                if(docSnap.exists())
                {  
                  const docRef4 = doc(db, "DanismanProgramlar",y);
                  const docSnap4 = await getDoc(docRef4);
                  console.log("docSnap4.data().egzersiz", docSnap4.data().egzersizProgram)
                  if (docSnap4.exists()) {
                     egzersizDatas.push(docSnap4.data());
                  }
                  else {
                    console.log("No such document!");          
                  }
                         console.log("danisman data => ",docSnap.data());
                        
                         const docRef3 = doc(db,"DanismanIlerleme",y);
                         const docSnap3 = await getDoc(docRef3);
                         if(docSnap3.exists())
                         {
                               if(syc <=3)
                               {
                                    danismanDataRow1.push({...docSnap.data(),...docSnap3.data()})
                               }
                               else
                               {
                                danismanDataRow2.push({...docSnap.data(),...docSnap3.data()})
                               }  
                         }
                         else{
                                console.log("No such document!");
                         }
                }
                else{
                        console.log("No such document!");
                } 

        }
      }
    }
  else {
    console.log("No such document!");
  } 
  danisanlarDataRow1Change(danismanDataRow1);
  danisanlarDataRow2Change(danismanDataRow2);
  kullaniciEgzersizProgramlarChange(egzersizDatas);
  dataLoadingChange(false) 
 }

 if(!lock)
 {
        handelInit();
        lockChange(!lock);
 }
     if(dataLoading)   
    {
        return  <div className='container-fluid ' style={{backgroundColor:"rgba(0,0,0,0.3)"}}>
        {<div className='row justify-content-center'>
          <div className='col-6 ' style={{ marginTop: "12%", marginLeft: "40%" , marginBottom:"36%"}}>
            <h4 style={{ display: "inline", color: "white" }}>LOADING</h4>
            <div className="spinner-grow spinner-grow-sm" style={{ color: "white" }} role="status">
              <span className="visually-hidden">LOADING...</span>
            </div>
            <div className="spinner-grow spinner-grow-sm " style={{ color: "white" }} role="status">
              <span className="visually-hidden">LOADING...</span>
            </div>
            <div className="spinner-grow spinner-grow-sm " style={{ color: "white" }} role="status">
              <span className="visually-hidden">LOADING...</span>
            </div>
          </div>
        </div>}
      </div>
    }
     else
       {
         return <div className="container-fluid" style={{backgroundColor:"rgba(0,0,0,0.6)"}}>
            <div className="row justify-content-conter">
                 <div className="col-11 text-center">
                         <h3 className="text-center text-white" >KAYITLI DANISMANLAR</h3>
                 </div>
                 <div className="col-1">
                      <button style={{color:"white" ,backgroundColor:"transparent", border:"none"}} onClick={() => {
                              navigate("/kullanici/antrenor")
                             }}>X</button>
                 </div>
            </div>
            <div className="row justify-content-around" style={{marginTop:"20px"}}>
  <div className="col-3">
   {1<=danisanlarDataRow1.length && <div className="card" style={{width:"250px" , height:"600px"}}>
      <img src={danisanlarDataRow1[0].img} className="card-img-top" alt="..." />
      <div className="card-body">
      <h5 className="card-title">Ad:{danisanlarDataRow1[0].kullaniciAd}</h5>
        <h5 className="card-title">Soyad:{danisanlarDataRow1[0].kullaniciSoyad}</h5>
        <h5 >Tel No: {danisanlarDataRow1[0].tel}</h5>
        <h5 >Hedefleri</h5>
        <ul>  
            {danisanlarDataRow1[0].hedefler.map((value,index) => {
                 return <li key={index}>{value}</li>
            })}    
        </ul>
    <div className="container border border-top-0 border-bottom-0 border-dark border-opacity-25 mt-5">    
    <button className="btn btn-info btn-sm " style={{display:"inline-block",marginRight:"20px",marginLeft:"30px"}} onClick={() => {handelRoute("bilgi",danisanlarDataRow1[0])}}>Bilgi</button>
    <button type="button" className="btn btn-warning btn-sm" style={{display:"inline-block"}} data-bs-toggle="modal" data-bs-target="#staticProgramModel4">
  Programlar
</button>
<div className="modal fade" id="staticProgramModel4" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel4" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel4">Programlar</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Gormek Istediginiz Programı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
        <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => {handelPlanlar("beslenme",danisanlarDataRow1[0],0,0)}}>Beslenme Programı</button>
        {kullanicilarEgzersizProgramlar[0].egzersizProgram.hedef !== undefined && <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target={`#staticExerciseModel`} >Egzersiz Programı</button>}
                    {kullanicilarEgzersizProgramlar[0].egzersizProgram.hedef === undefined &&  <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={(e) => {
                             e.preventDefault();
                            handelPlanlar("egzersiz",danisanlarDataRow1[0],0,0)
                    }}>Egzersiz Programı</button>}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id={`staticExerciseModel`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`staticExerciseModel`} aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id={`staticExerciseModel`}>Egzersiz Programları</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Egzersiz Programını Seciniz
                  </div>
                  <div className="modal-footer justify-content-center">
                         {kullanicilarEgzersizProgramlar[0].egzersizProgram.map((d,index) => {return <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelPlanlar("egzersiz",danisanlarDataRow1[0],0,index)}>{index+1}. Egzersiz Program</button>})}
                  </div> 
                </div>
              </div>
            </div>

<button type="button" className="btn btn-success btn-sm mt-2" style={{display:"inline-block",marginLeft:"55px"}} data-bs-toggle="modal" data-bs-target="#staticProgramEkleModel4">
  Program Ekle
</button>
<div className="modal fade" id="staticProgramEkleModel4" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticProgramEkleLabel4" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticProgramEkleLabel4">Programlar Ekle</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Eklemek Istediginiz Programı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
      <button className="btn btn-success btn-sm" data-bs-dismiss="modal" style={{display:"inline-block" , marginTop:"10px"}} onClick={() => {handelPlanEkle("beslenme",danisanlarDataRow1[0])}}>Yeni Beslenme Planlani Ekle </button>  
    <button className="btn btn-success btn-sm" data-bs-dismiss="modal" style={{display:"inline-block", marginTop:"10px"}} onClick={() => {handelPlanEkle("egzersiz",danisanlarDataRow1[0])}}>Yeni Egzersiz Planlani Ekle </button> 
      </div>
    </div>
  </div>
</div>

   </div>
      </div>
    </div>}
  </div>
  <div className="col-3">
     {3<=danisanlarDataRow1.length && <div className="card" style={{width:"250px" , height:"600px"}}>
      <img src={danisanlarDataRow1[2].img} className="card-img-top" alt="..." />
      <div className="card-body">
      <h5 className="card-title">Ad:{danisanlarDataRow1[2].kullaniciAd}</h5>
        <h5 className="card-title">Soyad:{danisanlarDataRow1[2].kullaniciSoyad}</h5>
        <h5 >Tel No: {danisanlarDataRow1[2].tel}</h5>
        <h5 >Hedefleri</h5>
        <ul>
            {danisanlarDataRow1[2].hedefler.map((value,index) => {
                 return <li key={index}>{value}</li>
            })}    
        </ul>
        <div className="container border border-top-0 border-bottom-0 border-dark border-opacity-25 mt-5">    
    <button className="btn btn-info btn-sm " style={{display:"inline-block",marginRight:"20px",marginLeft:"30px"}} onClick={() => {handelRoute("bilgi",danisanlarDataRow1[2])}}>Bilgi</button>
    <button type="button" className="btn btn-warning btn-sm" style={{display:"inline-block"}} data-bs-toggle="modal" data-bs-target="#staticProgramModel3">
  Programlar
</button>
<div className="modal fade" id="staticProgramModel3" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel3" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel3">Programlar</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Gormek Istediginiz Programı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
        <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => {handelPlanlar("beslenme",danisanlarDataRow1[2],2,0)}}>Beslenme Programı</button>
        {kullanicilarEgzersizProgramlar[2].egzersizProgram.hedef !== undefined && <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target={`#staticExerciseModel`} >Egzersiz Programı</button>}
                    {kullanicilarEgzersizProgramlar[2].egzersizProgram.hedef === undefined &&  <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={(e) => {
                             e.preventDefault();
                            handelPlanlar("egzersiz",danisanlarDataRow1[2],2,0)
                    }}>Egzersiz Programı</button>}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id={`staticExerciseModel`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`staticExerciseModel`} aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id={`staticExerciseModel`}>Egzersiz Programları</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Egzersiz Programını Seciniz
                  </div>
                  <div className="modal-footer justify-content-center">
                         {kullanicilarEgzersizProgramlar[2].egzersizProgram.map((d,index) => {return <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelPlanlar("egzersiz",danisanlarDataRow1[2],2,index)}>{index+1}. Egzersiz Program</button>})}
                  </div> 
                </div>
              </div>
            </div>

<button type="button" className="btn btn-success btn-sm mt-2" style={{display:"inline-block",marginLeft:"55px"}} data-bs-toggle="modal" data-bs-target="#staticProgramEkleModel3">
  Program Ekle
</button>
<div className="modal fade" id="staticProgramEkleModel3" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticProgramEkleLabel3" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticProgramEkleLabel3">Programlar Ekle</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Eklemek Istediginiz Programı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
      <button className="btn btn-success btn-sm" data-bs-dismiss="modal" style={{display:"inline-block" , marginTop:"10px"}} onClick={() => {handelPlanEkle("beslenme",danisanlarDataRow1[2])}}>Yeni Beslenme Planlani Ekle </button>  
    <button className="btn btn-success btn-sm" data-bs-dismiss="modal" style={{display:"inline-block", marginTop:"10px"}} onClick={() => {handelPlanEkle("egzersiz",danisanlarDataRow1[2])}}>Yeni Egzersiz Planlani Ekle </button>
      </div>
    </div>
  </div>
</div>

     </div>
      </div>
    </div>}
  </div>
  <div className="col-3">
  {2<=danisanlarDataRow1.length && <div className="card" style={{width:"250px" , height:"600px"}}>
      <img src={danisanlarDataRow1[1].img} className="card-img-top" alt="..." />
      <div className="card-body">
      <h5 className="card-title">Ad:{danisanlarDataRow1[1].kullaniciAd}</h5>
        <h5 className="card-title">Soyad:{danisanlarDataRow1[1].kullaniciSoyad}</h5>
        <h5 >Tel No: {danisanlarDataRow1[1].tel}</h5>
        <h5 >Hedefleri</h5>
        <ul>
            {danisanlarDataRow1[1].hedefler.map((value,index) => {
                 return <li key={index}>{value}</li>
            })}    
        </ul>
        <div className="container border border-top-0 border-bottom-0 border-dark border-opacity-25 mt-5">    
    <button className="btn btn-info btn-sm " style={{display:"inline-block",marginRight:"20px",marginLeft:"30px"}} onClick={() => {handelRoute("bilgi",danisanlarDataRow1[1])}}>Bilgi</button>
    <button type="button" className="btn btn-warning btn-sm" style={{display:"inline-block"}} data-bs-toggle="modal" data-bs-target="#staticProgramModel2">
  Programlar
</button>
<div className="modal fade" id="staticProgramModel2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel2" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel2">Programlar</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Gormek Istediginiz Programı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
        <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => {handelPlanlar("beslenme",danisanlarDataRow1[1],1,0)}}>Beslenme Programı</button>
        {kullanicilarEgzersizProgramlar[1].egzersizProgram.hedef !== undefined && <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target={`#staticExerciseModel`} >Egzersiz Programı</button>}
                    {kullanicilarEgzersizProgramlar[1].egzersizProgram.hedef === undefined &&  <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={(e) => {
                             e.preventDefault();
                            handelPlanlar("egzersiz",danisanlarDataRow1[1],1,0)
                    }}>Egzersiz Programı</button>}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id={`staticExerciseModel`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`staticExerciseModel`} aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id={`staticExerciseModel`}>Egzersiz Programları</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Egzersiz Programını Seciniz
                  </div>
                  <div className="modal-footer justify-content-center">
                         {kullanicilarEgzersizProgramlar[1].egzersizProgram.map((d,index) => {return <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelPlanlar("egzersiz",danisanlarDataRow1[1],1,index)}>{index+1}. Egzersiz Program</button>})}
                  </div> 
                </div>
              </div>
            </div>

<button type="button" className="btn btn-success btn-sm mt-2" style={{display:"inline-block",marginLeft:"55px"}} data-bs-toggle="modal" data-bs-target="#staticProgramEkleModel2">
  Program Ekle
</button>
<div className="modal fade" id="staticProgramEkleModel2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticProgramEkleLabel2" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticProgramEkleLabel2">Programlar Ekle</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Eklemek Istediginiz Programı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
      <button className="btn btn-success btn-sm" data-bs-dismiss="modal" style={{display:"inline-block" , marginTop:"10px"}} onClick={() => {handelPlanEkle("beslenme",danisanlarDataRow1[1])}}>Yeni Beslenme Planlani Ekle </button>  
    <button className="btn btn-success btn-sm" data-bs-dismiss="modal" style={{display:"inline-block", marginTop:"10px"}} onClick={() => {handelPlanEkle("egzersiz",danisanlarDataRow1[1])}}>Yeni Egzersiz Planlani Ekle </button>
      </div>
    </div>
  </div>
</div>

    </div> 
      </div>
    </div>}
  </div>
  </div>
  <div className="row justify-content-around" style={{marginTop:"20px"}}>
  <div className="col-3" >
  {1<=danisanlarDataRow2.length && <div className="card" style={{width:"250px" , height:"600px"}}>
      <img src={danisanlarDataRow2[0].img} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">Ad:{danisanlarDataRow2[0].kullaniciAd}</h5>
        <h5 className="card-title">Soyad:{danisanlarDataRow2[0].kullaniciSoyad}</h5>
        <h5 >Tel No: {danisanlarDataRow2[0].tel}</h5>
        <h5 >Hedefleri</h5>
        <ul>
            {danisanlarDataRow2[0].hedefler.map((value,index) => {
                 return <li key={index}>{value}</li>
            })}    
        </ul>
        <div className="container border border-top-0 border-bottom-0 border-dark border-opacity-25 mt-5">    
    <button className="btn btn-info btn-sm " style={{display:"inline-block",marginRight:"20px",marginLeft:"30px"}} onClick={() => {handelRoute("bilgi",danisanlarDataRow2[0])}}>Bilgi</button>
    <button type="button" className="btn btn-warning btn-sm" style={{display:"inline-block"}} data-bs-toggle="modal" data-bs-target="#staticProgramModel1">
  Programlar
</button>
<div className="modal fade" id="staticProgramModel1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel1" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel1">Programlar</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Gormek Istediginiz Programı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
        <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => {handelPlanlar("beslenme",danisanlarDataRow2[0],3,0)}}>Beslenme Programı</button>
        {kullanicilarEgzersizProgramlar[3].egzersizProgram.hedef !== undefined && <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target={`#staticExerciseModel`} >Egzersiz Programı</button>}
                    {kullanicilarEgzersizProgramlar[3].egzersizProgram.hedef === undefined &&  <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={(e) => {
                             e.preventDefault();
                            handelPlanlar("egzersiz",danisanlarDataRow2[0],3,0)
                    }}>Egzersiz Programı</button>}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id={`staticExerciseModel`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`staticExerciseModel`} aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id={`staticExerciseModel`}>Egzersiz Programları</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Egzersiz Programını Seciniz
                  </div>
                  <div className="modal-footer justify-content-center">
                         {kullanicilarEgzersizProgramlar[3].egzersizProgram.map((d,index) => {return <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelPlanlar("egzersiz",danisanlarDataRow2[0],3,index)}>{index+1}. Egzersiz Program</button>})}
                  </div> 
                </div>
              </div>
            </div>
  
<button type="button" className="btn btn-success btn-sm mt-2" style={{display:"inline-block",marginLeft:"55px"}} data-bs-toggle="modal" data-bs-target="#staticProgramEkleModel1">
  Program Ekle
</button>
<div className="modal fade" id="staticProgramEkleModel1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticProgramEkleLabel1" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticProgramEkleLabel1">Programlar Ekle</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Eklemek Istediginiz Programı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
      <button className="btn btn-success btn-sm" data-bs-dismiss="modal" style={{display:"inline-block" , marginTop:"10px"}} onClick={() => {handelPlanEkle("beslenme",danisanlarDataRow2[0])}}>Yeni Beslenme Planlani Ekle </button>  
    <button className="btn btn-success btn-sm" data-bs-dismiss="modal" style={{display:"inline-block", marginTop:"10px"}} onClick={() => {handelPlanEkle("egzersiz",danisanlarDataRow2[0])}}>Yeni Egzersiz Planlani Ekle </button> 
      </div>
    </div>
  </div>
</div>

    </div> 
      </div>
    </div>}
  </div>
  <div className="col-3">
  {2<=danisanlarDataRow2.length && <div className="card" style={{width:"250px" , height:"600px"}}>
      <img src={danisanlarDataRow2[1].img} className="card-img-top" alt="..." />
      <div className="card-body">
      <h5 className="card-title">Ad:{danisanlarDataRow2[1].kullaniciAd}</h5>
        <h5 className="card-title">Soyad:{danisanlarDataRow2[1].kullaniciSoyad}</h5>
        <h5 >Tel No: {danisanlarDataRow2[1].tel}</h5>
        <h5 >Hedefleri</h5>
        <ul>
            {danisanlarDataRow2[1].hedefler.map((value,index) => {
                 return <li key={index}>{value}</li>
            })}    
        </ul>
        <div className="container border border-top-0 border-bottom-0 border-dark border-opacity-25 mt-5">    
    <button className="btn btn-info btn-sm " style={{display:"inline-block",marginRight:"20px",marginLeft:"30px"}} onClick={() => {handelRoute("bilgi",danisanlarDataRow2[1])}}>Bilgi</button>
    <button type="button" className="btn btn-warning btn-sm" style={{display:"inline-block"}} data-bs-toggle="modal" data-bs-target="#staticProgramModel">
  Programlar
</button>
<div className="modal fade" id="staticProgramModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">Programlar</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Gormek Istediginiz Programı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
        <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => {handelPlanlar("beslenme",danisanlarDataRow2[1],4,0)}}>Beslenme Programı</button>
        {kullanicilarEgzersizProgramlar[4].egzersizProgram.hedef !== undefined && <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target={`#staticExerciseModel`} >Egzersiz Programı</button>}
                    {kullanicilarEgzersizProgramlar[4].egzersizProgram.hedef === undefined &&  <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={(e) => {
                             e.preventDefault();
                            handelPlanlar("egzersiz",danisanlarDataRow2[1],4,0)
                    }}>Egzersiz Programı</button>}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id={`staticExerciseModel`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`staticExerciseModel`} aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id={`staticExerciseModel`}>Egzersiz Programları</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Egzersiz Programını Seciniz
                  </div>
                  <div className="modal-footer justify-content-center">
                         {kullanicilarEgzersizProgramlar[4].egzersizProgram.map((d,index) => {return <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelPlanlar("egzersiz",danisanlarDataRow2[1],4,index)}>{index+1}. Egzersiz Program</button>})}
                  </div> 
                </div>
              </div>
            </div>

<button type="button" className="btn btn-success btn-sm mt-2" style={{display:"inline-block",marginLeft:"55px"}} data-bs-toggle="modal" data-bs-target="#staticProgramEkleModel">
  Program Ekle
</button>
<div className="modal fade" id="staticProgramEkleModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticProgramEkleLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticProgramEkleLabel">Programlar Ekle</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Eklemek Istediginiz Programı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
      <button className="btn btn-success btn-sm" data-bs-dismiss="modal" style={{display:"inline-block" , marginTop:"10px"}} onClick={() => {handelPlanEkle("beslenme",danisanlarDataRow2[1])}}>Beslenme Planlani</button>  
    <button className="btn btn-success btn-sm" data-bs-dismiss="modal" style={{display:"inline-block", marginTop:"10px"}} onClick={() => {handelPlanEkle("egzersiz",danisanlarDataRow2[1])}}> Egzersiz Planlani</button>
      </div>
    </div>
  </div>
</div>


     </div>
      </div>
    </div>}
  </div>
</div>
        </div>
       }

}