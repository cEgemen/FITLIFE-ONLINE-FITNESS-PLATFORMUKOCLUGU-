import {  useState,useContext } from "react"
import { CurrentUserContext } from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope,faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { PieChart } from '@mui/x-charts/PieChart';
import { doc,getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import { useNavigate } from "react-router-dom";
export default function AntrenorPage() {
  const navigate = useNavigate();
    const antrenor2 = useContext(CurrentUserContext);
    console.log("current user2",antrenor2);
    console.log("current user2 id",antrenor2.state.user.id);
    const [dataLoading,dataLoadingChange] = useState(true);
    const [lock,lockChange] = useState(false);
    const [data,dataChnage] = useState([{}]);
    const [danismanData,danismanDataChange] = useState([])
   const handelInit =async () => {
      dataLoadingChange(true)
     const docRef2 = doc(db, "AntrenorDanismanlari",`${antrenor2.state.user.id}`);
     const docSnap2 = await getDoc(docRef2);
  if(docSnap2.exists())
  {
    let graficDataArray = [];
    let danId = [];
    let danData = [];
    const graficData = docSnap2.data(); 
    console.log("graficData ===>>> ",graficData)
      for(const x in  graficData)
      {
        console.log("id:x",x);
        console.log("value:graficData[x][0][danismanlar].length",graficData[x][0]["danismanlar"].length)
        console.log("label:graficData[x][0][type]}]",graficData[x][0]["type"])
              graficDataArray.push({id:+x,value:graficData[x][0]["danismanlar"].length, label:`${graficData[x][0]["type"]} Kisi Sayisi`}) 
                danId.push(...graficData[x][0]["danismanlar"])      
      }
         for (const x of danId)
         {
            const docRef = doc(db,"Users",x);
            const docSnap  = await getDoc(docRef)
            if(docSnap.exists)
            {
                danData.push(docSnap.data());
            }
            else{
                console.log("errrorr")
            }
         }
      dataChnage(graficDataArray);
      danismanDataChange(danData);
    }
  else {
    console.log("No such document!");
  } 


      dataLoadingChange(false)     
   }
   if(!lock) 
   {
    handelInit();
    lockChange(!lock)
   }
   
   function handelMesaj(id,otherId)
   {
     navigate("/kullanici/message",{state:{id:id,otherId:otherId}})
   }

   console.log("after update data => ",data)
  if(dataLoading)
  {
   return  <div className='container '>
    {<div className='row justify-content-center'>
      <div className='col-6 ' style={{ marginTop: "12%", marginLeft: "30%" }}>
        <h4 style={{ display: "inline", color: "black" }}>LOADING</h4>
        <div className="spinner-grow spinner-grow-sm" style={{ color: "black" }} role="status">
          <span className="visually-hidden">LOADING...</span>
        </div>
        <div className="spinner-grow spinner-grow-sm " style={{ color: "black" }} role="status">
          <span className="visually-hidden">LOADING...</span>
        </div>
        <div className="spinner-grow spinner-grow-sm " style={{ color: "black" }} role="status">
          <span className="visually-hidden">LOADING...</span>
        </div>
      </div>
    </div>}
  </div>
  }
else
{ 
      return <div className="container-fluid"  style={{backgroundColor:"rgba(256,256,256,0.2)",}}>
          <button className="btn btn-outline-success" type="button"  data-bs-toggle="modal" data-bs-target={`#staticMesajModel`} style={{border:"none",backgroundColor:"transparent",position:"fixed" , bottom:"10px" , right:"10px"}} >{<FontAwesomeIcon icon={faCommentDots} size="2xl" />}</button>
<div className="modal fade" id={`staticMesajModel`} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby={`staticMesajModel`} aria-hidden="true">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id={`staticMesajModel`}>Danismanlar</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        Mesaj Atmak İstediginiz Danismanı Seciniz
      </div>
      <div className="modal-footer justify-content-center">
       {1 <= danismanData.length && <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelMesaj(antrenor2.state.user.id,danismanData[0].id)}>{danismanData[0].kullaniciAd} {danismanData[0].kullaniciSoyad}</button>}
       {2 <= danismanData.length && <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelMesaj(antrenor2.state.user.id,danismanData[1].id)}>{danismanData[1].kullaniciAd} {danismanData[1].kullaniciSoyad}</button>}
        {3 <= danismanData.length  &&<button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelMesaj(antrenor2.state.user.id,danismanData[2].id)}>{danismanData[2].kullaniciAd} {danismanData[2].kullaniciSoyad}</button>}
       {4 <= danismanData.length &&<button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelMesaj(antrenor2.state.user.id,danismanData[3].id)}>{danismanData[3].kullaniciAd} {danismanData[3].kullaniciSoyad}</button>}
        {5 <= danismanData.length  && <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelMesaj(antrenor2.state.user.id,danismanData[4].id)}>{danismanData[4].kullaniciAd} {danismanData[4].kullaniciSoyad}</button>}
      </div>
    </div>
  </div>
</div>
        <div className="row  justify-content-center">
             <div className="col-6">
                <h3 className="text-center">ANTRENOR PAGE</h3>
            </div>
        </div>
            <div className="row  justify-content-center">
                   <div className="col-6 "  style={{marginTop:"12%",marginBottom:"18%"}}>
                   <h5 className="text-center">Uzmanlık Danisman Dagılımı</h5>
                   <PieChart 
      series={[
        {
          data: data,
        },
      ]}
      width={600}
      height={200}
    />     
                   </div>
            </div>
    </div>}


}