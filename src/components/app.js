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
justify-content: center;
align-items: center;
`

export default function App() {
    const { user, isAuthenticated } = useAuth0()

    const { loading, error, data } = useQuery(QUERY);

    //runs when the data changes which is only on page load
    useEffect(() => {
        if (data) {
            data.labels.length !== 0 ? setSegmentIndex(data.labels.map(label => label.segmentIndex)[0]) : setSegmentIndex(0);
        }
    }, [data])

    const [segmentIndex, setSegmentIndex] = useState(0)

    const WAVEFORM_QUERY = gql`
    query Waveform {
        capnolabel_segments(where: {segmentIndex: {_eq: ${segmentIndex + 1}}}, order_by: {timeIndex: asc}) {
            co2Wave
            timeIndex
            segmentIndex
            pid
            capnoFeatureGroup
        }
    }
    `


    const { loading: waveformLoading, error: waveformError, data: waveformData } = useQuery(WAVEFORM_QUERY)
    console.log(waveformError)


    const plotData = waveformData && from(waveformData.capnolabel_segments)
    const max = waveformData && Math.max.apply(null,
        plotData.rollup({ co2Array: op.array_agg("co2Wave") }).get("co2Array")
    )

    const pidSelected = waveformData && plotData
        .rollup({
            pid: op.array_agg_distinct("pid")
        })
        .get("pid")[0]


    const segmentSelected = waveformData && plotData
        .rollup({
            segment: op.array_agg_distinct("capnoFeatureGroup")
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
    const labels = [
        "normal",
        "hypopnea",
        "bradypnea",
        "breathing - artifact",
        "artifact"
    ]
    return (
        <>
            {waveformLoading &&
                <Loading width={width} height={400} />
            }
            {waveformError &&
                <p>There was an error loading the waveform for labelling</p>
            }
            {plotData && max && (
                <LinePlot data={plotData} maxCo2={max} />
            )}
            {data && (
                <Section>
                    <ArticleWrapper>
                        <WaveformSelectorCol>
                            <label htmlFor="segment">Waveform</label>
                            <Spacer axis="horizontal" size={10} />
                            <input type="number" inputmode="numeric" id="segmentIndex" name="segmentIndex"
                                min="1" max="6200"
                                value={segmentIndex + 1}
                                onChange={(event) => setSegmentIndex(event.currentTarget.value - 1)}
                            />
                            <Spacer axis="horizontal" size={10} />
                            {isMobile && (
                                <>
                                    <Button
                                        variant="fill"
                                        size="small"
                                        onClick={() => setSegmentIndex(segmentIndex + 1)}
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        variant="fill"
                                        size="small"
                                        onClick={() => setSegmentIndex(segmentIndex - 1)}
                                    >
                                        Previous
                                    </Button>
                                </>
                            )}
                        </WaveformSelectorCol>
                        <WaveformSelectorLabel>
                            {labels.map((d, i) => (
                                <Toggle
                                    id="toggle"
                                    type="radio"
                                    name="label"
                                    value={d}
                                    onChange={(e) => {
                                        setLabel(e.currentTarget.value)
                                        if (segmentsLabelled.includes(segmentIndex + 1)) {
                                            setShowAlert(true)
                                        }
                                        else {
                                            updateLabels({
                                                variables: {
                                                    label: e.target.value,
                                                    pid: pidSelected,
                                                    segment: segmentSelected,
                                                    segmentIndex: segmentIndex + 1,
                                                    user_id: user.sub
                                                }
                                            });
                                            setLabel(null)
                                            setSegmentIndex(segmentIndex + 1)
                                        }
                                    }}
                                    checked={label === d}
                                    text={d}
                                />
                            ))}
                        </WaveformSelectorLabel>
                        {/* </WaveformSelectorWrapper> */}
                    </ArticleWrapper>
                </Section>
            )}
            <Section>
                <ArticleWrapper>
                    {isAuthenticated && data && (
                        <LabelTableComponent data={data} handleDelete={handleDelete} />
                    )}
                    {isAuthenticated && error && (
                        <p>Error: {error.message}</p>
                    )}
                    {isAuthenticated && loading && (
                        <p>Loading saved data...</p>
                    )}
                </ArticleWrapper>
            </Section>
            <Modal
                title="Delete"
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
                    You have already labelled waveform number {segmentIndex + 1}.
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
        </>
    )
}