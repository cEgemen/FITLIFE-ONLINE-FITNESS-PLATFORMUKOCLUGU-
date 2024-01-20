import { useContext, useEffect, useState } from "react"
import { SistemKullanicilarContext } from "../context/SistemKullanicilarContext"
import { useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc, setDoc, updateDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseInit";
import { getDocs } from "firebase/firestore";

export default function AdminPageKullanicilarTable(props) {
  const navigate = useNavigate();
  const { sistemKullanicilar, sistemKullanicilarChange,loadingChange } = useContext(SistemKullanicilarContext);
  const [init, initChange] = useState(false);
  const [kullanicilar, kullanicilarChange] = useState([]);
  const [kullanicilarEgzersizProgramlar, kullaniciEgzersizProgramlarChange] = useState([]);
  console.log("sistemKullanicilari => ", sistemKullanicilar);
  useEffect(() => {
    let egzersizDatas = [];
    console.log("use effect build", props.type);
    async function handelEffect() {
      if (props.type === "antrenorler") {
        let antronerler = [];
        let docRef2;
        let docSnap2;
        console.log("sistemKullanicilari.antrenorlar =>=> ", sistemKullanicilar.antrenorlar);
        initChange(false)
        for (let i = 0; i < sistemKullanicilar.antrenorlar.length; i++) {
          console.log("sistemKullanicilar.antrenorlar[i] =>=>", sistemKullanicilar.antrenorlar[i])
          docRef2 = doc(db, "Users", `${sistemKullanicilar.antrenorlar[i]}`);
          docSnap2 = await getDoc(docRef2);
          if (docSnap2.exists()) {
            antronerler.push({ ...docSnap2.data() });
            console.log("antrenorler ===> ", antronerler[i]);
          }
          else {
            console.log("No such document!");
          }

        }
        kullanicilarChange([...antronerler]);
        console.log("kullanicilar => => ", kullanicilar);
        initChange(true)
      }
      else {
        let danismanlar = [];
        let docRef2;
        let docSnap2;
        initChange(false)
        for (let i = 0; i < sistemKullanicilar.danismanlar.length; i++) {
          console.log("sistemKullanicilar.danismanlar[i] =>=>", sistemKullanicilar.danismanlar[i])
          docRef2 = doc(db, "Users", `${sistemKullanicilar.danismanlar[i]}`);
          docSnap2 = await getDoc(docRef2);
          if (docSnap2.exists()) {
            danismanlar.push({ ...docSnap2.data() });
            console.log("danismanlar ===> ", danismanlar[i]);
            const docRef = doc(db, "DanismanProgramlar",sistemKullanicilar.danismanlar[i]);
            const docSnap = await getDoc(docRef);
            console.log("docSnap.data().egzersiz", docSnap.data().egzersizProgram)
            if (docSnap.exists()) {
               egzersizDatas.push(docSnap.data());
            }
            else {
              console.log("No such document!");          
            }
          }
          else {
            console.log("No such document!");
          }

        }
        console.log("egzersiz datas => ",egzersizDatas);
        kullanicilarChange([...danismanlar]);
        kullaniciEgzersizProgramlarChange(egzersizDatas)
        console.log("kullanicilar => => ", kullanicilar);
        initChange(true)
      }
    }
    handelEffect();
  }, [])



  if (init === false ) {
    return <div >
      <div className='container' style={{
        marginTop: "15%", marginLeft: "25%"
      }}>
        <div className='row justify-content-center'>
          <div className='col-6'>
            <h4 style={{ display: "inline", color: "black" }}>LOADING</h4>
            <div className="spinner-grow spinner-grow-sm" style={{ color: "black" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow spinner-grow-sm " style={{ color: "black" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow spinner-grow-sm " style={{ color: "black" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
  else {
    console.log("else block kullanicilar ==> ==> ", kullanicilar)
    const changeKullaniciDatas = (id, datas) => {
      let lastData = [];
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].id !== id) {
          lastData.push(datas[i]);
        }
      }
      return lastData;
    }
    const changeKullaniciIds = (id, datas) => {
      let lastData = [];
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].id !== id) {
          lastData.push(datas[i].id);
        }
      }
      return lastData;
    }
    async function handelInfo(name, data) {
      if (props.type === "danisanlar") {
        let ilerlemeData;
        const docRef2 = doc(db, "DanismanIlerleme", `${data.id}`);
        const docSnap2 = await getDoc(docRef2);
        if (docSnap2.exists()) {
          ilerlemeData = { ...docSnap2.data() };
        }
        else {
          console.log("No such document!");
        }
        navigate(`/kullanici/admin/${name}`, { state: { ...data, ...ilerlemeData } })
      }
      else {
        let danismanData = [];
        const docRef2 = doc(db, "AntrenorDanismanlari", `${data.id}`);
        const docSnap2 = await getDoc(docRef2);
        if (docSnap2.exists()) {
          console.log("docSnap2 data => ", docSnap2.data())
          for (const x in docSnap2.data()) {
            for (const y of docSnap2.data()[x][0]["danismanlar"]) {
              const docRef = doc(db, "Users", `${y}`);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists) {
                danismanData.push({ ad: docSnap.data().kullaniciAd, soyad: docSnap.data().kullaniciSoyad, img: docSnap.data().img });
              }
              else {
                console.log("errorrr")
              }
            }
          }
          navigate("/kullanici/admin/bilgi", { state: { data: data, danismanlar: danismanData } })
        }
        else {
          console.log("No such document!");
          navigate("/kullanici/admin/bilgi", { state: { data: data, danismanlar:[{ad:"",soyad:"Danisman Bilgisi Bulunmamaktadır",img:""}] } })
        }
      }
    }

    async function handelPlanlar(planName, data ,i,index) {
      console.log("admin kullanici data page handel planlar func 'data.id' ", data.id)
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
              docData={hedef:"",baslangıcData:"",bitisDate:"",pazartesi:[],sali:[],carsamba:[],persembe:[],cuma:[],cumartesi:{},pazar:[]};
              navigate("/kullanici/danismanEgzersiz", { state: { danismanData: data, programlar: [{egzersizProgram:docData}], isReadOnly: false, isReadyData: isReadyData,index:index} })
            }
            else {
              console.log("egzersizProgram:kullanicilarEgzersizProgramlar[i].egzersizProgram[index] => ",{egzersizProgram:kullanicilarEgzersizProgramlar[i].egzersizProgram[index]} )
              navigate("/kullanici/danismanEgzersiz", { state: { danismanData: data, programlar: [{egzersizProgram:kullanicilarEgzersizProgramlar[i].egzersizProgram[index]}], isReadOnly: false, isReadyData: isReadyData,index:index } })
            }
  
          }
    }

    async function handelDelete(datas) {
      console.log("sistemKullanicilari danismanlar ", sistemKullanicilar.danismanlar)
      console.log("sistemKullanicilari antrenorlar ", sistemKullanicilar.antrenorlar)
       console.log("first kullanici datas ===> ", kullanicilar)
      const lastDatas = changeKullaniciDatas(datas.id, kullanicilar);
      const lastIds = changeKullaniciIds(datas.id, kullanicilar);
      console.log("last kullanici datas ===> ", lastDatas)
      await deleteDoc(doc(db, "Users",datas.id)); 
      const querySnapshot1 = await getDocs(collection(db, "Mesajlar"));
      let deletMessage = [];
      querySnapshot1.forEach(async (doc) => {
        console.log(doc.id, " => ", doc.data());
        console.log("datas.id => ", datas.id);
         if(doc.id.includes(datas.id)){
            deletMessage.push(doc.id) 
         }
      });
       console.log("delete message size = ",deletMessage)
       if(deletMessage.length !== 0)
        {  for(let k = 0 ;k < deletMessage.length ; k++)
          {
            await deleteDoc(doc(db, "Mesajlar",deletMessage[k]));
          }}
      if (props.type === "antrenorler") {
        await setDoc(doc(db, "SistemKullanici", "sistemKullanicilari"), { adminler: [...sistemKullanicilar.adminler], danismanlar: [...sistemKullanicilar.danismanlar], antrenorlar: lastIds, kullaniciHistoryCount: [...sistemKullanicilar.kullaniciHistoryCount, ((sistemKullanicilar.adminler.length + sistemKullanicilar.antrenorlar.length + sistemKullanicilar.danismanlar.length) - 1)] });
         await deleteDoc(doc(db,"AntrenorDanismanlari",datas.id));
          if(sistemKullanicilar.danismanlar.length !== 0)
         { for(let i = 0 ; i< sistemKullanicilar.danismanlar.length ; i++)
            {
              const  docRef5 = doc(db, "Users",`${sistemKullanicilar.danismanlar[i]}`);
              const  docSnap5 = await getDoc(docRef5);
          if(docSnap5.exists())
          {
            
            if(docSnap5.data().antrenorlar[0] === datas.id)
             {
 
                  const userRef = doc(db, "DanismanProgramlar",sistemKullanicilar.danismanlar[i]);
                  await updateDoc(userRef, {
                    beslenmeProgram:{},egzersizProgram:[{}]
           });
                       const userRef2 = doc(db, "Users",sistemKullanicilar.danismanlar[i]);
                       await updateDoc(userRef2, {
                       antrenorlar:[]
                });
             }
            
          }
          else {
            console.log("No such document!");
          } 
            }}
            initChange(false)
            loadingChange(true)
            sistemKullanicilarChange({ adminler: [...sistemKullanicilar.adminler], danismanlar: [...sistemKullanicilar.danismanlar], antrenorlar: lastIds, kullaniciHistoryCount: [...sistemKullanicilar.kullaniciHistoryCount, ((sistemKullanicilar.adminler.length + sistemKullanicilar.antrenorlar.length + sistemKullanicilar.danismanlar.length) - 1)] });
            loadingChange(false)
            kullanicilarChange(lastDatas);
            initChange(true) 
      }
      else {
       
        await setDoc(doc(db, "SistemKullanici", "sistemKullanicilari"), { adminler: [...sistemKullanicilar.adminler], danismanlar: lastIds, antrenorlar: [...sistemKullanicilar.antrenorlar], kullaniciHistoryCount: [...sistemKullanicilar.kullaniciHistoryCount, ((sistemKullanicilar.adminler.length + sistemKullanicilar.antrenorlar.length + sistemKullanicilar.danismanlar.length) - 1)] });
        console.log("datas => ",datas)
        console.log("datas.antrenorlar => ",datas.antrenorlar)
        if(datas.antrenorlar !== undefined)
        {
          const antrenorId = datas.antrenorlar[0];
          const danismanHedef = datas.hedefler[0];
          console.log("danisman antrenoru => ",antrenorId)
          console.log("danisman hedef => ",danismanHedef) 
        for(let x  = 0 ; x < sistemKullanicilar.antrenorlar.length ; x++ )
      {

         if(sistemKullanicilar.antrenorlar[x] === antrenorId)
       { 
        console.log("sistemKullanicilar.antrenorlar[x] === antrenorId => ",sistemKullanicilar.antrenorlar[x] === antrenorId)

        const  docRef5 = doc(db, "AntrenorDanismanlari",`${sistemKullanicilar.antrenorlar[x]}`);
        const  docSnap5 = await getDoc(docRef5);
        console.log("antrenor danismanlari => ",docSnap5.data())
    if(docSnap5.exists())
    {
       console.log("antrenor = ",sistemKullanicilar.antrenorlar[x],"danismanları  = ",docSnap5.data())
       console.log("docSnap5.data()[0]  = ",docSnap5.data()["0"] )
       console.log("docSnap5.data()[0].type  = ", docSnap5.data()["0"][0].type)
       console.log("docSnap5.data()[0] !== undefined && docSnap5.data()[0][0].type === danismanHedef = ",docSnap5.data()["0"] !== undefined && docSnap5.data()["0"][0].type === danismanHedef)
       if(docSnap5.data()["0"] !== undefined && docSnap5.data()["0"][0].type === danismanHedef)
       {
       console.log("docSnap5.data()[0] !== undefined && docSnap5.data()[0].type === danismanHedef = ",docSnap5.data()["0"] !== undefined && docSnap5.data()["0"][0].type === danismanHedef)
       let  newAntrenorDanisanlar = [];
       let  newAntrenorDanisanlarData = [];
       let  newAntrenorDanisanlarAllDatas = [];
                        for(const td of docSnap5.data()["0"][0].danismanlar)
                        {
                            if(td !== datas.id)
                              {
                              newAntrenorDanisanlar.push(td)
                              }
                        }
                   console.log("before docSnap5.data()[0].danismanlar",docSnap5.data()["0"][0].danismanlar)
                   console.log("after docSnap5.data()[0].danismanlar",newAntrenorDanisanlar)                              
                        newAntrenorDanisanlarData = [{type:danismanHedef,danismanlar:newAntrenorDanisanlar}]
                for(const dtt in docSnap5.data())  
                { 
                   console.log("dtt => ",dtt)
                         if(dtt === "0")
                         {
                            newAntrenorDanisanlarAllDatas.push(newAntrenorDanisanlarData)
                         }
                         else{
                             newAntrenorDanisanlarAllDatas.push(docSnap5.data()[dtt])
                         }
                }
            await setDoc(doc(db,"AntrenorDanismanlari",`${sistemKullanicilar.antrenorlar[x]}`),{...newAntrenorDanisanlarAllDatas})
              break;        
       }
       if(docSnap5.data()["1"] !== undefined && docSnap5.data()["1"][0].type === danismanHedef)
       {
        console.log("docSnap5.data()[1] !== undefined && docSnap5.data()[1].type === danismanHedef = ",docSnap5.data()["1"] !== undefined && docSnap5.data()["1"][0].type === danismanHedef)
        let  newAntrenorDanisanlar = [];
        let  newAntrenorDanisanlarData = [];
        let  newAntrenorDanisanlarAllDatas = [];
                         for(const td of docSnap5.data()["1"][0].danismanlar)
                         {
                             if(td !== datas.id)
                               {
                               newAntrenorDanisanlar.push(td)
                               }
                         }
                    console.log("before docSnap5.data()[1].danismanlar",docSnap5.data()["1"][0].danismanlar)
                    console.log("after docSnap5.data()[1].danismanlar",newAntrenorDanisanlar)                              
                         newAntrenorDanisanlarData = [{type:danismanHedef,danismanlar:newAntrenorDanisanlar}]
                 for(const dtt in docSnap5.data())  
                 { 
                    console.log("dtt => ",dtt)
                          if(dtt === "1")
                          {
                             newAntrenorDanisanlarAllDatas.push(newAntrenorDanisanlarData)
                          }
                          else{
                              newAntrenorDanisanlarAllDatas.push(docSnap5.data()[dtt])
                          }
                 }
             await setDoc(doc(db,"AntrenorDanismanlari",`${sistemKullanicilar.antrenorlar[x]}`),{...newAntrenorDanisanlarAllDatas})
               break;  
            }   
      if(docSnap5.data()["2"] !== undefined && docSnap5.data()["2"][0].type === danismanHedef)
       {
        console.log("docSnap5.data()[2] !== undefined && docSnap5.data()[2].type === danismanHedef = ",docSnap5.data()["2"] !== undefined && docSnap5.data()["2"][0].type === danismanHedef)
        let  newAntrenorDanisanlar = [];
        let  newAntrenorDanisanlarData = [];
        let  newAntrenorDanisanlarAllDatas = [];
                         for(const td of docSnap5.data()["2"][0].danismanlar)
                         {
                             if(td !== datas.id)
                               {
                               newAntrenorDanisanlar.push(td)
                               }
                         }
                    console.log("before docSnap5.data()[2].danismanlar",docSnap5.data()["2"][0].danismanlar)
                    console.log("after docSnap5.data()[2].danismanlar",newAntrenorDanisanlar)                              
                         newAntrenorDanisanlarData = [{type:danismanHedef,danismanlar:newAntrenorDanisanlar}]
                 for(const dtt in docSnap5.data())  
                 { 
                    console.log("dtt => ",dtt)
                          if(dtt === "2")
                          {
                             newAntrenorDanisanlarAllDatas.push(newAntrenorDanisanlarData)
                          }
                          else{
                              newAntrenorDanisanlarAllDatas.push(docSnap5.data()[dtt])
                          }
                 }
             await setDoc(doc(db,"AntrenorDanismanlari",`${sistemKullanicilar.antrenorlar[x]}`),{...newAntrenorDanisanlarAllDatas})
               break;  
       }
     if(docSnap5.data()["3"] !== undefined && docSnap5.data()["3"][0].type === danismanHedef)
       {
        console.log("docSnap5.data()[3] !== undefined && docSnap5.data()[0].type === danismanHedef = ",docSnap5.data()["3"] !== undefined && docSnap5.data()["3"][0].type === danismanHedef)
       let  newAntrenorDanisanlar = [];
       let  newAntrenorDanisanlarData = [];
       let  newAntrenorDanisanlarAllDatas = [];
                        for(const td of docSnap5.data()["3"][0].danismanlar)
                        {
                            if(td !== datas.id)
                              {
                              newAntrenorDanisanlar.push(td)
                              }
                        }
                   console.log("before docSnap5.data()[3].danismanlar",docSnap5.data()["3"][0].danismanlar)
                   console.log("after docSnap5.data()[3].danismanlar",newAntrenorDanisanlar)                              
                        newAntrenorDanisanlarData = [{type:danismanHedef,danismanlar:newAntrenorDanisanlar}]
                for(const dtt in docSnap5.data())  
                { 
                   console.log("dtt => ",dtt)
                         if(dtt === "3")
                         {
                            newAntrenorDanisanlarAllDatas.push(newAntrenorDanisanlarData)
                         }
                         else{
                             newAntrenorDanisanlarAllDatas.push(docSnap5.data()[dtt])
                         }
                }
            await setDoc(doc(db,"AntrenorDanismanlari",`${sistemKullanicilar.antrenorlar[x]}`),{...newAntrenorDanisanlarAllDatas})
              break;  
       }
    }
    else {
      console.log("No such document!");
    } 
  }
}
}
await deleteDoc(doc(db,"DanismanProgramlar",datas.id))
        initChange(false)
        loadingChange(true)
        sistemKullanicilarChange({ adminler: [...sistemKullanicilar.adminler], danismanlar: lastIds, antrenorlar: [...sistemKullanicilar.antrenorlar], kullaniciHistoryCount: [...sistemKullanicilar.kullaniciHistoryCount, ((sistemKullanicilar.adminler.length + sistemKullanicilar.antrenorlar.length + sistemKullanicilar.danismanlar.length) - 1)] })
      if(datas.antrenorlar !== undefined)
       {
         await deleteDoc(doc(db, "DanismanIlerleme",datas.id));
       }
      loadingChange(false)
      kullanicilarChange(lastDatas);
      initChange(true) 

    }
  }
    async function handelDisable(id,disableData) {
      console.log("disableData => ",disableData , "id => ",id)
      const userRef = doc(db, "Users", id);
      await updateDoc(userRef, {
        disable: true
      });

    }
    async function handelUnDisable(id) {
      const userRef = doc(db, "Users", id);
      await updateDoc(userRef, {
        disable: false
      });
    }
    function handelRow(kullanici) {
      let rowTable = [];
      for (let i = 0; i < kullanici.length; i++) {
        console.log("i = ",i ,"kullanici[i] = ",kullanici[i])
        rowTable.push(<tr key={kullanici[i].id}>
          <th scope="row">{i + 1}</th>
          <td>{<img src={kullanici[i].img} className="rounded-circle  align-self-end" style={{ width: "40px", height: "40px" }} />}</td>
          <td>{kullanici[i].kullaniciAd}</td>
          <td>{kullanici[i].kullaniciSoyad}</td>
          <td>{kullanici[i].cinsiyet}</td>
          <td>{kullanici[i].tel}</td>
          <td>{kullanici[i].email}</td>
          <td>{kullanici[i].password}</td>
          <td>{<button className="btn btn-warning btn-sm" onClick={() => handelInfo(kullanici[i].kullaniciAd, kullanici[i])}>Bilgi</button>}</td>
          {props.type === "danisanlar" && <td>
            <button type="button" className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target={`#staticProgramModel${i}`} onClick={async (e) => {
              e.preventDefault();
            }}>
              Programlar
            </button>
            <div className="modal fade" id={`staticProgramModel${i}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`staticProgramModelLabel${i}`} aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id={`staticProgramModelLabel${i}`}>Programlar</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Gormek Istediginiz Programı Seciniz
                  </div>
                  <div className="modal-footer justify-content-center">
                    <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelPlanlar("beslenme", kullanici[i],i,0)}>Beslenme Programı</button>
                    {kullanicilarEgzersizProgramlar[i].egzersizProgram.hedef !== undefined && <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target={`#staticExerciseModel${i}`} >Egzersiz Programı</button>}
                    {kullanicilarEgzersizProgramlar[i].egzersizProgram.hedef === undefined &&  <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={(e) => {
                             e.preventDefault();
                            handelPlanlar("egzersiz",kullanici[i],i,0)
                    }}>Egzersiz Programı</button>}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id={`staticExerciseModel${i}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`staticExerciseModel${i}`} aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id={`staticExerciseModel${i}`}>Egzersiz Programları</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Egzersiz Programını Seciniz
                  </div>
                  <div className="modal-footer justify-content-center">
                         {kullanicilarEgzersizProgramlar[i].egzersizProgram.map((d,index) => {return <button className="btn btn-warning btn-sm" data-bs-dismiss="modal" onClick={() => handelPlanlar("egzersiz",kullanici[i],i,index)}>{index+1}. Egzersiz Program</button>})}
                  </div> 
                </div>
              </div>
            </div>
          </td>}
          <td>{<button className="btn btn-danger btn-sm" onClick={() => handelDisable(kullanici[i].id,kullanici[i].disable)}>Devre Dısı</button>}</td>
          <td>{<button className="btn btn-success btn-sm" onClick={() => handelUnDisable(kullanici[i].id)}>Etkinlestir</button>}</td>
          <td>{<button className="btn btn-danger btn-sm" onClick={() => handelDelete(kullanici[i])}>Sil</button>}</td>
        </tr>)
      }
      return rowTable;
    }
          console.log("kullanicilar => ",kullanicilar)
    return <div className="container-fluid " style={{ backgroundColor: "rgba(256,256,256,0.25)", height: "94.5%", width: "100%" }}>
      <div className="row">
        <div className="col-11">
          <h4 className="text-center">{props.type.toUpperCase()} TABLOSU</h4>
        </div>
        <div className="col-1">
          <button style={{ color: "black", backgroundColor: "transparent", border: "none" }} onClick={() => navigate("/kullanici/admin")}>X</button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col"></th>
                <th scope="col">Isim</th>
                <th scope="col">Soyisim</th>
                <th scope="col">Cinsiyet</th>
                <th scope="col">Telefon</th>
                <th scope="col">E-Posta</th>
                <th scope="col">Sifre</th>
                <th></th>
                {props.type === "danisanlar" && <th></th>}
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {handelRow(kullanicilar)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  }

}