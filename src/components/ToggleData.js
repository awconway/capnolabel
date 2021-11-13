
import React from 'react'
import styled from "styled-components"
import Spacer from './Spacer'

const LabelWrapper = styled.div`
background-color: var(--layoutBg);
color: var(--white);
border: 2px solid var(--white);
padding: 5px;
display: inline-grid;
cursor: pointer;
width: fit-content;
`

const Input = styled.input`
visibility: hidden;
display: none;

&:checked + ${LabelWrapper} {
    &${LabelWrapper} {
        font-style: italic;
        color: var(--layoutBg);
        background-color: var(--white);
    }
    } 
`

export default function Toggle ({ value,  onChange, checked, text }) {
    return(
        <>
    <label >
        <Input type="radio"  value={value} onChange={onChange} checked={checked} />
        <LabelWrapper>
            {text}
        </LabelWrapper>
    </label>
    <Spacer axis="horizontal" size={5} />
    </>

)}