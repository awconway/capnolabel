import React from "react"
import styled from "styled-components"
import TrashIcon from "../images/svg/trash-alt.svg"
import { gapSize } from "../components/Base"

const LabelTableWrapper = styled.div`
position:relative;
height: 600px;
overflow: auto;
padding: 40px;
border-radius:var(--borderRadius);
  &:before {
content: "saved labels";
display: inline-block;
background: var(--layoutBg);
color: var(--white);
padding: 0 0.5rem;
position: absolute;
top: 10px;
right: 40px;
font-size: 0.9rem;
font-weight: bold;
text-transform: uppercase;
}
`
const LabelTable = styled.div`
  display: grid;
  grid-gap: ${gapSize.small};
`
const LabelTableRow = styled.output`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  border: 1px solid;
  padding: 10px;
`

const LabelCol = styled.div`
grid-column: 1 / span 1;
display: flex;
justify-content: left;
align-items: center;

`
const LabelTime = styled.div`
grid-column: 2 / span 1;
display: flex;
justify-content: center;
align-items: center;

`
const LabelDelete = styled.div`
grid-column: 3 / span 1;
justify-self: end;
`
const DeleteButton = styled.button`
display: flex;
justify-content: center;
align-items: center;

padding: 8px 8px;
border-radius: var(--borderRadius);
border: 2px solid var(--layoutBg);

background-color: var(--layoutBg);  
outline-color: var(--layoutBg);

cursor: pointer; 

&:focus {
  outline-offset: 4px;
}
`

const Icon = styled(TrashIcon)`
pointer-events: none;
fill: white;
width:1rem;
height: 1rem;
`

export default function LabelTableComponent({data, handleDelete}) {

    return (
        <LabelTableWrapper>
            <LabelTable>
                {data.labels.map((label, index) => {
                    return (
                        <>
                        <LabelTableRow key={index}>
                            <LabelCol>{label.segmentIndex}</LabelCol>
                            <LabelTime>{label.label}</LabelTime>
                            <LabelDelete>
                                <DeleteButton
                                    name={label.id}
                                    value={label.label}
                                    onClick={handleDelete}
                                >
                                    <Icon />
                                </DeleteButton>
                            </LabelDelete>
                        </LabelTableRow>
                        </>
                    )
                }
                )}
            </LabelTable>
        </LabelTableWrapper>
    )
}