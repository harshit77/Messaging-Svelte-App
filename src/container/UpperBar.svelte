<script>
  import Paper, {Title} from '@smui/paper';
  import List, {Group, Item, Graphic, Meta, Label} from '@smui/list';
  import Fab, {Icon} from '@smui/fab';
  import { Link } from 'svelte-routing';

  export let activityList;
  export let selectedActivity="Teams";
 
 
</script>

<List class="activity-list" twoLine avatarList singleSelection>
        {#each activityList as item}
        <Link to={item.name=="Chat" ? `user/`: '/'} replace={true}>
            <Item selected={selectedActivity === item.name}>
            <Fab><Icon class="material-icons">{item.type}</Icon></Fab>
             <div class="activity-text">{item.name}</div>   
          </Item>
          </Link>
        {/each}
</List>    