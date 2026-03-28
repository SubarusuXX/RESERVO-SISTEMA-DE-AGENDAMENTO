import { produce } from 'immer';
 import types from './types'


 const INITIAL_STATE = {
    behavior: 'create', //update
    components: {
    drawer: false,
    confirmDelete: false
    } ,
    form : {
        filtering: false,
        disabled: true,
        saving: false,
    },
    clientes: [],
    cliente: '',
    nome: '',
    telefone: '',
    dataNascimento: '',
    sexo: '',
 }

 function cliente(state = INITIAL_STATE,action) {
    switch(action.type){
        case types.UPDATE_CLIENTE: {
            console.log ('update_cliente recebido',action)
            return produce(state, (draft) => {
                
                draft ={ ...draft, ...action.payload }
                return draft;
            })
        }
        default:
            return state;
    }
 }
 
 export default cliente;
