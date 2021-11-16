import React from 'react';
import styled from "styled-components"
import ContentLoader from "react-content-loader";
// const LoadingSkeleton = styled(ContentLoader)`
//     grid-column: 2;
//     width: 100%;
// `
export default function Loading({width, height}) {
  return (
    <>
  <ContentLoader 
    width={width}
    height={height}
    viewBox={`{"0 0 ${width} ${height}"}`}
  >
    <rect x="0" y="0" rx="0" ry="0" width={width} height={height} /> 
  </ContentLoader>
  </>
  );
}