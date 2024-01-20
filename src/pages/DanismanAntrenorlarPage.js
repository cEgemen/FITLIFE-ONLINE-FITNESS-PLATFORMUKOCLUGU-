import { useEffect,useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { db } from "../firebase/firebaseInit";
import { getDoc,doc } from "firebase/firestore";

export default function DanismanAntrenorPage(props){
   const navigate = useNavigate();
   const {currentDanisman} = useLocation().state;
   const [loading , loadingChange] = useState(true);
   const [lock  , lockChange] = useState(false)
   let antrenorInfoCardRow1= [];
   let antrenorInfoCardRow2= [];
   const [row1,row1Change] = useState([])
   const [row2,row2Change] = useState([])
   async function handelRoute(data)
   {         
    let danismanData = [];
    const   docRef2 = doc(db, "AntrenorDanismanlari",`${data.id}`);
    const   docSnap2 = await getDoc(docRef2);
   if(docSnap2.exists())
   {
      console.log("docSnap2 data => ",docSnap2.data())  
      for(const x in docSnap2.data())
      {
           for(const y of docSnap2.data()[x][0]["danismanlar"]) 
           {
            const   docRef = doc(db, "Users",`${y}`);
            const   docSnap = await getDoc(docRef);
            if(docSnap.exists)
            {
              danismanData.push({ad:docSnap.data().kullaniciAd,soyad:docSnap.data().kullaniciSoyad,img:docSnap.data().img});
            }
            else{
                console.log("errorrr")
            }
           }
      }
      navigate("/kullanici/danisman/antrenorler/bilgi",{state:{data:data,danismanlar:danismanData}}) 
   }
   else {
     console.log("No such document!");
   }     
    }
        const handelInit =async () => {
            loadingChange(true);
            let syc  = 1;     
            for(const antrenorId of currentDanisman["antrenorlar"])
                      {
                      console.log("useEffect for of calıstı") 
                      console.log("antrenor id ==> ",antrenorId);
                      const docRef2 = doc(db, "Users",`${antrenorId}`);
                      const  docSnap2 = await getDoc(docRef2); 
                      if(docSnap2.exists())
                       {
                       console.log("1",{...docSnap2.data()});
                       console.log("2",[{...docSnap2.data()}]); 
                       antrenorInfoCardRow1.push({...antrenorInfoCardRow1,...{...docSnap2.data()}});
                       console.log("1.1",antrenorInfoCardRow1);
                     
                       if(syc <= 3)
                       { 
                          
                        syc++;
                       }
                       else{
                        
                         syc++;
                       }
                       console.log("syc ==> ",syc)
                       }
                   else {
                     console.log("No such document!");
                   }
                      }
                      row1Change(antrenorInfoCardRow1);
                      row2Change(antrenorInfoCardRow2);
                      loadingChange(false);
              }
      if(!lock)
      {  
        handelInit();
        lockChange(!lock)
      }  
      console.log("row 1 data => ",row1);
      console.log("row 2 data => ",row2);
   if(loading === true)
    {
  return    <div className='container '>
  {<div className='row justify-content-center'>
    <div className='col-6 ' style={{ marginTop: "12%", marginLeft: "20%" }}>
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
     return <>
     <div className="container-fluid " style={{backgroundColor:"rgba(0,0,0,0.6)"}}>
          <div className="row ">
              <div className="col-11">
                <h3 className=" text-center page-title" style={{color:"white"}}>Danisman Antrenorler Page</h3>
              </div>
              <div className="col-1">
                  <button style={{color:"white",backgroundColor:"transparent", border:"none",marginTop:"10px"}} onClick={() => navigate("/kullanici/danisman",{state:{messageState:true}})}>X</button>
              </div> 
          </div>
         <div className="row justify-content-center" style={{marginTop:"30px"}}>
                 <div className="col-3 ml-5 mt-1">
               {1 === row1.length && <div className="card" style={{width:"250px" , height:"600px"}}>
  <img src={row1[0].img} className="card-img-top" alt="..." />
  <div className="card-body">
    <h5 className="card-title">Ad-Soyad: {row1[0].kullaniciAd} {row1[0].kullaniciSoyad}</h5>
    <p className="card-text"><b>Deneyim</b>: {row1[0].deneyim}</p>
    <h5>Uzmanlık Alanları</h5>
    <ul>
      {row1[0].hedefler.map((h) => { return <li>{h}</li> })}
    </ul>
    <button className="btn btn-info btn-sm " style={{display:"inline-block",marginLeft:"80px"}} onClick={() => {handelRoute(row1[0])}}>Bilgi</button>
  </div>
</div>}
                 </div>
         </div>
</div>
  </>
  }
}