<script>
        import {getClient, mutate, restore} from 'svelte-apollo';
        import Queries from '../Query';
        import Textfield from '@smui/textfield';
        import HelperText from '@smui/textfield/helper-text';
        import { required } from '../utlis.js';
        import { Container, Row, Col} from 'sveltestrap';
        import Modal from './Modal.svelte';
        import Button, { Label } from '@smui/button';
        import { danger, success } from "../store/notificationStore.js"
        import { navigate } from 'svelte-routing';
        import jwt_decode from 'jwt-decode';
    
        export let modal=false;
        export let teamId;
        const client=getClient();
        let disabled = true;
        let formFields=[
        {
            fieldName:'email',
            fieldValue:'',
            fieldStatus:false,
            message:'Email cannot be blank',
        },
        ];
      
        function formInputChange(e,name){
            const {value}= e.target;
            var operationalIndex= formFields.findIndex(el=> el.fieldName == name);
            if(operationalIndex !==-1 &&  e.target.value!=''){
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
    
        const createMember=(e) =>{
            console.log("TeamID",teamId);
            mutate(client,{
                mutation:Queries.createMember,
                variables:{
                    email:formFields[0].fieldValue,
                    teamId: parseInt(teamId)
                },
            }).then((res)=>{
                console.log("We got the data",res);
                const { ok }= res.data.createMember;
                if(ok) {
                   console.log('Member added succesfully');
                   const token=localStorage.getItem('token');
                   const {user:{username}}=jwt_decode(token);
                    success(`Member is added successfully by ${username} `,10000);
       
                } else {
                    danger(res.data.createMember.errors[0].message,10000);
                } 
              
            }).catch(error=>{
                danger("Exception Occurred",10000);
            });
        }
    </script>       
    
    <Container>
    
    <Modal {modal} on:modalClose>
        <div slot="title">
            Add  Member
        </div>
        <div slot="content">
        {#each formFields as formField, i}
            <Row>
                <Col sm="12" md="12" lg="12" class="form-item-container">
                <Textfield type='text' label={Object.values(formField)[0]} value={Object.values(formField)[1]} on:input={(e)=>formInputChange(e,Object.values(formField)[0])}/>
                <HelperText validationMsg={Object.values(formField)[2]}>{formField.message}</HelperText>
            </Col>
            </Row>  
        {/each}
        </div>
        <div slot="actions">
        <Row>
            <Col sm="12" md="12" lg="12" class="form-item-container">
                <Button on:click={createMember} variant="raised" color={disabled ? 'secondary': 'primary'} ripple class={disabled ? 'full-width disabled' : 'full-width'} disabled={disabled}>
                    <Label>Create Mem   ber</Label>
                </Button>
            </Col>
        </Row>
    </div>
    </Modal>
    </Container>
    
    