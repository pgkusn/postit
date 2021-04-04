<template>
    <div
        class="note"
        v-for="(note, index) in notes"
        :key="note.id"
        @mousedown="mousedownHandler(index)"
        @mousedown.right="mouseupHandler"
        @mouseup="mouseupHandler"
        :style="noteStyle(note)"
    >
        <p>{{ note.text }}</p>
        <div class="controller">
            <input type="color" v-model="note.color">
            <span class="material-icons" @click="deleteNote(index)">close</span>
        </div>
    </div>

    <ul class="datalist">
        <li class="addPost" @click="addNote">Add PostIt +</li>
        <li v-for="note in notes" :key="note.id">
            <h3 class="title">{{ note.text || 'empty' }}</h3>
            <textarea v-model="note.text" v-focus></textarea>
        </li>
    </ul>
</template>

<script>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import notesData from '@/notes.json';

export default {
    name: 'App',
    setup () {
        const store = useStore();

        const notes = ref(notesData);
        const currentNote = {
            index: null,
            offsetX: null,
            offsetY: null
        };
        let isMouseDown = false;
        const mousedownHandler = index => {
            if (event.target.parentElement.className === 'controller') return;
            currentNote.index = index;
            currentNote.offsetX = event.offsetX;
            currentNote.offsetY = event.offsetY;
            isMouseDown = true;
        };
        const mouseupHandler = () => {
            isMouseDown = false;
        };
        const mousemoveHandler = () => {
            if (!isMouseDown) return;
            notes.value[currentNote.index].x = event.pageX - currentNote.offsetX;
            notes.value[currentNote.index].y = event.pageY - currentNote.offsetY;
        };
        const noteStyle = note => ({
            left: `${note.x}px`,
            top: `${note.y}px`,
            'z-index': note.id,
            'background-color': note.color
        });
        const addNote = () => {
            notes.value.push({
                id: notes.value.length + 1,
                x: window.innerWidth / 2 - 100,
                y: window.innerHeight / 2 - 100,
                text: '',
                color: '#ffffaa'
            });
        };
        const deleteNote = index => {
            notes.value.splice(index, 1);
        };
        onMounted(async () => {
            const notesData = await store.dispatch('getNotes');
            if (notesData.length) {
                notes.value = notesData;
            }

            watch(notes, value => {
                notes.value = value;
                store.dispatch('setNotes', notes.value);
            }, { deep: true });

            document.addEventListener('mousemove', mousemoveHandler);
            document.addEventListener('mouseleave', mouseupHandler);
        });
        onBeforeUnmount(() => {
            document.removeEventListener('mousemove', mousemoveHandler);
            document.removeEventListener('mouseleave', mouseupHandler);
        });
        return {
            notes,
            mousedownHandler,
            mouseupHandler,
            noteStyle,
            addNote,
            deleteNote
        };
    }
};
</script>

<style>
body {
    background-color: #3E3A39;
}
.note {
    position: absolute;
    display: flex;
    width: 200px;
    height: 200px;
    font-size: 2rem;
    justify-content: center;
    align-items: center;
}
.note > p {
    pointer-events: none;
}
.controller {
    position: absolute;
    top: .5rem;
    left: .5rem;
    right: .5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.controller > * {
    cursor: pointer;
}
.datalist {
  overflow-y: scroll;
  position: fixed;
  right: 20px;
  top: 20px;
  width: 20%;
  height: 60%;
  max-width: 300px;
  min-width: 200px;
  padding: 10px;
  border: solid 1px white;
}
.datalist li {
  border-bottom: solid 1px rgba(255, 255, 255, 0.3);
  min-height: 30px;
  padding: 5px 10px;
}
.datalist li input {
  border: none;
  border: solid 1px;
  font-size: 16px;
  padding: 2px 10px;
  letter-spacing: 2px;
}
.datalist li.addPost {
  color: white;
  display: flex;
  align-items: center;
  transition: 0.5s;
  cursor: pointer;
}
.datalist li.addPost:hover {
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
}
.datalist .title {
  color: white;
  margin-bottom: 10px;
}
.datalist i {
  color: white;
  cursor: pointer;
  float: right;
}
</style>
