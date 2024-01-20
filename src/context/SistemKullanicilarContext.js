import { createContext, useState } from "react";
import { doc , getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";

export const SistemKullanicilarContext = createContext();

export function SistemKullanicilarContextProvider (props)
{   
    function handelInit(){
      const initialValue = { user: JSON.parse(localStorage.getItem("currentUser")) || null };
         return initialValue===null ? null :initialValue.user;
    } 
    const [loading,loadingChange] = useState(true)
    const [sistemKullanicilar,sistemKullanicilarChange] = useState(async () => {
          let sistemKullanicilar ;
          const  user = handelInit(); 
           loadingChange(true); 
           let docRef2 ;
           let docSnap2 ;
              docRef2 = doc(db, "SistemKullanici",`sistemKullanicilari`);
              docSnap2 = await getDoc(docRef2);
          if(docSnap2.exists())
          {
            sistemKullanicilar ={...docSnap2.data()};
            sistemKullanicilarChange({...sistemKullanicilar});
             loadingChange(false);
          }
          else {
            console.log("No such document!");
          }}
        );
      console.log("current admin sistem kullanicilar datas => ",sistemKullanicilar);
      console.log("datas is loading => ",loading);
   return <SistemKullanicilarContext.Provider value={{sistemKullanicilar,sistemKullanicilarChange,loading,loadingChange}}>
         {
            props.children
         }
   </SistemKullanicilarContext.Provider>

}