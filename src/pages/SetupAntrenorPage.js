import { db } from "../firebase/firebaseInit";
import { setDoc,doc } from "firebase/firestore";
import { useLocation, useNavigate} from "react-router-dom";
import InputState from "../InputState";
import entry3 from "../images/entry3.jpg";
import "../styles/EntryPage.css";
import React,{ useState} from "react";

export default function SetupAntrenorPage() {
   const navigate = useNavigate();
   const datas =useLocation().state;
   const [hedefler,hedeflerChange] = useState([false,false,false,false])
   let  hedeflerName = ["Kilo Verme","Kilo Alma","Kilo Koruma","Kas Kazanma"]; 
   const [hedeflerIsmi,hedeflerIsmiChange] = useState([]);
   const [deneyim,deneyimChange] = InputState("");
   const handelSetup =async e => {
        e.preventDefault();
         console.log("antrenorData id",datas);
        await setDoc(doc(db, "Users", datas.id), {...datas,disable: false,deneyim:deneyim,hedefler:hedeflerIsmi,id:datas.id});  
        let dbDatas = [];
        for(const dataName of hedeflerIsmi)
        { 
            console.log("dataName",dataName);
            const data = [[{"type":`${dataName}`,danismanlar:[]}]];
             dbDatas = [...dbDatas,...data]
         }
         await setDoc(doc(db,"AntrenorDanismanlari",datas.id),{...dbDatas})
        navigate("/kullanici/antrenor",{replace:true,state:{...datas,deneyim:deneyim,hedefler:hedeflerIsmi}}); 
    } 

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

    return <div className="body" style={{ background: `url(${entry3})`, backgroundRepeat: "no-repeat", backgroundSize: "100% 100%"}}>
    <div className="container-fluid " style={{backgroundColor:"rgba(0,0,0,0.6)" , height:"100%" , width:"100%" }}>
        <div className="row ">
            <div className="col">
                <h3 className=" text-center page-title "  style={{color:"white"}} >ANTRENOR UZMANLIK VE BILGI FORM</h3>
            </div>
        </div>
        <form>
           <div className="row justify-content-center">
                     <div className="col-6">
                     <label htmlFor="deneyim" className="form-label" style={{color:"white"}}>Deneyimler</label>
                     <textarea className="form-control" id="deneyim" rows="5" value={deneyim} onChange={deneyimChange}></textarea>
                     </div>
           </div> 
             <div className="row justify-content-center">
               <div className="col-6" >
               <div className="form-check">
               <h5 style={{color:"white"}}>Uzmanlık Alanları</h5>
  <input className="form-check-input"  type="checkbox" value={hedefler[0]} id="flexCheckDefault" checked={hedefler[0]} onChange={() => handleCheckBoxChange(0)}/>
  <label className="form-check-label" style={{color:"white"}} htmlFor="flexCheckDefault">
    Kilo Verme
  </label>
</div>
<div className="form-check">
  <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"  checked={hedefler[1]} onChange={() => handleCheckBoxChange(1)}/>
  <label className="form-check-label" style={{color:"white"}} htmlFor="flexCheckChecked">
   Kilo Alma
  </label>
</div>
<div className="form-check">
  <input className="form-check-input"  type="checkbox" value="" id="flexCheckDefault" checked={hedefler[2]} onChange={() => handleCheckBoxChange(2)}/>
  <label className="form-check-label" style={{color:"white"}} htmlFor="flexCheckDefault">
    Kilo koruma
  </label>
</div>
<div className="form-check">
  <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={hedefler[3]} onChange={() => handleCheckBoxChange(3)}/>
  <label className="form-check-label" style={{color:"white"}} htmlFor="flexCheckChecked">
    Kas Kazanımı
  </label>
</div>
               </div>
             </div>
            <div className="row justify-content-center">
                <div className="col-1 ">
                    <button className="btn btn-success mt-4" onClick={handelSetup}>Kayıt</button>
                </div>
            </div>

        </form>
    </div>
</div>
}