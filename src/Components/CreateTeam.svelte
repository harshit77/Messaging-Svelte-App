<script>
    import {getClient, mutate} from 'svelte-apollo';
    import Queries from '../Query';
    import Textfield from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text';
    import { required } from '../utlis.js';
    import { Container, Row, Col} from 'sveltestrap';
    import Button, { Label } from '@smui/button';
    import { danger, success } from "../store/notificationStore.js"
    import { navigate } from 'svelte-routing';
    import Modal from './Modal.svelte';

    const client=getClient();
    export let modal=false;
    let disabled = true;
    let formFields=[
    {
        fieldName:'name',
        fieldValue:'',
        fieldStatus:false,
        message:'Name cannot be blank',
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

    const doSomething=(e) =>{
        mutate(client,{
            mutation:Queries.createTeam,
            variables:{
                name:formFields[0].fieldValue,
            },
            update:(store,{data: {createTeam}})=>{
                    const { ok, id,owner, name,channels }= createTeam;  
                    console.log("upadte occurs",id, owner, name, channels, createTeam);
                    if(!ok)
                        return false;
                    const data=  store.readQuery({query:Queries.teams});
                    console.log("before read",data);
                    data.allTeams.push({id, name, owner, channels,__typename:"Team"});
                    console.log("read data",data);
                    store.writeQuery({query:Queries.teams,data}); 
                }
        }).then((res)=>{
            console.log("We got the data",res);
            const { ok, owner,name }= res.data.createTeam;
            if(ok) {
               console.log('Team created succesfully',owner,name);
                success(`Team ${ name } is Created successfully by ${owner.username} `,10000);           
            } else {
                danger(res.data.login.errors[0].message,10000);
            } 
          
        }).catch(error=>{
            danger("Exception Occurred",10000);
        });
    }
</script>       

<Container>

 <Modal {modal} on:modalClose>
        <div slot="title">
                Add Team
        </div>
            <div slot="content">
                {#each formFields as formField, i}
                <Row>
                    <Col sm="12" md="12" lg="12" class="form-item-container">
                    <Textfield type={Object.values(formField)[0]== 'password' ? 'password': 'text' } label={Object.values(formField)[0]} value={Object.values(formField)[1]} on:input={(e)=>formInputChange(e,Object.values(formField)[0])}/>
                    <HelperText validationMsg={Object.values(formField)[2]}>{formField.message}</HelperText>
                </Col>
                </Row>  
            {/each}
            </div>
            <div slot="actions">
                <Row>
                    <Col sm="12" md="12" lg="12" class="form-item-container">
                        <Button  on:click={doSomething} variant="raised" color={disabled ? 'secondary': 'primary'} ripple class={disabled ? 'full-width disabled' : 'full-width'} disabled={disabled}>
                            <Label>Create Team</Label>
                        </Button>
                    </Col>
                </Row>
            </div>
    </Modal>
</Container>

