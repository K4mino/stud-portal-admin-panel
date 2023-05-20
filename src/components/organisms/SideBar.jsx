import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Wrapper = styled.div`
    max-width:13vw;
    height:100vh;
    min-width:180px;
    display:flex;
    padding:0 15px;
    justify-content:flex-start;
    flex-direction:column;
    position:fixed;
    background-color:#EDEEF2;
`;

const StyledLink = styled(NavLink)`
    cursor:pointer;
    gap:1.2rem;
    border-radius:22px;
    text-decoration:none;
    background-color:none;
    color:#000000;
    padding:15px 10px;
    font-weight:500;

	&.active{
		background-color:#2E5BF0;
        color:#fff;
		
		& *{
            color:#fff;
        }
	}

    &:hover {
        background-color:#2E5BF0;
        color:#fff;

        & *{
            color:#fff;
        }
    }
`;

const LogOut = styled.div`
    position:absolute;
    bottom:30px;
    left:10%;
    background-color:#1677ff;
    color:#fff;
    padding:8px 10px;
    border-radius:8px;
    border:1px solid #1677ff;
    cursor:pointer;

    &:hover {
      background-color:#fff;
      color:#1677ff;
    }
`;

const SideBar = () => {
    const {dispatch} = useContext(AuthContext);
  return (
    <Wrapper>
        <h1>Admin</h1>
        <StyledLink to='/main'>
            Students
        </StyledLink>
        <StyledLink to='/news'>
            News
        </StyledLink>
        <StyledLink to='/teachers'>
            Teachers
        </StyledLink>
        <StyledLink to='/lessons'>
            Lessons
        </StyledLink>
        <LogOut onClick={()=>dispatch({type:'LOGOUT'})}>Logout</LogOut>
    </Wrapper>
  )
}

export default SideBar