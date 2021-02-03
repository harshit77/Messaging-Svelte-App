<script>
    import {getClient, mutate} from 'svelte-apollo';
    import Queries from '../Query';
    import Textfield from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text';
    import { validateEmail, required } from '../utlis.js';
    import { Container, Row, Col} from 'sveltestrap';
    import Button, { Label } from '@smui/button';
    import Users from '../Users.svelte';
    import Notification from "../Components/Notification.svelte";
    import { danger } from "../store/notificationStore.js"


    const client=getClient();

    let disabled = true;
    let formFields=[{
        fieldName:'username',
        fieldValue:'',
        fieldStatus:true,
        message:'UserName is not correct',
    },
    {
        fieldName:'email',
        fieldValue:'',
        fieldStatus:false,
        message:'Email Address is not correct',
    },
    {
        fieldName:'password',
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
            mutation:Queries.register,
            variables:{
                username:formFields[0].fieldValue,
                email:formFields[1].fieldValue,
                password:formFields[2].fieldValue
            }
        }).then((res)=>{
            console.log("We got the data",res);
            danger(res.data.register.errors[0].message,10000);
        }).catch(error=>{
            danger("vdsjbv",10000);
        });
    }
</script>       

<Container>

<div class="relative">
    <Notification/>
 </div>

    {#each formFields as formField, i}
        <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }} lg={{ size: 5, offset: 3 }} class="form-item-container">
            <Textfield type={Object.values(formField)[0]== 'password' ? 'password': 'text' } label={Object.values(formField)[0]} value={Object.values(formField)[1]} on:input={(e)=>formInputChange(e,Object.values(formField)[0])}/>
            <HelperText validationMsg={Object.values(formField)[2]}>{formField.message}</HelperText>
        </Col>
        </Row>  
    {/each}
    <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }} lg={{ size: 3, offset:4 }} class="form-item-container">
            <Button  on:click={doSomething} variant="raised" color={disabled ? 'secondary': 'primary'} ripple class={disabled ? 'full-width disabled' : 'full-width'} disabled={disabled}>
                <Label>Submit</Label>
            </Button>
        </Col>
    </Row>
</Container>

