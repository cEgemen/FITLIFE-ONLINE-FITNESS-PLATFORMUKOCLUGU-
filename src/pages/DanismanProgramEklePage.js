import { useLocation, useNavigate } from "react-router-dom"
import note from "../images/note.jpg"
import "../styles/EntryPage.css"
import { useRef, useState } from "react";
import { doc,setDoc,getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import InputState from "../InputState";


export default function DanismanProgramEklePage(props)
{     
     const navigate = useNavigate();
     const navState = useLocation().state;
     console.log("navState => ",navState);
     const ref1 = useRef()
     const ref2 = useRef()
     const ref3 = useRef()
     const [hedef,hedefChange] = InputState(navState.danismanData.hedefler[0]);
     const [startDate,startDateChange] = InputState("");
     const [endDate,endDateChange] = InputState("");
     const [pazartesiData,pazartesiDataChange] = useState([]);
     const [saliData,saliDataChange] = useState([]);
     const [carsambaData,carsambaDataChange] = useState([]);
     const [persembeData,persembeDataChange] = useState([]);
     const [cumaData,cumaDataChange] = useState([]);
     const [cumartesiData,cumartesiDataChange] = useState([]);
     const [egzersiz,egzersizChange] = InputState("");
     const [setSayisi,setSayisiChange] = InputState("");
     const [tekrarSayisi,tekrarSayisiChange] = InputState("");
     const [active,activeChange] = useState();
     const [activeData,activeDataChange] = useState({type:"",data:{egzersiz:"",setSayisi:"",tekrarSayisi:""}});
     const [pazarData,pazarDataChange] = useState([]);
     const [kahvalti,kahvaltiChange] = InputState("");
     const [ara1,ara1Change] = InputState("");
     const [ogle,ogleChange] = InputState("");
     const [ara2,ara2Change] = InputState("");
     const [aksam,aksamChange] = InputState("");
     const [ara3,ara3Change] = InputState("");
     const [extra,extraChange] = InputState("");
     const [kalori,kaloriChange] = InputState("");
     const [lock,lockChange] = useState(false);
     const [data,dataChange] = useState([])
     const [dataLoad,dataLoadChange] = useState(true)
     console.log("danisman programlar => " ,data)
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
     const  handelAdd =async () => {
         let programData = {};
        if(navState.type === "beslenme")
         {
            programData = {hedef:hedef,kahvalti:kahvalti,ara1:ara1,ogle:ogle,ara2:ara2,aksam:aksam,ara3:ara3,extra:extra, kalori:kalori};
            console.log("beslenmeProgram:programData => ",programData);
            console.log("egzersizProgram:data[0].egzersizProgram => ",data[0].egzersizProgram);
            await setDoc(doc(db,"DanismanProgramlar",navState.danismanData.id),{beslenmeProgram:programData,egzersizProgram:data[0].egzersizProgram}); 
         }
         else{
            const dt = [...data[0].egzersizProgram,{hedef:hedef,bitisDate:endDate,baslangıcDate:startDate,pazartesi:pazartesiData,sali:saliData,carsamba:carsambaData,persembe:persembeData,cuma:cumaData,cumartesi:cumartesiData,pazar:pazarData}];
            console.log("ekle func dt => ", dt);
            await setDoc(doc(db,"DanismanProgramlar",navState.danismanData.id),{beslenmeProgram:data[0].beslenmeProgram,egzersizProgram:dt}); 
        }
     }
     const handelGunName = (index) => {
          switch(index)
          {
              case 0:
               return "Pazartesi";
              case 1: 
               return "Sali";
              case 2:
               return "Carsamba";
              case 3:
               return "Persembe";
              case 4:
               return "Cuma";
              case 5:
               return "Cumartesi";
              case 6:
                return "Pazar";      
          }
     }
     const handelEgzersizEkle = (index) => {
      switch(index)
      {
          case 0:
           pazartesiDataChange([...pazartesiData,{egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi}])
           break;
          case 1: 
          saliDataChange([...saliData,{egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi}])
          break;
          case 2:
            carsambaDataChange([...carsambaData,{egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi}])
            break;
          case 3:
            persembeDataChange([...persembeData,{egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi}])
            break;
          case 4:
           cumaDataChange([...cumaData,{egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi}])
            break;
          case 5:
            cumartesiDataChange([...cumartesiData,{egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi}])
            break;
          case 6:
            pazarDataChange([...pazarData,{egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi}])
            break;     
      }
     } 
     const handelDelete = (name,data) => {
            let newData = [];
             switch(name)
            {
                  case "pazartesi":
                  console.log("before pazartesi => ",pazartesiData)  
                  for(let i = 0 ;i< pazartesiData.length ; i++)
                  {
                        if(pazartesiData[i] !== data)
                        {
                             newData.push(pazartesiData[i])
                        }
                  }
              console.log("after pazartesi => ",newData)  
                     pazartesiDataChange(newData);
                    break; 

                    case "sali":
                      console.log("before sali => ",saliData)  
                      for(let i = 0 ;i< saliData.length ; i++)
                      {
                            if(saliData[i] !== data)
                            {
                                 newData.push(saliData[i])
                            }
                      }
                  console.log("after sali => ",newData) 
                       saliDataChange(newData);
                      break; 

                      case "carsamba":
                        console.log("before carsamba => ",carsambaData)  
                        for(let i = 0 ;i< carsambaData.length ; i++)
                        {
                              if(carsambaData[i] !== data)
                              {
                                   newData.push(carsambaData[i])
                              }
                        }
                    console.log("after carsamba => ",newData) 
                         carsambaDataChange(newData);
                        break; 

                        case "persembe":
                          console.log("before persembe => ",persembeData)  
                          for(let i = 0 ;i< persembeData.length ; i++)
                          {
                                if(persembeData[i] !== data)
                                {
                                     newData.push(persembeData[i])
                                }
                          }
                      console.log("after persembe => ",newData) 
                           persembeDataChange(newData);
                          break; 

                          case "cuma":
                            console.log("before cuma => ",cumaData)  
                            for(let i = 0 ;i< cumaData.length ; i++)
                            {
                                  if(cumaData[i] !== data)
                                  {
                                       newData.push(cumaData[i])
                                  }
                            }
                        console.log("after cuma => ",newData) 
                             cumaDataChange(newData);
                            break; 

                            case "cumartesi":
                              console.log("before cumartesi => ",cumartesiData)  
                              for(let i = 0 ;i< cumartesiData.length ; i++)
                              {
                                    if(cumartesiData[i] !== data)
                                    {
                                         newData.push(cumartesiData[i])
                                    }
                              }
                          console.log("after cumartesi => ",newData) 
                             cumartesiDataChange(newData);
                            break; 

                            case "pazar":
                              console.log("before pazar => ",pazarData)  
                              for(let i = 0 ;i< pazarData.length ; i++)
                              {
                                    if(pazarData[i] !== data)
                                    {
                                         newData.push(pazarData[i])
                                    }
                              }
                          console.log("after pazar => ",newData) 
                             pazarDataChange(newData);
                            break; 

            }
     }
     
     const handelUpdate = (name,data) => {
      let newData = [];
      switch(name)
     {
           case "pazartesi":
           console.log("before pazartesi => ",pazartesiData)  
           for(let i = 0 ;i< pazartesiData.length ; i++)
           {
                 if(pazartesiData[i] !== data)
                 {
                      newData.push(pazartesiData[i])
                 }
                 else{
                     newData.push({egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi});
                 }
           }
       console.log("after pazartesi => ",newData)  
              pazartesiDataChange(newData);
             break; 

             case "sali":
               console.log("before sali => ",saliData)  
               for(let i = 0 ;i< saliData.length ; i++)
               {
                     if(saliData[i] !== data)
                     {
                          newData.push(saliData[i])
                     }
                     else{
                      newData.push({egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi});
                  }
               }
           console.log("after sali => ",newData) 
                saliDataChange(newData);
               break; 

               case "carsamba":
                 console.log("before carsamba => ",carsambaData)  
                 for(let i = 0 ;i< carsambaData.length ; i++)
                 {
                       if(carsambaData[i] !== data)
                       {
                            newData.push(carsambaData[i])
                       }
                       else{
                        newData.push({egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi});
                    }
                 }
             console.log("after carsamba => ",newData) 
                  carsambaDataChange(newData);
                 break; 

                 case "persembe":
                   console.log("before persembe => ",persembeData)  
                   for(let i = 0 ;i< persembeData.length ; i++)
                   {
                         if(persembeData[i] !== data)
                         {
                              newData.push(persembeData[i])
                         }
                         else{
                          newData.push({egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi});
                      }
                   }
               console.log("after persembe => ",newData) 
                    persembeDataChange(newData);
                   break; 

                   case "cuma":
                     console.log("before cuma => ",cumaData)  
                     for(let i = 0 ;i< cumaData.length ; i++)
                     {
                           if(cumaData[i] !== data)
                           {
                                newData.push(cumaData[i])
                           }
                           else{
                            newData.push({egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi});
                        }
                     }
                 console.log("after cuma => ",newData) 
                      cumaDataChange(newData);
                     break; 

                     case "cumartesi":
                       console.log("before cumartesi => ",cumartesiData)  
                       for(let i = 0 ;i< cumartesiData.length ; i++)
                       {
                             if(cumartesiData[i] !== data)
                             {
                                  newData.push(cumartesiData[i])
                             }
                             else{
                              newData.push({egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi});
                          }
                       }
                   console.log("after cumartesi => ",newData) 
                      cumartesiDataChange(newData);
                     break; 

                     case "pazar":
                       console.log("before pazar => ",pazarData)  
                       for(let i = 0 ;i< pazarData.length ; i++)
                       {
                             if(pazarData[i] !== data)
                             {
                                  newData.push(pazarData[i])
                             }
                             else{
                              newData.push({egzersiz:egzersiz,setSayisi:setSayisi,tekrarSayisi:tekrarSayisi});
                          }
                       }
                   console.log("after pazar => ",newData) 
                      pazarDataChange(newData);
                     break; 

     }
     }

     const handelEgzersiz = (index) => {
      let rowTable = [];
      switch(index)
      {
          case 0:
            console.log("pazartesi.length => ",pazartesiData.length);
            console.log("pazartesi => ",pazartesiData)
            if(pazartesiData.length > 0)
        {for(let i = 0 ;i<pazartesiData.length;i++)
        {      
          rowTable.push(<tr>
            <th scope="row">{i+1}</th>
            <td>{pazartesiData[i].egzersiz}</td>
            <td>{pazartesiData[i].setSayisi}</td>
            <td>{pazartesiData[i].tekrarSayisi}</td>
            <td>
              {<button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                handelDelete("pazartesi",pazartesiData[i])}}>Sil</button>}
            </td>
            <td>
            {
                <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
                       e.preventDefault();
                       egzersizChange(ref1,pazartesiData[i].egzersiz);
                       setSayisiChange(ref2,pazartesiData[i].setSayisi);
                       tekrarSayisiChange(ref3,pazartesiData[i].tekrarSayisi);
                       activeDataChange({type:"pazartesi",data:pazartesiData[i]});
                     
                }}>Edit</button>
              }
            </td>
          </tr>)
        }        
        return rowTable;
      }
        return <tr>
        <th scope="row"></th>
        <td>Off Day</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
          case 1: 
          if(saliData.length > 0)
          {for(let i = 0 ;i<saliData.length;i++)
          {      
            rowTable.push(<tr>
              <th scope="row">{i+1}</th>
              <td>{saliData[i].egzersiz}</td>
              <td>{saliData[i].setSayisi}</td>
              <td>{saliData[i].tekrarSayisi}</td>
              <td>
              {<button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("sali",saliData[i])}}>Sil</button>}
            </td>
            <td>
            {
                <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
                       e.preventDefault();
                       egzersizChange(ref1,saliData[i].egzersiz);
                       setSayisiChange(ref2,saliData[i].setSayisi);
                       tekrarSayisiChange(ref3,saliData[i].tekrarSayisi);
                       activeDataChange({type:"sali",data:saliData[i]});
                     
                }}>Edit</button>
              }
            </td>
            </tr>)
          }        
          return rowTable;
        }
          return <tr>
          <th scope="row"></th>
          <td>Off Day</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
          case 2:
            if(carsambaData.length > 0)
            {for(let i = 0 ;i<carsambaData.length;i++)
            {      
              rowTable.push(<tr>
                <th scope="row">{i+1}</th>
                <td>{carsambaData[i].egzersiz}</td>
                <td>{carsambaData[i].setSayisi}</td>
                <td>{carsambaData[i].tekrarSayisi}</td>
                <td>
              {<button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("carsamba",carsambaData[i])}}>Sil</button>}
            </td>
            <td>
            {
                <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
                       e.preventDefault();
                       egzersizChange(ref1,carsambaData[i].egzersiz);
                       setSayisiChange(ref2,carsambaData[i].setSayisi);
                       tekrarSayisiChange(ref3,carsambaData[i].tekrarSayisi);
                       activeDataChange({type:"carsamba",data:carsambaData[i]});
                     
                }}>Edit</button>
              }
            </td>
              </tr>)
            }        
            return rowTable;
          }
            return <tr>
            <th scope="row"></th>
            <td>Off Day</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          case 3:
            if(persembeData.length > 0)
            {for(let i = 0 ;i<persembeData.length;i++)
            {      
              rowTable.push(<tr>
                <th scope="row">{i+1}</th>
                <td>{persembeData[i].egzersiz}</td>
                <td>{persembeData[i].setSayisi}</td>
                <td>{persembeData[i].tekrarSayisi}</td>
                <td>
              {<button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("persembe",persembeData[i])}}>Sil</button>}
            </td>
            <td>
            {
                <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
                       e.preventDefault();
                       egzersizChange(ref1,persembeData[i].egzersiz);
                       setSayisiChange(ref2,persembeData[i].setSayisi);
                       tekrarSayisiChange(ref3,persembeData[i].tekrarSayisi);
                       activeDataChange({type:"persembe",data:persembeData[i]});
                     
                }}>Edit</button>
              }
            </td>
              </tr>)
            }        
            return rowTable;
          }
            return <tr>
            <th scope="row"></th>
            <td>Off Day</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          case 4:
            if(cumaData.length > 0)
            {for(let i = 0 ;i<cumaData.length;i++)
            {      
              rowTable.push(<tr>
                <th scope="row">{i+1}</th>
                <td>{cumaData[i].egzersiz}</td>
                <td>{cumaData[i].setSayisi}</td>
                <td>{cumaData[i].tekrarSayisi}</td>
                <td>
              {<button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("cuma",cumaData[i])}}>Sil</button>}
            </td>
            <td>
            {
                <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
                       e.preventDefault();
                       egzersizChange(ref1,cumaData[i].egzersiz);
                       setSayisiChange(ref2,cumaData[i].setSayisi);
                       tekrarSayisiChange(ref3,cumaData[i].tekrarSayisi);
                       activeDataChange({type:"cuma",data:cumaData[i]});
                     
                }}>Edit</button>
              }
            </td>
              </tr>)
            }        
            return rowTable;
          }
            return <tr>
            <th scope="row"></th>
            <td>Off Day</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          case 5:
            if(cumartesiData.length > 0)
            {for(let i = 0 ;i<cumartesiData.length;i++)
            {      
              rowTable.push(<tr>
                <th scope="row">{i+1}</th>
                <td>{cumartesiData[i].egzersiz}</td>
                <td>{cumartesiData[i].setSayisi}</td>
                <td>{cumartesiData[i].tekrarSayisi}</td>
                <td>
              {<button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("cumartesi",cumartesiData[i])}}>Sil</button>}
            </td>
            <td>
            {
                <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
                       e.preventDefault();
                       egzersizChange(ref1,cumartesiData[i].egzersiz);
                       setSayisiChange(ref2,cumartesiData[i].setSayisi);
                       tekrarSayisiChange(ref3,cumartesiData[i].tekrarSayisi);
                       activeDataChange({type:"cumartesi",data:cumartesiData[i]});
                     
                }}>Edit</button>
              }
            </td>
              </tr>)
            }        
            return rowTable;
          }
            return <tr>
            <th scope="row"></th>
            <td>Off Day</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          case 6:
            if(pazarData.length > 0)
            {for(let i = 0 ;i<pazarData.length;i++)
            {      
              rowTable.push(<tr>
                <th scope="row">{i+1}</th>
                <td>{pazarData[i].egzersiz}</td>
                <td>{pazarData[i].setSayisi}</td>
                <td>{pazarData[i].tekrarSayisi}</td>
                <td>
              {<button className="btn btn-danger btn-sm" onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("pazar",pazarData[i])}}>Sil</button>}
            </td>
            <td>
            {
                <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
                       e.preventDefault();
                       egzersizChange(ref1,pazarData[i].egzersiz);
                       setSayisiChange(ref2,pazarData[i].setSayisi);
                       tekrarSayisiChange(ref3,pazarData[i].tekrarSayisi);
                       activeDataChange({type:"pazar",data:pazarData[i]});
                     
                }}>Edit</button>
              }
            </td>
              </tr>)
            }        
            return rowTable;
          }
            return <tr>
            <th scope="row"></th>
            <td>Off Day</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>     
      }
     } 
     const handelTable = () => {
              let egzersizTable =[];
              let gunName ;
              for(let i = 0 ;i<7 ; i++)
              {   
                  gunName = handelGunName(i);
                  egzersizTable.push( <> <div key={i} className="row mt-3">
                  <div className="col">
                  <table className="table">
<thead>
<tr>
  <th scope="col">{gunName} Gunu</th>
  <th scope="col">Egzersiz Adı</th>
  <th scope="col">Set Sayisi</th>
  <th scope="col">Tekrar Sayisi</th>
  <th scope="col">{<button className="btn btn-secondary btn-sm" style={{border:"none"}}  data-bs-toggle="modal" data-bs-target="#exerciseModal" data-bs-whatever="@getbootstrap" onClick={(e) => {
    e.preventDefault();
    egzersizChange(ref1);
    setSayisiChange(ref2);
    tekrarSayisiChange(ref3);
    activeChange(i);
  }}>+</button>}</th>
  <th></th>
</tr>
</thead>
<tbody>
 {handelEgzersiz(i)}
</tbody>
</table>
 </div>
</div>  
</>

)
              }
              return egzersizTable;
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
     {return  <div  style={{background:`url(${note})` , backgroundRepeat: "repeat" , backgroundSize:"cover"}}>
             { 
                navState.type === "beslenme" ? <>
                    <div className="container-fluid" style={{backgroundColor:"rgba(0,0,0,0.2)"}}>
                               <div className="row justify-content-center">
                                       <div className="col-11">
                                                <h4 className="text-center text-white">BESLENME PROGRAMI</h4>
                                       </div>
                                       <div className="col-1">
                                                <button className="text-white" style={{border:"none" , backgroundColor:"transparent"}} onClick={()=>{navigate(-1)}}>X</button>
                                       </div>
                               </div>  
                            <form>
                               <div className="row justify-content-center mt-2 ms-4 me-4">
                                       <div className="col-6">
                                           <div>
                                         
                      <label htmlFor="hedef" style={{ color: "white" }}>Hedef</label>
                      <input  className="form-control" id="hedef" type="text" value={hedef} onChange={hedefChange}/>
                                          
                                           </div>   
                                       </div>
                               </div> 
                      
                               <div className="row justify-content-center m-4">
                                     
                                     <div className="col-3">
                                     <label htmlFor="kahvaltı" className="form-label" style={{color:"white"}}>Kahvaltı</label>
                                      <textarea className="form-control" id="kahvaltı" rows="5" value={kahvalti} onChange={kahvaltiChange}></textarea>

                                      <label htmlFor="ara1" className="form-label" style={{color:"white"}}>1. Ara Ogun</label>
                                         <textarea className="form-control" id="ara1" rows="5" value={ara1} onChange={ara1Change}></textarea>

                                     </div>
     
                                     
                                     <div className="col-3">
                                     <label htmlFor="ogle" className="form-label" style={{color:"white"}}>Ogle</label>
                                      <textarea className="form-control" id="ogle" rows="5" value={ogle} onChange={ogleChange}></textarea>

                                      <label htmlFor="ara2" className="form-label" style={{color:"white"}}>2. Ara Ogun</label>
                                         <textarea className="form-control" id="ara2" rows="5" value={ara2} onChange= {ara2Change}></textarea>

                                     </div>
                           
                                     
                                        <div className="col-3">
                                        <label htmlFor="aksam" className="form-label" style={{color:"white"}}>Aksam</label>
                                         <textarea className="form-control" id="aksam" rows="5" value={aksam} onChange={aksamChange}></textarea>

                                         <label htmlFor="ara3" className="form-label" style={{color:"white"}}>3. Ara Ogun</label>
                                         <textarea className="form-control" id="ara3" rows="5" value={ara3} onChange={ara3Change}></textarea>

                                        </div>
                                        <div className="col-3">
                                        <label htmlFor="extra" className="form-label" style={{color:"white"}}>Extra Uyulacaklar</label>
                                         <textarea className="form-control" id="extra" rows="12" value={extra} onChange={extraChange}></textarea>

                                        </div>
                               </div>
                                   <div className="row justify-content-center ms-4 me-4">
                                         <div className="col-6">
                                         <label htmlFor="kalori" style={{ color: "white" }}>Kalori Hedefi</label>
                                         <input className="form-control" id="kalori" type="text" value={kalori} onChange={kaloriChange}/>
                                         </div>
                                   </div>
                            </form>     
                               <div className="row justify-content-center " style={{marginTop:"10%"}}>
                                      <div className="col-1" >
                                            <button className="btn btn-success" onClick={() => {handelAdd()}}>Ekle</button>
                                      </div>
                               </div>
                    </div>      
               
                 </>
                 : <>
                    <div className="container-fluid" style={{backgroundColor:"rgba(0,0,0,0.2)"}}>        
                    <div className="modal fade "  id="exerciseModal" tabIndex="-1" aria-labelledby="exerciseModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exerciseModalLabel">Egzersiz Kayıt</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="egzersiz" className="col-form-label">Egzersiz Adı</label>
            <input ref={ref1} type="text" className="form-control" id="egzerisz" value={egzersiz} onChange={(e) => {egzersizChange(e)}}/>
          </div>
          <div className="mb-3">
            <label htmlFor="set" className="col-form-label">Set Sayısı</label>
            <input ref={ref2} type="text" className="form-control" id="set" value={setSayisi} onChange={(e) => {setSayisiChange(e)}}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="tekrar" className="col-form-label">Tekrar Sayısı</label>
            <input ref={ref3} className="form-control" id="tekrar" type="text" value={tekrarSayisi} onChange={(e) => {tekrarSayisiChange(e)}}></input>
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={(e) => {
     e.preventDefault();
     handelEgzersizEkle(active)
     egzersizChange(ref1);
     setSayisiChange(ref2);
     tekrarSayisiChange(ref3);
  }}>Ekle</button>
      </div>
    </div>
  </div>
</div>          

  
{
                 <div className="modal fade "  id={`exeEditModal`} tabIndex="-1" aria-labelledby={
                  `exeEditModalLabel`} aria-hidden="true">
                 <div className="modal-dialog">
                   <div className="modal-content">
                     <div className="modal-header">
                       <h1 className="modal-title fs-5" id={`exeEditModalLabel`}>Egzersiz Kayıt</h1>
                       <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                     </div>
                     <div className="modal-body">
                       <form>
                         <div className="mb-3">
                           <label htmlFor="egzersiz" className="col-form-label">Egzersiz Adı</label>
                           <input ref={ref1} type="text" className="form-control" id="egzerisz" value={egzersiz} onChange={(e) => {
                            egzersizChange(e)
                            }}/>
                         </div>
                         <div className="mb-3">
                           <label htmlFor="set" className="col-form-label">Set Sayısı</label>
                           <input ref={ref2} type="text" className="form-control" id="set" value={setSayisi} onChange={(e) => {setSayisiChange(e)}}></input>
                         </div>
                         <div className="mb-3">
                           <label htmlFor="tekrar" className="col-form-label">Tekrar Sayısı</label>
                           <input ref={ref3} className="form-control" id="tekrar" type="text" value={tekrarSayisi} onChange={(e) => {tekrarSayisiChange(e)}}></input>
                         </div>
                       </form>
                     </div>
                     <div className="modal-footer">
                       <button type="button" className="btn btn-primary" onClick={(e) => {
                    e.preventDefault();
                    handelUpdate(activeData.type,activeData.data)
                 }}>Guncelle</button>
                     </div>
                   </div>
                 </div>
               </div>    
              }
             

                               <div className="row justify-content-center">
                                       <div className="col-11">
                                                <h4 className="text-center text-white">EGZERSİZ PROGRAMI</h4>
                                       </div>
                                       <div className="col-1">
                                                <button className="text-white" style={{border:"none" , backgroundColor:"transparent"}} onClick={()=>{navigate(-1)}}>X</button>
                                       </div>
                               </div> 
                               <form>
                               <div className="row justify-content-center mt-2">
                                          <div className="col-6">
                                          <label htmlFor="hedef" style={{ color: "white" }}>Hedef</label>
                                         <input className="form-control" id="hedef" type="text" value={hedef} onChange={hedefChange}/>
                                          </div>
                               </div>
                               {handelTable()}
                               <div className="row justify-content-around mt-2">
                                          <div className="col-4">
                                          <label htmlFor="baslangicDate" style={{ color: "white" }}>Baslangic Tarihi</label>
                                         <input className="form-control" id="baslangicDate" type="date" value={startDate} onChange={startDateChange}/>
                                          </div>
                                          <div className="col-4">
                                          <label htmlFor="bitisDate" style={{ color: "white" }}>Bitis Tarihi</label>
                                         <input className="form-control" id="bitisDate" type="date" value={endDate} onChange={endDateChange}/>
                                          </div>
                               </div>
                               </form>
                               <div className="row justify-content-center mt-2">
                                       <div className="col-1 ">
             <button className="btn btn-success" onClick={() => {handelAdd()}}>Ekle</button>
                                       </div>    
                               </div>
                    </div>      
                 
                 </>
             }
     </div>}

} 