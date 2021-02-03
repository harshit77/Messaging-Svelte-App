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
        export let currentTeam;
        const client=getClient();
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
    
        const createChannel=(e) =>{
            mutate(client,{
                mutation:Queries.createChannel,
                variables:{
                    name:formFields[0].fieldValue,
                },
                update:(store,{data: {createChannel}})=>{
                    const { ok, channel }= createChannel;  
                    console.log("upadte occurs",ok,channel,currentTeam.id);
                    if(!ok)
                        return false;
                    const data=  store.readQuery({query:Queries.teams});
                    const teamIndex=data.allTeams.findIndex(team=>team.id==currentTeam.id);
                    data.allTeams[teamIndex].channels.push(channel);
                    store.writeQuery({query:Queries.teams,data}); 
                }
            }).then((res)=>{
                console.log("We got the data Create channel METHOD",res);
                const { ok, channel }= res.data.createChannel;
                if(ok) {
                   console.log('Channel created succesfully',name);
                   const token=localStorage.getItem('token');
                   const {user:{username}}=jwt_decode(token);
                   console.log(username);
                    success(`Channel ${ channel.name } is Created successfully by ${username} `,10000);
                    setTimeout(()=>{
                        navigate('/',{replace:true});
                    },100000000);          
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
            Add Channel
        </div>
        <div slot="content">
        {#each formFields as formField, i}
            <Row>
                <Col sm="12" md={{ size: 12}} lg={{ size: 12 }} class="form-item-container">
                <Textfield type='text' label={Object.values(formField)[0]} value={Object.values(formField)[1]} on:input={(e)=>formInputChange(e,Object.values(formField)[0])}/>
                <HelperText validationMsg={Object.values(formField)[2]}>{formField.message}</HelperText>
            </Col>
            </Row>  
        {/each}
        </div>
        <div slot="actions">
        <Row>
            <Col sm="12" md={{ size: 12 }} lg={{ size: 12 }} class="form-item-container">
                <Button on:click={createChannel} variant="raised" color={disabled ? 'secondary': 'primary'} ripple class={disabled ? 'full-width disabled' : 'full-width'} disabled={disabled}>
                    <Label>Create Channel</Label>
                </Button>
            </Col>
        </Row>
    </div>
    </Modal>
    </Container>
    
    