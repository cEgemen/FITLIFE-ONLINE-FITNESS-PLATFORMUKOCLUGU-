import { createContext, useState } from "react";
import { doc , getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";

export const IlerlemeContext = createContext();

export function IlerlemeContextProvider (props)
{   
    function handelInit(){
      const initialValue = { user: JSON.parse(localStorage.getItem("currentUser")) || null };
         return initialValue === null ? null : initialValue.user;
    } 
    const [loading,loadingChange] = useState(true)
    const [ilerleme,ilerlemeChange] = useState(async () => {
          let ilerlemeData ;
          const  user = handelInit();
           if(user !== null)
          { console.log("ilerleme context is started",user.id)
           let docRef2 ;
           let docSnap2 ;
             if(user.type === "Danisman")
          {
              docRef2 = doc(db, "DanismanIlerleme",`${user.id}`);
              docSnap2 = await getDoc(docRef2);
          if(docSnap2.exists())
          {
            ilerlemeData ={...docSnap2.data()};
            ilerlemeChange({...ilerlemeData});
             loadingChange(false);
          }
          else {
            console.log("No such document!");
          }} }
         });
      console.log("current Danisman ilerleme datas => ",ilerleme);
      console.log("datas is loading => ",loading);
   return <IlerlemeContext.Provider value={{ilerleme,ilerlemeChange,loading,loadingChange}}>
         {
            props.children
         }
   </IlerlemeContext.Provider>

}