import React from 'react';
import styled from "styled-components"
import Spacer from './Spacer'
import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";

const Button = styled(ListboxButton)`
background-color: var(--layoutBg);
color: var(--white);
border: 2px solid var(--white);
padding: 5px;
display: inline-grid;
cursor: pointer;
width: fit-content;
`

const Popover = styled(ListboxPopover)`
background-color: var(--layoutBg);
color: var(--white);
`

export default function Select({ breathingLabels, onChange, defaultValue }) {
  return (
    <>
      <ListboxInput onChange={onChange} required={false} defaultValue={defaultValue} >
        <Button>breathing</Button>
        <Popover>
          <ListboxList>
            {breathingLabels.map(label => {
              return <ListboxOption value={label}>{label}</ListboxOption>
            })}
          </ListboxList>
        </Popover>
      </ListboxInput>
      <Spacer axis="horizontal" size={10} />
    </>
  );
}
