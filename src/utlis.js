import jwt_decode from 'jwt-decode';

export function validateEmail(e) 
{   
    if (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(e.target.value))
        return true;
    return false;        
}
export function required(formFields) {
  return formFields.some(formField=> formField.fieldStatus == false) ? false : true;
}

export const isLoggedIn=()=>{
  const token=localStorage.getItem('token');
  if(token) {
    const user= jwt_decode(token);
    console.log(user);
    return user;
  }
}

export const logOut=()=>{
  localStorage.removeItem('token');
  window.location.href="/";
}