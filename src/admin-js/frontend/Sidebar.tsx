import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigationResources } from 'adminjs';
import styled from 'styled-components';

const Wrapper = styled.section`
  padding: 4em;
  background: #fff;
  transition: all 3s;

  @media (max-width: 768px) {
    transform: translateX(-500px);
  }
`;

const CustomSidebar = (props) => {
  const resources = useSelector((state: any) => state.resources);
  const elements = useNavigationResources(resources);

  return (
    <Wrapper>
      {elements.map((item, index) => (
        <div key={index}>
          <h4>{item.label}</h4>
        </div>
      ))}
      <div>
        <p>My custom sidebar content goes here...</p>
      </div>
    </Wrapper>
  );
};

export default CustomSidebar;
