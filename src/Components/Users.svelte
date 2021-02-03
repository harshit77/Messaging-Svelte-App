<script>
        import { Link } from 'svelte-routing';
        import List, {Group, Item,Text,PrimaryText, Graphic} from '@smui/list';
        import Paper, {Title} from '@smui/paper';
        export let currentUser;
        export let users=[];
        console.log("fdsgvdsvdsbvdsbs",users,currentUser)
    </script>
    <Paper square class="team-title">
        <Title>Chat</Title>
    </Paper>
    <List class="user-list" twoLine avatarList singleSelection>
            {#each users as item}
              <Link to={`user/${item.id}`} replace={true}>
                <Item  selected={currentUser.id === item.id}>
                <Graphic class="team-graphic">{item.username.split(' ').map(val=> val.substring(0,1)).join('').substring(0,2).toUpperCase()}</Graphic>
                <Text>
                    <PrimaryText>{item.username}</PrimaryText>
                </Text>
                 </Item>
            </Link> 
            {/each}
    </List>    