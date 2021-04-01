import * as React from 'react'
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
import Typography from '@material-ui/core/Typography'
import DotIcon from '@material-ui/icons/FiberManualRecordOutlined'
import RegisterIcon from '@material-ui/icons/Add'
import BuyIcon from '@material-ui/icons/LocalAtm'
import ChangeIcon from '@material-ui/icons/ChangeHistory'
import SecureIcon from '@material-ui/icons/Lock'
import PausedIcon from '@material-ui/icons/Pause'
import RunningIcon from '@material-ui/icons/DirectionsRun'
import {getRowDataByUUID} from '../../libs/state_modifiers'

const TableManagerOrderHistory = (props) => {
    const {
        uuid,
        tableData,
        ...other
    } = props

    /**
     * Component style overrides.
     */
    const classes = makeStyles(theme => ({
        grid_box: {
            color: theme.palette.text.secondary,
            '& .MuiGrid-item:first-child': {},
            '& .MuiGrid-item:last-child': {
                textAlign: 'right',
                overflow: 'hidden'
            },
            '& + *': {
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: `1px solid ${theme.palette.secondary.main}`
            },
            '&:not(:first-child)': {
                marginTop: '16px'
            }
        },
        timeline: {
            '& .MuiTimelineContent-root': {
                color: theme.palette.text.disabled,
                flex: 0,
                minWidth: '180px'
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
                '&.timelinedot-registered': {
                    backgroundColor: theme.palette.secondary.main,
                },
                '&.timelinedot-buy': {
                    backgroundColor: theme.palette.primary.dark,
                },
                '&.timelinedot-limit': {
                    backgroundColor: theme.palette.quaternary.dark,
                },
                '&.timelinedot-loss-prevent': {
                    backgroundColor: theme.palette.quaternary.dark,
                },
                '&.timelinedot-paused': {
                    backgroundColor: theme.palette.tertiary.main,
                },
                '&.timelinedot-running': {
                    backgroundColor: theme.palette.tertiary.main,
                }
            }
        },
    }))()

    /**
     * Timeline items.
     */
    const [timelineItems, setTimelineItems] = useState([])

    /**
     * Update data whenever tableData is modified.
     */
    useEffect(() => {
        // let row = getRowDataByUUID(uuid, tableData)
        renderTimeline(uuid)
    }, [tableData])

    /**
     * Retrieve row history and build timeline.
     */
    const renderTimeline = (uuid) => {
        (async () => {
            const history_response = await fetch(`http://localhost:2222/app/get/orders/history/${uuid}`)
            let history_result = await history_response.json()
            let items = []
            if (history_result.length) {
                history_result.forEach((item, index) => {
                    let date_time = new Date(item.date).toLocaleString()
                    let item_dot = null
                    switch (item.event) {
                        case 'REGISTERED':
                            item_dot = (
                                <TimelineDot className="timelinedot-registered">
                                    <RegisterIcon size="small"/>
                                </TimelineDot>
                            )
                            break
                        case 'BUY':
                            item_dot = (
                                <TimelineDot className="timelinedot-buy">
                                    <BuyIcon size="small"/>
                                </TimelineDot>
                            )
                            break
                        case 'LIMIT':
                            item_dot = (
                                <TimelineDot className="timelinedot-limit">
                                    <ChangeIcon size="small"/>
                                </TimelineDot>
                            )
                            break
                        case 'LOSS_PREVENT':
                            item_dot = (
                                <TimelineDot className="timelinedot-loss-prevent">
                                    <SecureIcon size="small"/>
                                </TimelineDot>
                            )
                            break
                        case 'PAUSED':
                            item_dot = (
                                <TimelineDot className="timelinedot-paused">
                                    <PausedIcon size="small"/>
                                </TimelineDot>
                            )
                            break
                        case 'RUNNING':
                            item_dot = (
                                <TimelineDot className="timelinedot-running">
                                    <RunningIcon size="small"/>
                                </TimelineDot>
                            )
                            break
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
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Timeline className={classes.timeline}>
                        {timelineItems}
                    </Timeline>
                </Grid>
            </Grid>
        </>
    )
}

TableManagerOrderHistory.propTypes = {
    uuid: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerOrderHistory)