import React from "react";
import "./App.css";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";
import {listTodos} from './graphql/queries';
import { updateTodo } from './graphql/mutations';

import { useState } from 'react';
import { useEffect } from 'react';

import { Paper, IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavoriteIcon from '@material-ui/icons/Favorite';

Amplify.configure(awsconfig);

function App() {
  const [Todos, setToDos] = useState([]);

  useEffect(() => {
    fetchToDo();
  }, [])

  const fetchToDo = async () => {
    try{
        const toDoData = await API.graphql(graphqlOperation(listTodos));
        const toDoList = toDoData.data.listTodos.items;
        console.log("list", toDoList);
        setToDos(toDoList);
    } catch (error){
      console.log('error on fetching songs', error);
    }
  }

  const addLike = async idx => {
    try {
        const song = Todos[idx];
        song.like = song.like + 1;
        delete song.createdAt;
        delete song.updatedAt;

        const toDoData = await API.graphql(graphqlOperation(updateTodo, { input: song }));
        const toDoList = [...Todos];
        toDoList[idx] = toDoData.data.updateTodo;
        setToDos(toDoList);
    } catch (error) {
        console.log('error on adding Like to song', error);
    }
};
  return (
    <div className="App">
      <header className="App-header">
        <AmplifySignOut />
        <h2>My Amplify POC</h2>
      </header>
      <div className="songList">
                {Todos.map((song, idx) => {
                    return (
                        <Paper variant="outlined" elevation={2} key={`song${idx}`}>
                            <div className="songCard">
                                <IconButton aria-label="play">
                                    <PlayArrowIcon />
                                </IconButton>
                                <div className="titleWidth">
                                    <div className="songTitle">{song.title}</div>
                                    <div className="songOwner">{song.owner}</div>
                                </div>
                                <div>
                                    <IconButton aria-label="like" onClick={() => addLike(idx)}>
                                        <FavoriteIcon className="favIcon" />
                                    </IconButton>
                                    {song.like}
                                </div>
                                <div className="songDescription">{song.description}</div>
                            </div>
                        </Paper>
                    );
                })}
            </div>
    </div>
  );
}

export default withAuthenticator(App);
