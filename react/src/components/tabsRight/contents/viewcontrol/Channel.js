import React, { useState, useEffect } from 'react';
// import { Container } from 'react-bootstrap';
import {
    // Grid, 
    Checkbox, Button
} from '@mui/material';
import shallow from 'zustand/shallow';
import { connect } from 'react-redux';

import {
    useChannelsStore,
    useViewerStore,
    useImageSettingsStore,
    useLoader,
    useMetadata
} from '../../../viv/state';
// import { guessRgb, getSingleSelectionStats } from '../../../viv/utils';
import SmallCard from '../../../custom/SmallCard';
import { COLORMAP_SLIDER_CHECKBOX_COLOR } from '../../../constant/constants';


const toRgb = (on, arr) => {
    const color = on ? COLORMAP_SLIDER_CHECKBOX_COLOR : arr;
    return `rgb(${color})`;
};
const mapStateToProps = state => ({
    viewConfigsObj: state.vessel.viewConfigsObj,
})

const Channel = (props) => {

    const channels = [
        { id: 0, label: "S", color: "black", disabled: true, current_id: -1, rgbColor: [255, 255, 255], channelsVisible: false },
        { id: 1, label: "B", color: "blue", disabled: true, current_id: -1, rgbColor: [0, 0, 255], channelsVisible: false },
        { id: 2, label: "G", color: "green", disabled: true, current_id: -1, rgbColor: [0, 255, 0], channelsVisible: false },
        { id: 3, label: "R", color: "red", disabled: true, current_id: -1, rgbColor: [255, 0, 0], channelsVisible: false },
        { id: 4, label: "C", color: "cyan", disabled: true, current_id: -1, rgbColor: [0, 255, 255], channelsVisible: false },
        { id: 5, label: "Y", color: "yellow", disabled: true, current_id: -1, rgbColor: [255, 255, 0], channelsVisible: false },
        { id: 6, label: "M", color: "magenta", disabled: true, current_id: -1, rgbColor: [255, 0, 255], channelsVisible: false },
    ];
    const [channelsVisible, contrastLimits, colors, domains, selections, ids, setPropertiesForChannel, toggleIsOnSetter, removeChannel
    ] = useChannelsStore(
        store => [
            store.channelsVisible,
            store.contrastLimits,
            store.colors,
            store.domains,
            store.selections,
            store.ids,
            store.setPropertiesForChannel,
            store.toggleIsOn,
            store.removeChannel
        ],
        shallow
    );
    const loader = useLoader();
    const [channelOptions, useLinkedView, use3d, useColormap, useLens, isChannelLoading, setIsChannelLoading, removeIsChannelLoading, pixelValues, isViewerLoading
    ] = useViewerStore(
        store => [
            store.channelOptions,
            store.useLinkedView,
            store.use3d,
            store.useColormap,
            store.useLens,
            store.isChannelLoading,
            store.setIsChannelLoading,
            store.removeIsChannelLoading,
            store.pixelValues,
            store.isViewerLoading
        ],
        shallow
    );
    // const metadata = useMetadata();
    // const isRgb = metadata && guessRgb(metadata);
    const colormap = useImageSettingsStore(store => store.colormap);
    // const [channelConfig, setChannelConfig] = useState(props.viewConfigsObj ? props.viewConfigsObj.channel : {});
    // const { shape, labels } = loader[0];
    const toggleIsOn = (current_id) => {
        console.log(" ---------- Channel.js toggleIsOn : ", current_id);
        if (current_id > -1) {
            toggleIsOnSetter(current_id);
        }
    };

    useEffect(() => {
        if (props.viewConfigsObj) {
            // console.log(" Channel.js props.viewConfigsObj : ", props.viewConfigsObj);
        }
    }, [props.viewConfigsObj])

    const renderItems = (channels) => {
        let current_channels = channels;
        let isLoading = false;
        let rgbColor = toRgb(colormap, [0, 0, 0]);
        if (ids !== null && ids !== undefined) {
            if (ids.length > 0) {
                for (let i = 0; i < ids.length; i++) {
                    for (let j = 0; j < current_channels.length; j++) {
                        if (colors[i][0] === current_channels[j].rgbColor[0] && colors[i][1] === current_channels[j].rgbColor[1] && colors[i][2] === current_channels[j].rgbColor[2]) {
                            current_channels[j].current_id = i;
                            current_channels[j].disabled = false;
                            current_channels[j].channelsVisible = channelsVisible[i];
                            break;
                        }
                    }
                    rgbColor = toRgb(colormap, colors[i]);
                }
            }
        }
        return (
            current_channels.map((channel, i) =>
                <div key={i} className="d-flex flex-column channel-box text-center">
                    <Checkbox
                        onChange={() => { toggleIsOn(channel.current_id) }}
                        checked={channel.channelsVisible}
                        disabled={channel.disabled}
                        size="small"
                        // checked={channelsArray.lenght > 0 ? channelsArray.includes(i) : false}
                        sx={{ color: isLoading ? rgbColor : channel.color, padding: 0, '&.Mui-checked': { color: isLoading ? rgbColor : channel.color, } }} />
                    <span style={{ color: isLoading ? rgbColor : channel.color }}>{channel.label}</span>
                </div>
            )
        )
    }

    return (
        <>
            <div className="pa-1 common-border">
                <div className="d-flex justify-space-between align-center" >
                    <h6>Channels</h6>
                    <div>
                        <div className="spacer"></div>
                        <Button className="py-0" variant="contained" color="primary" size="small">Color/Mono</Button>
                    </div>
                </div>
                <div>
                    <SmallCard>
                        {renderItems(channels)}
                    </SmallCard>
                </div>
            </div>
        </>
    );
};

export default connect(mapStateToProps)(Channel);