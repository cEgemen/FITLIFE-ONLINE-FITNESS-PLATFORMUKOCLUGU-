import { db } from "../firebase/firebaseInit";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import InputState from "../InputState";
import entry3 from "../images/entry3.jpg";
import "../styles/EntryPage.css";
import React, { useState, useContext } from "react";
import { IlerlemeContext } from "../context/IlerlemeContext";
import { SistemKullanicilarContext } from "../context/SistemKullanicilarContext";

export default function SetupDanismanPage() {
  const { ilerlemeChange, loadingChange } = useContext(IlerlemeContext);
  const { sistemKullanicilar } = useContext(SistemKullanicilarContext)
  const [atamaLoading, atamaLoadingChange] = useState(false);
  console.log("ilerlemeChange", ilerlemeChange)
  const navigate = useNavigate();
  const datas = useLocation().state;
  const [boy, boyChange, boyReset] = InputState("160");
  const [kilo, kiloChange, kiloReset] = InputState("60");
  const [yag, yagChange, yagReset] = InputState("10");
  const [hedefler, hedeflerChange] = useState([false, false, false, false])
  let hedeflerName = ["Kilo Verme", "Kilo Alma", "Kilo Koruma", "Kas Kazanma"];
  const [hedeflerIsmi, hedeflerIsmiChange] = useState([]);
  const [toast, toastChange] = useState(false)
  const handelSetup = async e => {
    e.preventDefault();
    if (hedeflerIsmi.length === 0) {
      toastChange(!toast);
    }
    else {
      console.log("danismanData id", datas);
      const k = +kilo;
      console.log("kilo", k);
      const b = +boy;
      console.log("boy", b);
      const y = +yag;
      const kütleIndex = (((k) / (b * b)) * 10000).toFixed(2);
      console.log("kütleIndex", kütleIndex);
      const kas = k * (1 - (y / 100));
      console.log("kas kütle", kas);

     atamaLoadingChange(true); 
      const hedefCount = hedeflerIsmi.length;
      let atananAntrenorlar = [];
      for (const hedef of hedeflerIsmi) {
        for (const antrenorId of sistemKullanicilar.antrenorlar) {
          let anteronerDanismanSayisi = 0;
          let isDone = false;
          const docRef2 = doc(db, "AntrenorDanismanlari", antrenorId);
          const docSnap2 = await getDoc(docRef2);
          if (docSnap2.exists()) {
            const antrenorData = docSnap2.data();
            console.log("antrenorData => ", antrenorData);
            for (const data in antrenorData) {
              console.log("data ==> ", data);
              console.log("antrenorData[data][0] ==> ", antrenorData[data][0]);
              console.log("antrenorData[data][0][type] ==> ", antrenorData[data][0]["type"]);
              console.log("antrenorData[data][0][danismanlar] ==> ", antrenorData[data][0]["danismanlar"]);
              console.log("antrenorData[data][0][danismanlar].length ==> ", antrenorData[data][0]["danismanlar"].length);
              anteronerDanismanSayisi += antrenorData[data][0]["danismanlar"].length;
            }
            console.log("antrenor danisman sayisi => ", anteronerDanismanSayisi)
            if (anteronerDanismanSayisi < 5) {
              for (const data in antrenorData) {
                console.log("hedef ismi ==> ", hedef);
                console.log("antrenor type ==> ", antrenorData[data][0]["type"]);
                if (antrenorData[data][0]["type"] === hedef) {
                  const antrenorNewData = [{ type: `${hedef}`, danismanlar: [...antrenorData[data][0]["danismanlar"], datas.id] }]
                  console.log("before antrenorData ==> ", antrenorData)
                  let antrenorUzmanlıkData = [];
                  for (const x in antrenorData) {
                    console.log("antrenor data x ==> ", x)
                    if (data === x) {
                          antrenorUzmanlıkData.push(antrenorNewData)
                    }
                    else {
                       antrenorUzmanlıkData.push(antrenorData[x])
                    }

                  }
                  console.log("after antrenorNewData ==> ",{...antrenorUzmanlıkData})
                  await setDoc(doc(db, "AntrenorDanismanlari", antrenorId), {...antrenorUzmanlıkData});
                  atananAntrenorlar.push(antrenorId)
                  isDone = true;
                }
              }
            }
            if (isDone) {
              break;
            }
          }
          else {
            console.log("No such document!");
          }
        }
      }
      if (atananAntrenorlar.length !== hedefCount) {
        console.log("hedef count : ", hedefCount)
        console.log("atanan antrenorlar : ", atananAntrenorlar)
        console.log("hedefler tam eşleşmedi ya da hedefe uygun antrenor bulunmadı")
      }
      loadingChange(true);
      await setDoc(doc(db, "Users", datas.id), { ...datas, disable: false, boy: boy, kilo: kilo, yag: yag, kas: kas, kütleIndex: kütleIndex, hedefler: hedeflerIsmi, antrenorlar: atananAntrenorlar });
      await setDoc(doc(db, "DanismanIlerleme", datas.id), { boy: [b], kilo: [k], yag: [y], kas: [kas], kütleIndex: [+kütleIndex], kalori: [0], hedefler: hedeflerIsmi });
      let iler = { ...{ boy: [b], kilo: [k], yag: [y], kas: [kas], kütleIndex: [+kütleIndex], kalori: [0], hedefler: hedeflerIsmi } };
      ilerlemeChange({ ...iler });
      loadingChange(false);
      console.log("setup danisman ilerleme", iler);
      navigate("/kullanici/danisman", { state: { ...datas, ...iler } });
    }
  }

  const handleCheckBoxChange = (index) => {
    if(hedeflerIsmi.length < 1 || hedefler[index] === true)
    {let newArray = [];
    let newHedeflerIsimArray = [];
    for (let i = 0; i < 4; i++) {
      if (index === i) {
        newArray.push(!hedefler[i]);
      }
      else {
        newArray.push(hedefler[i]);
      }
    }
    hedeflerChange(newArray);
    for (let i = 0; i < 4; i++) {
      if (newArray[i] === true) {
        newHedeflerIsimArray.push(hedeflerName[i]);
      }
    }
    hedeflerIsmiChange(newHedeflerIsimArray);
    console.log(newHedeflerIsimArray);
    console.log(newArray);}
  }
  if (atamaLoading) {
    return <div className="body" style={{ background: `url(${entry3})`, backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}>
      {
        <div className='container '>
          {<div className='row justify-content-center'>
            <div className='col-6 ' style={{ marginTop: "12%", marginLeft: "20%" }}>
              <h4 style={{ display: "inline", color: "white" }}>DANISMAN ATANIYOR</h4>
              <div className="spinner-grow spinner-grow-sm" style={{ color: "white" }} role="status">
                <span className="visually-hidden">DANISMAN ATANIYOR...</span>
              </div>
              <div className="spinner-grow spinner-grow-sm " style={{ color: "white" }} role="status">
                <span className="visually-hidden">DANISMAN ATANIYOR...</span>
              </div>
              <div className="spinner-grow spinner-grow-sm " style={{ color: "white" }} role="status">
                <span className="visually-hidden">DANISMAN ATANIYOR...</span>
              </div>
            </div>
          </div>}
        </div>
      }

    </div>
  }
  else {
    return <div className="body" style={{ background: `url(${entry3})`, backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}>
      <div className="container-fluid " style={{ backgroundColor: "rgba(0,0,0,0.6)", height: "100%", width: "100%" }}>
        <div className="row ">
          <div className="col">
            <h4 className="display-5 text-center page-title " style={{ color: "white" }} >DANISMAN HEDEF VE BILGI FORM</h4>
          </div>
        </div>
        <form>
          <div className="row mt-3 mb-2 justify-content-center">
            <div className="col-md-3">
              <label htmlFor="kilo">Kilo (kg)</label>
              <input className="form-control" id="kilo" type="text" value={kilo} onChange={kiloChange} />
            </div>
            <div className="col-md-3">
              <label htmlFor="boy">Boy (cm) </label>
              <input className="form-control" id="boy" type="text" value={boy} onChange={boyChange} />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <label htmlFor="yag">Yag (%)</label>
              <input className="form-control" id="yag" type="text" value={yag} onChange={yagChange} />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-6" >
              <div className="form-check">
                <h5 className="display-5 " style={{ color: "white" }}>Hedef</h5>
                <input className="form-check-input" type="checkbox" value={hedefler[0]} id="flexCheckDefault" checked={hedefler[0]} onChange={() => handleCheckBoxChange(0)} />
                <label className="form-check-label" style={{ color: "white" }} htmlFor="flexCheckDefault">
                  Kilo Verme
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={hedefler[1]} onChange={() => handleCheckBoxChange(1)} />
                <label className="form-check-label" style={{ color: "white" }} htmlFor="flexCheckChecked">
                  Kilo Alma
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked={hedefler[2]} onChange={() => handleCheckBoxChange(2)} />
                <label className="form-check-label" style={{ color: "white" }} htmlFor="flexCheckDefault">
                  Kilo koruma
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={hedefler[3]} onChange={() => handleCheckBoxChange(3)} />
                <label className="form-check-label" style={{ color: "white" }} htmlFor="flexCheckChecked">
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
        <div className="row justify-content-center " style={{ marginTop: "20px" }}>
          <div className="col-6" style={{ color: "red", textAlign: "center" }}>
            <span>{toast && "En Az Bir Hedef Seciniz"}</span>
            <button onClick={() => { toastChange(!toast) }} style={{ borderColor: "transparent", backgroundColor: "transparent", display: toast || "none", color: "white", marginLeft: "20px" }}>X</button>
          </div>
        </div>
      </div>
    </div>

  }
}