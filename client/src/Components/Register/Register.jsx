import { Form } from "formik";
import React from "react";
import "./Register.css";


const Register = () => {
  return (
    <div>
      <div class="flex">
        {}
        
        <div class="">
          <img
            src="https://www.jordanharbinger.com/wp-content/uploads/2021/08/skillshare-350x250.png"
            alt="Cooking Hub Logo"
          />

          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
