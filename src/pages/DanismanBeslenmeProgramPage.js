import { useState } from "react";
import { doc,setDoc,getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import InputState from "../InputState";
import { useLocation, useNavigate } from "react-router-dom"
import note from "../images/note.jpg";
import "../styles/EntryPage.css"
export default function DanismanBeslenmeProgramPage(props)
{
    const navigate = useNavigate();
     const navState = useLocation().state;
    console.log("navState => ",navState);
    console.log("navState.programlar[0] => ",navState.programlar[0]);
    console.log("navState.programlar[0].beslenmeProgram => ",navState.programlar[0].beslenmeProgram);
    console.log("navState.danismanData => ",navState.danismanData);
    const [data,dataChange] = useState([])
     const [lock,lockChange] = useState(false);
     const [dataLoad,dataLoadChange] = useState(true)
     const [hedef,hedefChange] = InputState(navState.programlar[0].beslenmeProgram.hedef);
     const [kahvalti,kahvaltiChange] = InputState(navState.programlar[0].beslenmeProgram.kahvalti);
     const [ara1,ara1Change] = InputState(navState.programlar[0].beslenmeProgram.ara1);
     const [ogle,ogleChange] = InputState(navState.programlar[0].beslenmeProgram.ogle);
     const [ara2,ara2Change] = InputState(navState.programlar[0].beslenmeProgram.ara2);
     const [aksam,aksamChange] = InputState(navState.programlar[0].beslenmeProgram.aksam);
     const [ara3,ara3Change] = InputState(navState.programlar[0].beslenmeProgram.ara3);
     const [extra,extraChange] = InputState(navState.programlar[0].beslenmeProgram.extra);
     const [kalori,kaloriChange] = InputState(navState.programlar[0].beslenmeProgram.kalori);

     const  handelAdd =async () => {
         let programData = {};     
            programData = {hedef:hedef,kahvalti:kahvalti,ara1:ara1,ogle:ogle,ara2:ara2,aksam:aksam,ara3:ara3,extra:extra, kalori:kalori};
            console.log("beslenmeProgram:programData => ",programData);
            console.log("egzersizProgram:data[0].egzersizProgram => ",data[0].egzersizProgram);
            console.log("navState.danismanData.id => ",navState.danismanData.id);

            await setDoc(doc(db,"DanismanProgramlar",navState.danismanData.id),{beslenmeProgram:programData,egzersizProgram:data[0].egzersizProgram}); 
     }
     
     console.log("danisman programlar => " ,data)
     console.log("navState.isReadOnly => " ,navState.isReadOnly)
     console.log("navState.isReadyData => " ,navState.isReadyData)
      if(navState.isReadOnly === true && navState.isReadyData === false)  
     {
             return <div className="body" style={{background:`url(${note})` , backgroundRepeat:"no-repeat" , backgroundSize:"100% 100%"}}>
             <div className='container-fluid '>
             <div className='row justify-content-end'>
          <div className='col-1' style={{marginTop:"2%"}}>
            <button style={{color:"white" , border:"none" , backgroundColor:"transparent"}}  onClick={() => {navigate(-1)}}>X</button>
          </div>
        </div>
        <div className='row justify-content-center'>
          <div className='col-6  text-center' style={{marginTop:"18%"}}>
            <h4 style={{ display: "inline", color: "white" }}>AKTİF BESLENME PROGRAMINIZ BULUNMAMAKTADIR</h4>
          </div>
        </div>
      </div>
        </div>
     }
     else
       {
         const handelInit = async () => {
            dataLoadChange(true)
            const docRef2 = doc(db, "DanismanProgramlar",navState.danismanData.id);
            const docSnap2 = await getDoc(docRef2);
        if(docSnap2.exists())
        {
           dataChange([docSnap2.data()])
        }
        else {
          console.log("No such document!");
        }      
            dataLoadChange(false)
     }
        if(!lock)
        {
            handelInit();
            lockChange(!lock);
        }
   
     if(dataLoad)
      {
        return <div className="body" style={{background:`url(${note})` , backgroundRepeat:"no-repeat" , backgroundSize:"100% 100%"}}>
             <div className='container-fluid ' style={{backgroundColor:"rgba(0,0,0,0.3)"}}>
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
        </div>
      }
         else
      {
     return <div className="body" style={{background:`url(${note})` , backgroundRepeat:"no-repeat" , backgroundSize:"100% 100%"}}>
           <div className="container-fluid" style={{backgroundColor:"rgba(0,0,0,0.2)"}}>
                               <div className="row justify-content-center">
                                       <div className="col-11">
                                                <h4 className="text-center text-white ">BESLENME PROGRAMI</h4>
                                       </div>
                                       <div className="col-1">
                                                <button className="text-white" style={{border:"none" , backgroundColor:"transparent"}} onClick={()=>{navigate(-1)}}>X</button>
                                       </div>
                               </div>  
                            <form>
                               <div className="row justify-content-center mt-2">
                                       <div className="col-6">
                                           <div>
                                         
                      <label htmlFor="hedef" style={{ color: "white" }}>Hedef</label>
                      <input readOnly={navState.isReadOnly} className="form-control" id="hedef" type="text" value={hedef} onChange={hedefChange}/>
                                          
                                           </div>   
                                       </div>
                               </div> 
                      
                               <div className="row justify-content-center m-4">
                                     
                                     <div className="col-3">
                                     <label htmlFor="kahvaltı" className="form-label" style={{color:"white"}}>Kahvaltı</label>
                                      <textarea readOnly={navState.isReadOnly} className="form-control" id="kahvaltı" rows="5" value={kahvalti} onChange={kahvaltiChange}></textarea>

                                      <label htmlFor="ara1" className="form-label" style={{color:"white"}}>1. Ara Ogun</label>
                                         <textarea readOnly={navState.isReadOnly} className="form-control" id="ara1" rows="5" value={ara1} onChange={ara1Change}></textarea>

                                     </div>
     
                                     
                                     <div className="col-3">
                                     <label htmlFor="ogle" className="form-label" style={{color:"white"}}>Ogle</label>
                                      <textarea readOnly={navState.isReadOnly} className="form-control" id="ogle" rows="5" value={ogle} onChange={ogleChange}></textarea>

                                      <label htmlFor="ara2" className="form-label" style={{color:"white"}}>2. Ara Ogun</label>
                                         <textarea readOnly={navState.isReadOnly}  className="form-control" id="ara2" rows="5" value={ara2} onChange= {ara2Change}></textarea>

                                     </div>
                           
                                     
                                        <div className="col-3">
                                        <label htmlFor="aksam" className="form-label" style={{color:"white"}}>Aksam</label>
                                         <textarea readOnly={navState.isReadOnly} className="form-control" id="aksam" rows="5" value={aksam} onChange={aksamChange}></textarea>

                                         <label htmlFor="ara3" className="form-label" style={{color:"white"}}>3. Ara Ogun</label>
                                         <textarea readOnly={navState.isReadOnly} className="form-control" id="ara3" rows="5" value={ara3} onChange={ara3Change}></textarea>

                                        </div>
                                        <div className="col-3">
                                        <label htmlFor="extra" className="form-label" style={{color:"white"}}>Extra Uyulacaklar</label>
                                         <textarea readOnly={navState.isReadOnly} className="form-control" id="extra" rows="12" value={extra} onChange={extraChange}></textarea>

                                        </div>
                               </div>
                                   <div className="row justify-content-center">
                                         <div className="col-6">
                                         <label htmlFor="kalori" style={{ color: "white" }}>Kalori Hedefi</label>
                                         <input readOnly={navState.isReadOnly} className="form-control" id="kalori" type="text" value={kalori} onChange={kaloriChange}/>
                                         </div>
                                   </div>
                            </form>    
                              {!navState.isReadOnly && <div className="row justify-content-center mt-4">
                                      <div className="col-1" >
                                            <button className="btn btn-success" onClick={() => {handelAdd()}}>Guncelle</button>
                                      </div>
                               </div>}
                    </div>      
                  

 </div>}}
}