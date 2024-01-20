import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router-dom";
import EntryPage from "./pages/EntryPage";
import LoginPage from "./pages/LoginPage";
import SigninPage from "./pages/SigninPage";
import ErrorPage from "./pages/ErrorPage";
import EntryPageNavBar from "./component/EntryPageNavBar";
import DanismanPageNavBar from "./component/DanismanPageNav";
import DanismanPage from "./pages/DanismanPage";
import DanismanProfilePage from "./pages/DanismanProfilePage";
import SetupAntrenorPage from "./pages/SetupAntrenorPage";
import SetupDanismanPage from "./pages/SetupDanismanPage";
import AntrenorPage from "./pages/AntrenorPage";
import AntrenorPageNaveBar from "./component/AntrenorPageNavBar";
import AntrenorProfilePage from "./pages/AntrenorProfilePage";
import AdminPageNavBar from "./component/AdminPageNaveBar";
import AdminPage from "./pages/AdminPage";
import AdminKullaniciEklePage from "./pages/AdminKullaniciEklePage";
import AdminPageKullanicilarTable from "./component/AdminPageKullaniciTable";
import DanismanInfoPage from "./pages/DanismanInfoPage";
import DanismanAntrenorPage from "./pages/DanismanAntrenorlarPage";
import AntrenorDanismanlarPage from "./pages/AntrenorDanismanlarPage";
import AntrenorInfoPage from "./pages/AntrenorInfoPage";
import DanismanProgramEklePage from "./pages/DanismanProgramEklePage";
import DanismanBeslenmeProgramPage from "./pages/DanismanBeslenmeProgramPage";
import MessagePage from "./pages/MessagePage";
import DanismanEgzersizProgram from "./pages/DanismanEgzersizProgram";

function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPageNavBar />}>
         <Route index element={<EntryPage />} />
      </Route>

      <Route path="/kullanici">

          <Route path="login" element={<LoginPage></LoginPage>} />
          
          <Route path="signin" >
             
              <Route index element={<SigninPage></SigninPage>}></Route>
              <Route path="setupdanisman" element={<SetupDanismanPage></SetupDanismanPage>} > </Route>
              <Route path="setupantrenor" element={<SetupAntrenorPage></SetupAntrenorPage>}> </Route>
         
          </Route>
               
                <Route path="antrenor" element={<AntrenorPageNaveBar></AntrenorPageNaveBar>}>
                  <Route index element={<AntrenorPage></AntrenorPage>}></Route>
                  <Route path="profile" element={<AntrenorProfilePage></AntrenorProfilePage>}> </Route>
                  <Route path="danismanlar">
                   <Route index  element={<AntrenorDanismanlarPage></AntrenorDanismanlarPage>}></Route>
                   <Route path="bilgi" element={<DanismanInfoPage isReadOnly={true}></DanismanInfoPage>}></Route>
                   <Route path="planlar"></Route> 
                  </Route>
                </Route>
               
               <Route path="beslenmeAdd" element={<DanismanProgramEklePage></DanismanProgramEklePage>}></Route>
               <Route path="egzersizAdd" element={<DanismanProgramEklePage></DanismanProgramEklePage>}></Route>
               <Route path="danismanBeslenme" element={<DanismanBeslenmeProgramPage></DanismanBeslenmeProgramPage>}></Route>
               <Route path="danismanEgzersiz" element={<DanismanEgzersizProgram></DanismanEgzersizProgram>}></Route>
               <Route path="message" element={<MessagePage></MessagePage>}> </Route>

               <Route path="danisman"  element={<DanismanPageNavBar></DanismanPageNavBar>}>
                  
                   <Route index element={<DanismanPage></DanismanPage>}></Route>
                   <Route path="profile" element={<DanismanProfilePage></DanismanProfilePage>}/>   
                   <Route path="antrenorler">
                    <Route index element={<DanismanAntrenorPage></DanismanAntrenorPage>}></Route>
                    <Route path="bilgi" element={<AntrenorInfoPage isReadOnly={true}></AntrenorInfoPage>}></Route>
                    </Route>      
              </Route>
              
              <Route path="admin" element={<AdminPageNavBar></AdminPageNavBar>}>
                  <Route index element={<AdminPage></AdminPage>} ></Route>
                  <Route path="kullaniciEkle" element={<AdminKullaniciEklePage></AdminKullaniciEklePage>}/>
                  <Route path="antrenorler" element={<AdminPageKullanicilarTable type="antrenorler"></AdminPageKullanicilarTable>}></Route>
                  <Route path="danisanlar" element={<AdminPageKullanicilarTable type="danisanlar"></AdminPageKullanicilarTable>}></Route>
                  <Route path=":name" element={<DanismanInfoPage isReadOnly={false}> </DanismanInfoPage>}> </Route>
                  <Route path="bilgi" element={<AntrenorInfoPage isReadOnly={false}></AntrenorInfoPage>}></Route>
              </Route>
          
          </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
