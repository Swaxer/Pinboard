import React from "react";
import styled from "styled-components";

class Note extends React.PureComponent {
  render() {
    const Brod =
      "Massor med viktiga noteringar. DIF är bäst. Även Erik Lövgren, vilken jävla CHEF han är." +
      "Massor med viktiga noteringar. DIF är bäst. Även Erik Lövgren, vilken jävla CHEF han är.Massor med viktiga noteringar. DIF är bäst. Även Erik Lövgren, vilken jävla CHEF han är.Massor med viktiga noteringar. DIF är bäst. Även Erik Lövgren, vilken jävla CHEF han är.Massor med viktiga noteringar. DIF är bäst. Även Erik Lövgren, vilken jävla CHEF han är.Massor med viktiga noteringar. DIF är bäst. Även Erik Lövgren, vilken jävla CHEF han är.Massor med viktiga noteringar. DIF är bäst. Även Erik Lövgren, vilken jävla CHEF han är.";
    const Wrapper = styled.div`
      display: flex;
      flex-direction: column;
      padding: 20px 20px 5px 20px;
      height: 200px;
      width: 200px;
      background: #b8d8d8;
      border-radius: 5px;
    `;

    const Heading = styled.span`
      font-weight: 700;
      margin-bottom: 5px;
    `;

    const BodyText = styled.div`
      font-size: 14px;
      max-height: 140px;
      overflow: auto;
      overflow-style: auto;
    `;

    const Date = styled.span`
      position: absolute;
      margin-top: 180px;
      margin-left: 135px;
    `;
    return (
      <Wrapper>
        <Heading>Rubrik</Heading>
        <BodyText>{Brod}</BodyText>
        <Date>12/11-2018</Date>
      </Wrapper>
    );
  }
}
export default Note;