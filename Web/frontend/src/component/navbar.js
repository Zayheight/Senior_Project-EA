import React, { Component } from 'react';
import '../css/navbar.css';
import { Link,useMatch, useResolvedPath } from "react-router-dom"
import useToken from '../page/useToken';
function logout(){
    sessionStorage.removeItem('token');
    window.location.reload(false);
}

function Navbar(){
    const { token, setToken } = useToken();
    
    if(!token) {
        return(
            <header id="header" >
            <a className="navlogo"> Logo </a>
            <nav className="navbar" >
                    <ul>
                        <li>
                            <Link to="/" >Home</Link>
                        </li>
                        <li >
                            <Link to="/About" >About</Link>
                        </li>
                        <li >
                            <Link  class="createbtn " to="/EaProduct" >EA PRODUCT</Link>
                        </li>
                        <li>
                            <Link to="/Signin" >SIGN IN </Link> 
                        </li>
                        
                    </ul>
                </nav>
            </header> 
        );
    }else{
        var str1=sessionStorage.getItem('token').replace(/(")/,"");
        var str2= str1.replace(/(")/,"");
        //console.log(str2);
        if(str2=="admin"){
            return (
                <header id="header" >
                <a className="navlogo"> Logo </a>
                <nav className="navbar" >
                        <ul>
                            {/* <li>
                                <Link to="/Summary" class="">Summary</Link>
                            </li> */}
                            <li>
                                <Link onClick={logout}> Logout</Link>
                            </li>
                            
                        </ul>
                    </nav>
                </header>
            )
        }
        else{
            return (
                <header id="header" >
                <a className="navlogo"> Logo </a>
                <nav className="navbar" >
                        <ul>
                            <li>
                                <Link to="/" >Home</Link>
                            </li>
                            <li >
                                <Link to="/About" >About</Link>
                            </li>
                            <li >
                                <Link  className="createbtn " to="/EaProduct" >EA PRODUCT</Link>
                            </li>
                            <li>
                                <Link onClick={logout}> Logout</Link>
                            </li>
                            
                        </ul>
                    </nav>
                </header>
            )
        }
    }
}
export default Navbar;
