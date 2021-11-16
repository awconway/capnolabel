import React from 'react';
import styled from "styled-components"
import ContentLoader from "react-content-loader";
const LoadingSkeleton = styled(ContentLoader)`
    grid-column: 2;
    width: 100%;
`
export default function Loading() {
  return (
    <>
  <LoadingSkeleton 
    width={1200}
    height={400}
    viewBox="0 0 1200 400"
  >
    <rect x="0" y="0" rx="0" ry="0" width="1200" height="400" /> 
  </LoadingSkeleton>
  </>
  );
}