import "../css/home.css";
import "../css/dashbord.css";
import Sidebar from "../component/admin/sidebar";
import Navbar from "../component/navbar";
import Formlogin from "../component/com-singin/formlogin";
import useToken from "./useToken";
import Dashbord from "./Dashbord";
import { Fragment } from "react";
import Axios from "axios";
import { useState } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

function Transaction(props) {
  const { token, setToken } = useToken();
  const getBtn = document.getElementById("btn-getdata");
  const{userid,setuserid}= useState();
  if (!token) {
    return (
      <Fragment>
        <Navbar></Navbar>
        <Formlogin setToken={setToken} />
      </Fragment>
    );
  }

   

  return (
    <div>

      <h1>{props.prop_userid}</h1>
    </div>
  );
}

export default Transaction;
