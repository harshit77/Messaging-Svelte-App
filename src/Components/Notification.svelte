<script>
    import { notification } from '../store/notificationStore.js';
    import {onMount,onDestroy} from 'svelte';
    let count=0;
    let toasts=[];
    export let timeout=14000;
    export let themes = {
		danger: '#bb2124',
		success: '#22bb33',
		warning: '#f0ad4e',
		info: '#5bc0de',
		default: '#aaaaaa'
    }
    function createToast(msg,theme,to) {
        const background=themes[theme] || theme['default'];
         toasts=[{
            id:count,
            msg, 
			background, 
			timeout: to || timeout,
			width: '100%'
        },...toasts];
        count=count+1;
    }

    function removeToast (id) { 
		toasts = toasts.filter(t => t.id != id)
    };
    function animateOut(node, { delay = 0, duration = 300 }) {
		return {
			delay,
			duration,
			css: t => `opacity: ${(t-.5) * 1}; transform-origin: top right; transform: scaleX(${(t-.5)*1});`
		}
    }

$: if($notification) {
    createToast($notification.message,$notification.type,$notification.timeout)
}

</script>



<ul class="toasts">
        {#each toasts as toast (toast.id)}
            <li class="toast" style="background: {toast.background};" out:animateOut>
                <div class="content">
                    {toast.msg}
                </div>
                <div 
            class="progress" 
            style="animation-duration: {toast.timeout}ms;"
            on:animationend={() => removeToast(toast.id) }>
                </div>
            </li>	
        {/each}
    </ul>
    <style>
            :global(.toasts) {
                list-style: none;
                position: fixed;
                top: 0;
                right: 0;
                padding: 0;
                margin: 0;
                z-index: 9999;
            }
            
            :global(.toasts) > .toast {
                position: relative;
                margin: 10px;
                width: 300px;
                position: relative;
                animation: animate-in 350ms forwards;
                color: #fff;
            }
            
            :global(.toasts) > .toast > .content {
                padding: 10px;
                display: block;
                font-weight: 500;
            }
            
            :global(.toasts) > .toast > .progress {
                position: absolute;
                bottom: 0;
                background-color: rgb(0, 0, 0, 0.3);
                height: 6px;
            width: 100%;
              animation-name: shrink;
              animation-timing-function: linear;
              animation-fill-mode: forwards;
            }
            
            :global(.toasts) > .toast:before,
            :global(.toasts) > .toast:after {
                    content:"";
                    position:absolute;
                    z-index:-1;
                    top:50%;
                    bottom:0;
                    left:10px;
                    right:10px;
                    border-radius:100px / 10px;
            }
            
            :global(.toasts) > .toast:after {
                    right:10px;
                    left:auto;
                    transform:skew(8deg) rotate(3deg);
            }
            
            @keyframes animate-in { 
                0% { 
                    width: 0; 
                    opacity: 0; 
                    transform: scale(1.15) translateY(20px);
                }
                100% { 
                    width: 300px;
                    opacity: 1; 
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes shrink { 
                0% { 
                    width: 300px; 
                }
                100% { 
                    width: 0; 
                }
            }
            
        </style>