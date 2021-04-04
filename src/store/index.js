import { createStore } from 'vuex';
import LS from '@/localStorage';

export default createStore({
    state: {
    },
    mutations: {
    },
    actions: {
        getNotes () {
            return LS.get('notes');
        },
        setNotes (context, notes) {
            LS.set('notes', notes);
        }
    },
    modules: {
    }
});
