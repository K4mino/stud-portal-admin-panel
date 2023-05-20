import React from 'react'
import {  Navigate, Route, Routes} from 'react-router-dom';
import Main from '../components/pages/Main';
import FormPage from '../components/pages/FormPage';
import Update from '../components/pages/Update';
import AddLesson from '../components/pages/AddLesson';
import UpdateLesson from '../components/pages/UpdateLesson';
import AddTask from '../components/pages/AddTask';
import MainNews from '../components/pages/MainNews';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MainTeachers from '../components/pages/MainTeachers';
import Lessons from '../components/pages/Lessons';


const CustomRoutes = () => {
    const {currentUser} = useContext(AuthContext);
    const Protected = ({children}) => {
        return currentUser ? children : <Navigate to='/'/>
    }
  return (
    <Routes>
        <Route element={<FormPage/>}
            path='/'/>
        <Route element={<Protected><Main/></Protected>}
            path='/main'/>
        <Route element={<Protected><MainNews/></Protected>}
            path='/news'/>
        <Route element={<Protected><MainTeachers/></Protected>}
            path='/teachers'/>
        <Route element={<Protected><Lessons/></Protected>}
            path='/lessons'/>
        <Route element={<Protected><Update/></Protected>}
            path='/main/update/:id'/>
        <Route element={<Protected><AddLesson/></Protected>}
            path='/main/update/:id/addlesson'/>
        <Route element={<Protected><UpdateLesson/></Protected>}
            path='/lessons/update/:lessonId'/>
        <Route element={<Protected><AddTask/></Protected>}
            path='/main/update/:id/:lessonId/addtask'/>
        <Route element={<Protected><Update/></Protected>}
            path='/teachers/update/:id'/>
        <Route element={<Protected><AddLesson/></Protected>}
            path='/teachers/update/:id/addlesson'/>
    </Routes>
  )
}

export default CustomRoutes