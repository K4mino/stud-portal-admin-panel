import React from 'react'
import styled from 'styled-components'
import SideBar from './organisms/SideBar'

const Wrapper = styled.div`
    display:flex;
    width:100%;
    position:relative;
    gap:30px;
`;

const SideBarWrapper = styled.div`
    min-width:13vw;
    max-width:13vw;
`;

const Layout = ({children}) => {
  return (
    <Wrapper>
      <SideBarWrapper>
        <SideBar/>
      </SideBarWrapper> 
        {children}
    </Wrapper>
  )
}

export default Layout