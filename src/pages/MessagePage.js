import { useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faShare,faArrowDown} from '@fortawesome/free-solid-svg-icons'
import messageImage from "../images/message.jpg"
import { useEffect, useRef, useState } from "react";
import "../styles/EntryPage.css"
import { db } from "../firebase/firebaseInit";
import { doc,getDoc,setDoc,onSnapshot } from "firebase/firestore";
import InputState from "../InputState";

export default function MessagePage(props)
{
   const inputRef = useRef(null);
   const scrollDivRef = useRef(null);
   const navigate = useNavigate();   
   const data = useLocation().state;
   console.log("data => ",data)
   const [dataLoad , dataLoadChange] = useState(false);
   const [oldMessages,oldMessagesChange] = useState([])
   const [otherPersonData,otherPersonDataChange] = useState([]);
   const [message,messageChange] = InputState();
   useEffect(() => {
    console.log("useEffect is builed")
    const fetchData = async () => {
      try {
        dataLoadChange(false);
        
        const docRef2 = doc(db, "Users", data.otherId);
        const docSnap2 = await getDoc(docRef2);
  
        if (docSnap2.exists()) {
          otherPersonDataChange(docSnap2.data());
        } else {
          console.log("No such document!");
        }
  
        const unsub = onSnapshot(doc(db, "Mesajlar", `${data.id}${data.otherId}`), (snapShot) => {
          if (snapShot.exists) {
            console.log("Current data: ", snapShot.data());
            console.log("if blog oldMessages => ", snapShot.data());
            if (snapShot.data() !== undefined) {
              oldMessagesChange(snapShot.data().mesajlar);
            }
          } else {
            console.log("eski mesajlar bulunmamaktadır");
            console.log("else blog oldMessages => ", oldMessages);
          }
        });
  
        dataLoadChange(true);
  
        return () => {
          unsub();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
      if(data.otherId !== -1)
    {
      fetchData();
    }
  }, []);
  
   const  handelSend =async () => 
   {       
          await setDoc(doc(db,"Mesajlar",`${data.id}${data.otherId}`),{mesajlar:[...oldMessages,{id:data.id,message:message}]})
          await setDoc(doc(db,"Mesajlar",`${data.otherId}${data.id}`),{mesajlar:[...oldMessages,{id:data.id,message:message}]})
          scrollBottom();
          messageChange(inputRef)
        }
   const scrollBottom = () => {
    console.log("scrollBottom is build")
    const scrollHeight = scrollDivRef.current.scrollHeight;
    const height = scrollDivRef.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    console.log("scrollHeight => ",scrollHeight)
    console.log("height => ",height)
    console.log("maxScrollTop => ",maxScrollTop)
    console.log("before scrollTop => ",scrollDivRef.current.scrollTop)
    scrollDivRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    console.log("after scrollTop => ",scrollDivRef.current.scrollTop);
  } 
    
    function scrollCalculate()
    {
      const scrollHeight = scrollDivRef.current.scrollHeight;
      const height = scrollDivRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      return  scrollDivRef.current.scrollTop < maxScrollTop ? true : false;
    }   
   const handelScroll = () => {
       scrollBottom()
   }    
  if(!dataLoad) 
  {
        if(data.otherId === -1)
        {
          return <div className="body" style={{background:`url(${messageImage})` , backgroundRepeat:"no-repeat" , backgroundSize:"100% 100%"}}>
     <div className='container-fluid '>
{<div className='row justify-content-center'>
  <div className='col-6 ' style={{ marginTop: "12%", marginLeft: "22%" , marginBottom:"36%"}}>
    <h4 style={{ display: "inline", color: "white" }}>ANTRENORUNUZ BULUNMAMAKTADIR</h4>
  </div>
  <div className="col-1">
                                      <button style={{backgroundColor:"transparent" , border:"none",marginTop:"5px"}} onClick={() => {
                                             navigate(-1);
                                      }}>
                                        X
                                      </button>
                      </div>
</div>}
</div>
</div>
        }
        else{
          return <div className="body" style={{background:`url(${messageImage})` , backgroundRepeat:"no-repeat" , backgroundSize:"100% 100%"}}>
     <div className='container-fluid '>
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
  }
  else
  {
    console.log("otherPersonData => ",otherPersonData)
    console.log("oldMessages.length => ",oldMessages.length)
    return <div className="body" style={{background:`url(${messageImage})` , backgroundRepeat:"no-repeat" , backgroundSize:"100% 100%"}}>
            <div className="container-fluid p-0" style={{width:"100%" , height:"100vh"}}>
            <div className="container-fluid bg-body-secondary bg-opacity-50 " style={{height:"6%",backgroundColor:"transparent"}}>
                              <div className="row">
                                   <div className="col-11">
                                   <img src={otherPersonData.img} style={{height:"40px",width:"40px",borderRadius:"100%", marginLeft:"5px",marginRight:"20px"}}></img>   
                                    <h5 className="align-bottom" style={{display:"inline-block"}}>{otherPersonData.kullaniciAd} {otherPersonData.kullaniciSoyad}</h5> 
                                   </div>
                                   <div className="col-1">
                                      <button style={{backgroundColor:"transparent" , border:"none",marginTop:"5px"}} onClick={() => {
                                             navigate(-1);
                                      }}>
                                        X
                                      </button>
                      </div>
                              </div>
                             
            </div>  
                      <div ref={scrollDivRef} className="d-flex flex-column" style={{overflowY: 'auto', maxHeight:"80%" ,height:"80%"}}>
                              {oldMessages.length > 0 &&  oldMessages.map((m) => {
                                           if(m.id === data.id)
                                           {
                                                return <div className="d-flex justify-content-end" style={{marginRight:"3px",marginLeft:"3px"}}> 
                                                              <p className=" bg-success bg-opacity-50 ">{m.message}</p>
                                                       </div> 
                                           }
                                           return <div className="d-flex justify-content-start" style={{marginRight:"3px",marginLeft:"3px"}}> 
                                                              <p className=" bg-secondary bg-opacity-50 ">{m.message}</p>
                                                       </div> 
                              })
                              }
                      </div>
                      <div className="container-fluid  p-0" style={{height:"10%"}} >
                         <div className="row align-items-center justify-content-end m-0" style={{height:"100%"}}>
                                     <div className="col-8" >
                                     <input ref={inputRef} className="form-control rounded-pill"  id="message" type="text" value={message} onChange={(e) => {
                                      console.log("inputRef",inputRef)
                                      messageChange(e)}}/>
                                     </div>
                                     <div className="col-1">
                                             <button className="btn btn-outline-primary" onClick={() => {handelSend()}}>{<FontAwesomeIcon icon={faShare} />}</button>
                                     </div>
                                    <div className="col-1">
                                             <button className="btn btn-warning btn-sm text-white" style={{marginLeft:"60%"}}  onClick={() => {handelScroll()}}>{<FontAwesomeIcon icon={faArrowDown}  />}</button>
                                     </div>
                               </div>
                               </div>  
  </div>
  </div>
       
  }
}