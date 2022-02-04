import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useAuth0 } from "@auth0/auth0-react"
import { ArticleWrapper, gapSize } from "./Base"
import { op, from } from 'arquero'
import LinePlot from "./linePlot"
import LabelTableComponent from "./LabelTable";
import Modal from "./Modal";
import { gql, useQuery, useMutation } from "@apollo/client";
import Button from "../components/Button"
import Toggle from "./ToggleData";
import Spacer from "./Spacer"
import Loading from "./Loading";
import { useWindowSize } from "@reach/window-size";
import { isMobile } from "react-device-detect"
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import "@reach/tabs/styles.css";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
} from "@reach/accordion";
import "@reach/accordion/styles.css";
import SaveIcon from "../images/svg/save.svg"
import TagsIcon from "../images/svg/tags.svg"

const Save = styled(SaveIcon)`
    width:1.5rem;
    height: 1.5rem;
    display: block;
    grid-column: 1;
    fill: var(--layoutBg);
`
const Tags = styled(TagsIcon)`
    width:1.5rem;
    height: 1.5rem;
    display: block;
    grid-column: 1;
    fill: var(--layoutBg);
`

const IconButtonLayout = styled.div`
    display: flex;
    gap: 20px;
`

const Section = styled.section`
    display: grid;
    grid-template-columns: 1fr min(60ch, calc(100% - ${gapSize.large})) 1fr;
    grid-gap: ${gapSize.small} ${gapSize.medium};  
`

const QUERY = gql`
query {
  labels(order_by: {segmentIndex: desc}) {
    id
    label
    pid
    segment
    user_id
    segmentIndex
  }
}
`

const MUTATION = gql`
mutation labelsMutation(
  $user_id: String = ""
  $label: String = ""
  $segment: Int
  $segmentIndex: Int
  $pid: String = ""
) {
  insert_labels(objects: {
    label: $label, 
    pid: $pid, 
    segment: $segment, 
    segmentIndex: $segmentIndex, 
    user_id: $user_id
}) {
    returning {
      id,
      label,
      pid,
      segment,
      segmentIndex,
      user_id,
    }
  }
}
`
const DELETE_ROW = gql`
mutation removeLabel ($id: uuid!) {
    delete_labels(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`

const ModalButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    `

const ModalMessage = styled.div`
    padding: 10px 0px;
    `

const WaveformSelectorCol = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const WaveformSelectorLabel = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // flex-wrap: wrap;
    // gap: 10px;
`
const ExamplesWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
`

const AccordionWrapper = styled(Accordion)`
    display: grid;
    grid-gap: 10px;
`

const StyledAccordionButton = styled(AccordionButton)`
    width: 100%;
    padding: 10px;
    cursor: pointer;
    border: none;
`

const StyledTabList = styled(TabList)`
    display: flex;
    flex-wrap: wrap;
   
`
const StyledTab = styled(Tab)`
    &:not(:last-of-type) {
        &:after {
        content: " | "
    }
    }
