import { useState , useRef} from "react";
import { doc,setDoc,getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import InputState from "../InputState";
import { useLocation, useNavigate } from "react-router-dom"
import note from "../images/note.jpg";
import "../styles/EntryPage.css"

 export default function DanismanEgzersizProgram() {
    const navigate = useNavigate();
    const navState = useLocation().state;
   console.log("navState => ",navState);
   console.log("navState.programlar => ",navState.programlar);
   console.log("navState.programlar[0] => ",navState.programlar[0]);
   console.log("navState.programlar[0].egzersizProgram => ",navState.programlar[0].egzersizProgram);
   console.log("navState.programlar[0].egzersizProgram.pazartesi",navState.programlar[0].egzersizProgram.pazartesi)
   console.log("navState.danismanData => ",navState.danismanData);
   const [data,dataChange] = useState([])
    const [lock,lockChange] = useState(false);
    const [dataLoad,dataLoadChange] = useState(true)
    const ref1 = useRef()
    const ref2 = useRef()
    const ref3 = useRef()
    const [hedef,hedefChange] = InputState(navState.danismanData.hedefler[0]);
    const [startDate,startDateChange] = InputState(navState.programlar[0].egzersizProgram.baslangıcDate);
    const [endDate,endDateChange] = InputState(navState.programlar[0].egzersizProgram.bitisDate);
    const [pazartesiData,pazartesiDataChange] = useState(navState.programlar[0].egzersizProgram.pazartesi);
    const [saliData,saliDataChange] = useState(navState.programlar[0].egzersizProgram.sali);
    const [carsambaData,carsambaDataChange] = useState(navState.programlar[0].egzersizProgram.carsamba);
    const [persembeData,persembeDataChange] = useState(navState.programlar[0].egzersizProgram.persembe);
    const [cumaData,cumaDataChange] = useState(navState.programlar[0].egzersizProgram.cuma);
    const [cumartesiData,cumartesiDataChange] = useState(navState.programlar[0].egzersizProgram.cumartesi);
    const [egzersiz,egzersizChange] = InputState("");
    const [setSayisi,setSayisiChange] = InputState("");
    const [tekrarSayisi,tekrarSayisiChange] = InputState("");
    const [active,activeChange] = useState();
    const [activeData,activeDataChange] = useState({type:"",data:{egzersiz:"",setSayisi:"",tekrarSayisi:""}});
    const [pazarData,pazarDataChange] = useState(navState.programlar[0].egzersizProgram.pazar);
    const  handelAdd =async () => {
      console.log(" navState= ", navState)
      console.log(" navState.programlar[0] = ", navState.programlar[0])
      console.log(" navState.programlar[0].egzersizProgram = ", navState.programlar[0].egzersizProgram)
      console.log(" navState.programlar[0].egzersizProgram = ", navState.programlar[0].egzersizProgram)
      console.log(" data = ", data)
       
      const dt = [{hedef:hedef,bitisDate:endDate,baslangıcDate:startDate,pazartesi:pazartesiData,sali:saliData,carsamba:carsambaData,persembe:persembeData,cuma:cumaData,cumartesi:cumartesiData,pazar:pazarData}];
         console.log("ekle func dt => ", dt);
        if(data[0].egzersizProgram.length === 0)
        {
          await setDoc(doc(db,"DanismanProgramlar",navState.danismanData.id),{beslenmeProgram:data[0].beslenmeProgram,egzersizProgram:dt});
        }
        else{
          let newEgzersizData = [] ;
          console.log(" navState.programlar[0].egzersizProgram = ", navState.programlar[0].egzersizProgram)
              for(let i = 0 ; i< data[0].egzersizProgram.length;i++)
                           {
                              console.log(" navState.index === i = ",navState.index === i)
                              console.log("data[0].egzersizProgram[navState.index]  = ",data[0].egzersizProgram[navState.index] )
                              console.log(" navState.programlar[0].egzersizProgram = ", navState.programlar[0].egzersizProgram)

                                   if(navState.index === i)
                                  {
                                    console.log("data[0].egzersizProgram[navState.index]  = ",data[0].egzersizProgram[navState.index] )
                                    console.log(" navState.programlar[0].egzersizProgram = ", navState.programlar[0].egzersizProgram)        

                                   
                                           newEgzersizData.push({hedef:hedef,bitisDate:endDate,baslangıcDate:startDate,pazartesi:pazartesiData,sali:saliData,carsamba:carsambaData,persembe:persembeData,cuma:cumaData,cumartesi:cumartesiData,pazar:pazarData}) 
                                  }
                                  else{
                                           newEgzersizData.push(data[0].egzersizProgram[i])
                                  } 
                           }     
                          
            await setDoc(doc(db,"DanismanProgramlar",navState.danismanData.id),{beslenmeProgram:data[0].beslenmeProgram,egzersizProgram:newEgzersizData});          
            }
         
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
           <h4 style={{ display: "inline", color: "white" }}>AKTİF EGZERSİZ PROGRAMINIZ BULUNMAMAKTADIR</h4>
         </div>
       </div>
     </div>
       </div>
    }
    else
      {
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
            console.log("name => ",name , "data => ",data) 
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
      console.log("name => ",name , "data => ",data) 
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
              {!navState.isReadOnly && <button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                handelDelete("pazartesi",pazartesiData[i])}}>Sil</button>}
            </td>
            <td>
            {
            !navState.isReadOnly &&    <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
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
              {!navState.isReadOnly && <button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("sali",saliData[i])}}>Sil</button>}
            </td>
            <td>
            {
             !navState.isReadOnly &&   <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
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
              {!navState.isReadOnly && <button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("carsamba",carsambaData[i])}}>Sil</button>}
            </td>
            <td>
            {
            !navState.isReadOnly &&    <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
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
              {!navState.isReadOnly && <button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("persembe",persembeData[i])}}>Sil</button>}
            </td>
            <td>
            {
             !navState.isReadOnly &&   <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
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
              {!navState.isReadOnly && <button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("cuma",cumaData[i])}}>Sil</button>}
            </td>
            <td>
            {
             !navState.isReadOnly &&   <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
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
              {!navState.isReadOnly && <button className="btn btn-danger btn-sm"  onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("cumartesi",cumartesiData[i])}}>Sil</button>}
            </td>
            <td>
            {
             !navState.isReadOnly &&   <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
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
              {!navState.isReadOnly && <button className="btn btn-danger btn-sm" onClick={(e) =>{
                 e.preventDefault()
                 handelDelete("pazar",pazarData[i])}}>Sil</button>}
            </td>
            <td>
            {
             !navState.isReadOnly &&     <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#exeEditModal`} data-bs-whatever="@getbootstrap"  onClick={(e) => {
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
  <th scope="col">{!navState.isReadOnly && <button className="btn btn-secondary btn-sm" style={{border:"none"}}  data-bs-toggle="modal" data-bs-target="#exerciseModal" data-bs-whatever="@getbootstrap" onClick={(e) => {
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
    return <div  style={{background:`url(${note})` , backgroundRepeat:"repeat" , backgroundSize:"cover"}}>
          <>
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
                                         <input readOnly={navState.isReadOnly} className="form-control" id="hedef" type="text" value={hedef} onChange={hedefChange}/>
                                          </div>
                               </div>
                               {handelTable()}
                               <div className="row justify-content-around mt-2">
                                          <div className="col-4">
                                          <label htmlFor="baslangicDate" style={{ color: "white" }}>Baslangic Tarihi</label>
                                         <input readOnly={navState.isReadOnly}  className="form-control" id="baslangicDate" type="date" value={startDate} onChange={startDateChange}/>
                                          </div>
                                          <div className="col-4">
                                          <label htmlFor="bitisDate" style={{ color: "white" }}>Bitis Tarihi</label>
                                         <input readOnly={navState.isReadOnly} className="form-control" id="bitisDate" type="date" value={endDate} onChange={endDateChange}/>
                                          </div>
                               </div>
                               </form>
                          { !navState.isReadOnly &&  <div className="row justify-content-center mt-2">
                                       <div className="col-1 ">
             <button className="btn btn-success" onClick={() => {handelAdd()}}>Guncelle</button>
                                       </div>    
                               </div>}
                    </div>      
                 
                 </>
</div>
}
}}


