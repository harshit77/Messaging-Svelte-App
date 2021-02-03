<script>
        import {getClient, mutate} from 'svelte-apollo';
        import Queries from '../Query';
        import Textfield from '@smui/textfield';
        import HelperText from '@smui/textfield/helper-text';
        import { validateEmail, required } from '../utlis.js';
        import { Container, Row, Col} from 'sveltestrap';
        import Button, { Label } from '@smui/button';
        import Notification from "../Components/Notification.svelte";
        import { danger } from "../store/notificationStore.js"
        import { navigate } from 'svelte-routing'
    
    
        const client=getClient();
    
        let disabled = true;
        let formFields=[
        {
            fieldName:'Email',
            fieldValue:'',
            fieldStatus:false,
            message:'Email Address is not correct',
        },
        {
            fieldName:'Password',
            fieldValue:'',
            fieldStatus:true,
            message:'Password is not correct',
        }
        ];
      
    
        function formInputChange(e,name){
            const {value}= e.target;
            var operationalIndex= formFields.findIndex(el=> el.fieldName == name);
            if(operationalIndex !==-1 && formFields[operationalIndex].fieldName == 'email') {
                formFields[operationalIndex].fieldStatus=validateEmail(e);
            }
            else if(operationalIndex !==-1 &&  e.target.value!=''){
                formFields[operationalIndex].fieldStatus=true;
            }
            else {
                formFields[operationalIndex].fieldStatus=false;
            }
            formFields[operationalIndex].fieldValue=value;
        }
        $: if(required(formFields)) {
           disabled=false;
       }
       $: if(!required(formFields)) {
           disabled=true;
       }
    
        const doSomething=(e) =>{
            mutate(client,{
                mutation:Queries.login,
                variables:{
                    email:formFields[0].fieldValue,
                    password:formFields[1].fieldValue,
                }
            }).then((res)=>{
                console.log("We got the data",res);
                const { ok, token }= res.data.login;
                if(ok) {
                    localStorage.setItem('token',token);
                    navigate('/',{ replace: true });

                } else {
                    danger(res.data.login.errors[0].message,10000);
                } 
              
            }).catch(error=>{
                danger("Crendentails are not valid",10000);
            });
        }
    </script>       
    
    <div class="bkgLogin centerElement">
    <Col sm="12" lg="3">
        <div class="relative">
            <Notification/>
        </div>
        <div class="loginField">
        {#each formFields as formField, i}
            <div>
                <Col sm="12" md={{ size: 12}} lg={{ size: 12 }} class="form-item-container">
                <Textfield type={Object.values(formField)[0]== 'Password' ? 'password': 'text' } label={Object.values(formField)[0]} value={Object.values(formField)[1]} on:input={(e)=>formInputChange(e,Object.values(formField)[0])}/>
                <HelperText validationMsg={Object.values(formField)[2]}>{formField.message}</HelperText>
            </Col>
        </div>  
        {/each}
            <div>
                <Col sm="12" md={{ size: 12 }} lg={{ size: 12}} class="form-item-container">
                    <Button  on:click={doSomething} variant="raised" color={disabled ? 'secondary': 'primary'} ripple class={disabled ? 'full-width primaryButton disabled' : 'full-width primaryButton'} disabled={disabled}>
                        <Label>Login</Label>
                    </Button>
                </Col>
            </div>
         </div>
        </Col>
    </div>
    
    