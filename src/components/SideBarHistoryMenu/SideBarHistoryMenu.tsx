import * as React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import fetch from 'cross-fetch'
import Grid from '@material-ui/core/Grid'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import Paper from '@material-ui/core/Paper'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import RegisterIcon from "@material-ui/icons/Add";
import BuyIcon from "@material-ui/icons/LocalAtm";
import ChangeIcon from "@material-ui/icons/ChangeHistory";
import SecureIcon from "@material-ui/icons/Lock";
import PausedIcon from "@material-ui/icons/Pause";
import RunningIcon from "@material-ui/icons/DirectionsRun";
import DotIcon from "@material-ui/icons/FiberManualRecordOutlined";

export default function SideBarHistoryMenu(props) {
    const {
        profileActive,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        accordion: {
            '& .MuiAccordionDetails-root': {
                padding: '0 !important',
            }
        },
        timeline: {
            '&.MuiTimeline-root': {
                padding: '0 12px 0 8px'
            },
            '& .MuiTimelineContent-root': {
                color: theme.palette.text.disabled,
                flex: 0,
                // minWidth: '180px'
            },
            '& .MuiTimelineOppositeContent-root': {
                padding: '6px 0 6px 16px',
            },
            '& .MuiTimelineOppositeContent-root .MuiTypography-root': {
                color: theme.palette.text.disabled,
                textAlign: 'left',
                '&.timelinecontent-info': {
                    color: theme.palette.text.primary
                }
            },
            '& .MuiTimelineOppositeContent-root .MuiPaper-root': {
                padding: '8px 12px',
                backgroundColor: theme.palette.secondary.main,
                borderRadius: '2px !important'
            },
            '& .MuiTimelineDot-root': {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.main,
            }
        },
    }))()

    /**
     * Component states.
     */
    const [expandedPanel1, setExpandedPanel1] = useState(true)
    const [timelineItems, setTimelineItems] = useState([])

    /**
     * Handle open/close of accordion.
     */
    const handleChange = (panel) => (event) => {
        setExpandedPanel1(expandedPanel1 ? false : true)
    }

    /**
     * Update data whenever tableData is modified.
     */
    useEffect(() => {
        if (profileActive.length) {
            let active_profile = profileActive[0]
            renderTimeline(active_profile)
        }
    }, [profileActive])

    /**
     * Retrieve row history and build timeline.
     */
    const renderTimeline = (profile) => {
        (async () => {
            const history_response = await fetch(`http://localhost:2222/app/get/profiles/history/${profile}`)
            let history_result = await history_response.json()
            let items = []
            if (history_result.length) {
                history_result.forEach((item, index) => {
                    let date_time = new Date(item.date).toLocaleString()
                    let item_dot = null
                    switch (item.event) {
                        default:
                            item_dot = (
                                <TimelineDot>
                                    <DotIcon size="small"/>
                                </TimelineDot>
                            )

                    }
                    items.push(
                        <TimelineItem key={index.toString()}>
                            <TimelineSeparator>
                                {item_dot}
                                <TimelineConnector/>
                            </TimelineSeparator>
                            <TimelineOppositeContent>
                                <Paper elevation={3}>
                                    <Typography variant="overline" display="block">{date_time}</Typography>
                                    <Typography className="timelinecontent-info">{item.info}</Typography>
                                </Paper>
                            </TimelineOppositeContent>
                        </TimelineItem>
                    )
                })
                setTimelineItems(items)
            }
        })()
    }

    return (
        <div>
            <Accordion
                square
                expanded={expandedPanel1}
                onChange={handleChange()}
                className={classes.accordion}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                >
                    <Typography>History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Timeline className={classes.timeline}>
                        {timelineItems}
                    </Timeline>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

SideBarHistoryMenu.propTypes = {}

const mapStateToProps = (state) => {
    return {
        profileActive: state.profileActive,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarHistoryMenu)