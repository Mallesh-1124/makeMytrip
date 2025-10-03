
import React from "react";
import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { ConfirmOtp } from "./ConfirmOtp";
import UserForm from "./UserForm";
import Auth from "../../../auth";
import styled from 'styled-components'
const Style = styled.div`
.loginMain {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 50%;
    margin: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    text-align: left;
  }
  .login-wrap {
    top: 50%;
    left: 50%;
    bottom: 0;
    right: 0;
    width: 480px;
    height: auto;
    min-height: 500px;
    padding: 30px;
    min-width: 450px;
    border-radius: 10px;
    position: fixed;
    z-index: 2;
    background-color: #fff;
    color: black;
    transform: translate(-50%, -50%);
    box-shadow: 0 1px 7px 0 rgb(0 0 0 / 40%);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .close {
    font-size: 20px;
    text-align: right;
  }
  .close > span {
    cursor: pointer;
  }
  
`;
export const LoginPanel = ({ handleClick, handleUser }) => {

  const [otpSend, setOtpSend] = useState(false);
  const [findUser, setFindUser] = useState({});
  const [isUserExist, setIsUserExist] = useState(); //initial existence of user

  useEffect(() => {
    // When a user is found and authenticated, call the parent's handler.
    // This is a side-effect and should be in useEffect to prevent re-render loops.
    if (Auth.isAuthenticated() && isUserExist && findUser.name) {
      handleNewUser(findUser);
    }
  }, [isUserExist, findUser, handleUser]);

  const checkIsUserExist = (mob) => {
    console.log(mob);
    // fetch user from database using mobile number
    // For now, we'll simulate a found user with dummy data.
    // In a real implementation, this fetch might return null if the user isn't found.
    let user = {
      name: "Rahul",
      password: "rahul@123",
    }; //dummy user

    if (user) {
      // If a user is found, we set the user data and flag that the user exists.
      setFindUser(user);
      setIsUserExist(true);
    } else {
      // If no user is found, we flag that the user does not exist,
      // which will trigger the display of the registration form.
      setIsUserExist(false);
    }
  };

  const [state,setState] = useState({
    phone:"",
    hash:"",
    otp:""
  });

  const {phone,hash,otp} = state;
  const value = {phone,hash,otp}

  const handleOtpSend = () => {
    setOtpSend(true);
  };

// handling with user login inputs
    const handleChange = (input)=>(e)=>{

      setState({...state,[input]:e.target.value});
    }
  
    //handling has status
    const hashHandleChange = (hash)=>{
      setState({...state, hash:hash});
    }
    const handleNewUser = (newuser)=>{
    
      handleUser(newuser)
    }

  return (
  <Style>
      <div className="loginMain">
      <div className="login-wrap">
        <div className="close">
          <span onClick={handleClick}>X</span>
        </div>
        {(() => {
          if (Auth.isAuthenticated()) {
            if (isUserExist) {
              // The user is found, parent is notified via useEffect.
              // Render nothing while the login panel likely closes.
              return null;
            }
            // Authenticated but no user profile, show the creation form.
            return <UserForm handleNewUser={handleNewUser} />;
          }
          if (otpSend) {
            return (
              <ConfirmOtp
                handleUserLogin={handleUser} // Changed prop name to handleUserLogin
                handleChange={handleChange} // handling with user login inputs
                value={value}
              />
            );
          }
          return (
            <LoginForm
              handleOtpStatus={handleOtpSend}
              handleChange={handleChange} // handling with user login inputs
              hashHandleChange={hashHandleChange} //handling has status
              value={value}
            />
          );
        })()}
      </div>
    </div>
  </Style>
  );
};