`

export default function App() {
    const { user, isAuthenticated } = useAuth0()

    const { loading, error, data } = useQuery(QUERY);

    //runs when the data changes
    useEffect(() => {
        if (data) {
            data.labels.length !== 0 ? setSegmentIndex(data.labels.map(label => label.segmentIndex)[0] + 1) : setSegmentIndex(1);
        }
    }, [data])

    const [segmentIndex, setSegmentIndex] = useState(1)

    const WAVEFORM_QUERY = gql`
    query Waveform {
        capnolabel_segments(where: {segmentIndex: {_eq: ${segmentIndex}}}, order_by: {timeIndex: asc}) {
            co2Wave
            timeIndex
            segmentIndex
            pid
            apneaIndex
        }
    }
    `
    const [exampleSelection, setExampleSelection] = useState(1)
    const EXAMPLE_QUERY = gql`
    query Example {
        capnolabel_segments(where: {segmentIndex: {_eq: ${exampleSelection}}}, order_by: {timeIndex: asc}) {
            co2Wave
            timeIndex
            segmentIndex
            pid
            apneaIndex
        }
    }
    `


    const { loading: waveformLoading, error: waveformError, data: waveformData } = useQuery(WAVEFORM_QUERY)
    const { loading: exampleLoading, error: exampleError, data: exampleWaveformData } = useQuery(EXAMPLE_QUERY)

    const plotData = waveformData && from(waveformData.capnolabel_segments)
    const max = waveformData && Math.max.apply(null,
        plotData.rollup({ co2Array: op.array_agg("co2Wave") }).get("co2Array")
    )

    const exampleData = exampleWaveformData && from(exampleWaveformData.capnolabel_segments)
    const exampleMax = exampleWaveformData && Math.max.apply(null,
        exampleData.rollup({ co2Array: op.array_agg("co2Wave") }).get("co2Array")
    )

    const pidSelected = waveformData && plotData
        .rollup({
            pid: op.array_agg_distinct("pid")
        })
        .get("pid")[0]


    const segmentSelected = waveformData && plotData
        .rollup({
            segment: op.array_agg_distinct("apneaIndex")
        })
        .get("segment")[0]

    const updateCache = (cache, { data }) => {
        const existingLabels = cache.readQuery({ query: QUERY })
        const newLabel = data.insert_labels.returning[0]
        cache.writeQuery({
            query: QUERY,
            data: { labels: [newLabel, ...existingLabels.labels] }
        })
    }

    const updateCacheDeletion = (cache, { data }) => {
        const existingLabels = cache.readQuery({ query: QUERY })
        const newLabels = existingLabels.labels.filter(label => (label.id !== currentId));
        cache.writeQuery({
            query: QUERY,
            data: { labels: newLabels }
        })
    }
    const [label, setLabel] = useState(null);

    const [updateLabels] = useMutation(MUTATION, { update: updateCache })


    const [removeLabelMutation] = useMutation(DELETE_ROW, { update: updateCacheDeletion })

    //Modal hook
    const [showModal, setShowModal] = useState(false)
    //Alert hook
    const [showAlert, setShowAlert] = useState(false)
    //ID of delete selection
    const [currentId, setCurrentId] = useState(null)
    const [deleteInfo, setDeleteInfo] = useState(null)
    const handleDelete = (e) => {
        e.preventDefault();
        setShowModal(true)
        setCurrentId(e.target.getAttribute("name"))
        setDeleteInfo(e.currentTarget.value)
    }

    const confirmDelete = () => {
        removeLabelMutation({
            variables: { id: currentId }
        })
        setShowModal(false)
    }
    const abortDelete = () => {
        setShowModal(false)
    }
    const abortAlert = () => {
        setShowAlert(false)
        setLabel(null)
    }

    const segmentsLabelled = data && data.labels.map(label => label.segmentIndex)
    const idsLabelledIndex = data && currentId && data.labels.map(label => label.id).indexOf(currentId)
    const { width } = useWindowSize();
    
    const LABELS = [
        "breathing -> breathing",
        "breathing -> no breath",
        // "artifact -> no breath",
        "artifact -> artifact"
    ]

    const [showArtifactExample, setShowArtifactExample] = useState(false)
    const [showSavedLabels, setShowSavedLabels] = useState(false)

    const abortArtifactExample = () => {
        setShowArtifactExample(false)
    }


    const artifactToArtifactExamples = [1,11, 3, 28, 25, 34, 41, 47, 51, 55 ]
    const breathingToBreathingExamples = [84, 30, 31, 43, 46, 52]
    const breathingToNoBreathExamples = [24,23, 2, 13, 14, 26, 33, 36]

    const handleNormalTabChange = (index) => {
        switch (index) {
            case 0:
                setExampleSelection(breathingToBreathingExamples[0]);
                break;
            case 1:
                setExampleSelection(breathingToNoBreathExamples[0]);
                break;
            case 2:
                setExampleSelection(artifactToArtifactExamples[0]);
                break;
            default:
                setExampleSelection(breathingToBreathingExamples[0]);
        }
    }




    return (
        <>
            {waveformLoading &&
                <Loading width={width} height={400} />
            }
            {waveformError &&
                <p>There was an error loading the waveform for labelling</p>
            }
            {plotData && max && (
                <>
                    <LinePlot data={plotData} maxCo2={max} />
                </>
            )}
            {data && (
                <>
                    <Section>
                        <ArticleWrapper>
                            <WaveformSelectorCol>
                                <label htmlFor="segment">Waveform</label>
                                <Spacer axis="horizontal" size={10} />
                                <input type="number" inputmode="numeric" id="segmentIndex" name="segmentIndex"
                                    min="0" max="9874"
                                    value={segmentIndex}
                                    onChange={(event) => setSegmentIndex(Number(event.currentTarget.value))}
                                />
                                <Spacer axis="horizontal" size={10} />
                                {isMobile && (
                                    <>
                                        <Button
                                            variant="fill"
                                            size="small"
                                            onClick={() => setSegmentIndex(segmentIndex - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="fill"
                                            size="small"
                                            onClick={() => setSegmentIndex(segmentIndex + 1)}
                                        >
                                            Next
                                        </Button>
                                    </>
                                )}
                            </WaveformSelectorCol>
                            <WaveformSelectorLabel>
                                {LABELS.map((d, i) => (
                                    <Toggle
                                        id="toggle"
                                        type="radio"
                                        name="label"
                                        value={d}
                                        onChange={(e) => {
                                            setLabel(e.currentTarget.value)
                                            if (segmentsLabelled.includes(segmentIndex)) {
                                                setShowAlert(true)
                                            }
                                            else {
                                                updateLabels({
                                                    variables: {
                                                        label: e.target.value,
                                                        pid: pidSelected,
                                                        segment: segmentSelected,
                                                        segmentIndex: segmentIndex,
                                                        user_id: user.sub
                                                    }
                                                });
                                                setLabel(null)
                                            }
                                        }}
                                        checked={label === d}
                                        text={d}
                                    />

                                ))}
                            </WaveformSelectorLabel>
                        </ArticleWrapper>
                    </Section>
                    <Section>
                        <ArticleWrapper>
                            <ExamplesWrapper>
                                <Button
                                    variant="fill"
                                    size="small"
                                    onClick={() => setShowSavedLabels(true)}
                                >
                                    <IconButtonLayout>
                                        <Save />
                                        Saved labels
                                    </IconButtonLayout>
                                </Button>
                                <Button
                                    variant="fill"
                                    size="small"
                                    onClick={() => setShowArtifactExample(true)}
                                >
                                    <IconButtonLayout>
                                        <Tags />
                                        Examples
                                    </IconButtonLayout>
                                </Button>
                            </ExamplesWrapper>
                        </ArticleWrapper>
                    </Section>
                </>
            )}
            <Modal
                isOpen={showSavedLabels}
                handleDismiss={() => setShowSavedLabels(false)}
            >
                <ModalMessage>
                    {isAuthenticated && data && (
                        <LabelTableComponent data={data} handleDelete={handleDelete} />
                    )}
                    {isAuthenticated && error && (
                        <p>Error: {error.message}</p>
                    )}
                    {isAuthenticated && loading && (
                        <p>Loading saved data...</p>
                    )}
                </ModalMessage>
            </Modal>
            <Modal
                isOpen={showModal}
                handleDismiss={() => setShowModal(false)}
            >
                <ModalMessage>
                    Please confirm if you want to delete
                    the label "{deleteInfo}" for waveform
                    number {currentId && segmentsLabelled[idsLabelledIndex]}.
                </ModalMessage>
                <ModalButtonWrapper>
                    <Button
                        variant="outline"
                        size="medium"
                        onClick={abortDelete}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="delete"
                        size="medium"
                        onClick={confirmDelete}
                    >
                        Delete
                    </Button>
                </ModalButtonWrapper>
            </Modal>
            <Modal
                title="Alert"
                isOpen={showAlert}
                handleDismiss={abortAlert}
            >
                <ModalMessage>
                    You have already labelled waveform number {segmentIndex}.
                    You will need to delete the saved label first if
                    you want to make a correction.
                </ModalMessage>
                <ModalButtonWrapper>
                    <Button
                        variant="outline"
                        size="medium"
                        onClick={abortAlert}
                    >
                        Dismiss
                    </Button>
                </ModalButtonWrapper>
            </Modal>
            <Modal
                isOpen={showArtifactExample}
                handleDismiss={abortArtifactExample}
            >
                <ModalMessage>
                    <Tabs onChange={handleNormalTabChange}>
                        <StyledTabList>
                            <StyledTab>
                                breathing to breathing
                            </StyledTab>
                            <StyledTab>
                                breathing to no breath
                            </StyledTab>
                            <StyledTab>
                                artifact to artifact
                            </StyledTab>
                        </StyledTabList>
                        <TabPanels>
                            <TabPanel>
                                <Spacer axis="vertical" size={10} />
                                <AccordionWrapper>
                                    {breathingToBreathingExamples.map((d, i) => (
                                        <AccordionItem>
                                            <StyledAccordionButton onClick={() => setExampleSelection(d)}>
                                                Example {i + 1}
                                            </StyledAccordionButton>
                                            <AccordionPanel>
                                                {exampleLoading &&
                                                    <p>Loading...</p>
                                                }
                                                {exampleError &&
                                                    <p>There was an error loading the waveform for labelling</p>
                                                }
                                                {exampleData && exampleMax && (
                                                    <LinePlot data={exampleData} maxCo2={exampleMax} />
                                                )
                                                }
                                            </AccordionPanel>
                                        </AccordionItem>
                                    )
                                    )}
                                </AccordionWrapper>
                            </TabPanel>
                            <TabPanel>
                                <Spacer axis="vertical" size={10} />
                                <AccordionWrapper>
                                    {breathingToNoBreathExamples.map((d, i) => (
                                        <AccordionItem>
                                            <StyledAccordionButton onClick={() => setExampleSelection(d)}>
                                                Example {i + 1}
                                            </StyledAccordionButton>
                                            <AccordionPanel>
                                                {exampleLoading &&
                                                    <p>Loading...</p>
                                                }
                                                {exampleError &&
                                                    <p>There was an error loading the waveform for labelling</p>
                                                }
                                                {exampleData && exampleMax && (
                                                    <LinePlot data={exampleData} maxCo2={exampleMax} />
                                                )
                                                }
                                            </AccordionPanel>
                                        </AccordionItem>
                                    )
                                    )}
                                </AccordionWrapper>
                            </TabPanel>
                            <TabPanel>
                                <Spacer axis="vertical" size={10} />
                                <AccordionWrapper>
                                    {artifactToArtifactExamples.map((d, i) => (
                                        <AccordionItem>
                                            <StyledAccordionButton onClick={() => setExampleSelection(d)}>
                                                Example {i + 1}
                                            </StyledAccordionButton>
                                            <AccordionPanel>
                                                {exampleLoading &&
                                                    <p>Loading...</p>
                                                }
                                                {exampleError &&
                                                    <p>There was an error loading the waveform for labelling</p>
                                                }
                                                {exampleData && exampleMax && (
                                                    <LinePlot data={exampleData} maxCo2={exampleMax} />
                                                )
                                                }
                                            </AccordionPanel>
                                        </AccordionItem>
                                    )
                                    )}
                                </AccordionWrapper>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalMessage>
                <ModalButtonWrapper>
                </ModalButtonWrapper>
            </Modal>
        </>
    )
}
