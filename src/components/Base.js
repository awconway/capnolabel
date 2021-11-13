import styled from "styled-components"


export const gapSize = {
    small: "16px",
    medium: "32px",
    large: "64px"
}


export const H2 = styled.h2`
    font-weight: 700;
    font-size: 3rem;
    text-align: center;
`
export const H3 = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 2rem;

`

export const ArticleWrapper = styled.article`
     //layout in section
     grid-column: 2;
    //layout of article
    display: grid;
    grid-row-gap: ${gapSize.medium};
`