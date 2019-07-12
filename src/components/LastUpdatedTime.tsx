import * as React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

import { genericText, colors } from '../styles';

import { differenceSeconds} from '../utils/time';

const styles = StyleSheet.create({
    alighRight: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginTop: 10
    },
    darkText: {
        ...genericText,
        color: colors.lightText,
        fontSize: 14,
        textAlign: 'right',
        marginRight: 10,
    },
});

type Props = {
    time?: Date
}

type State = {
    timeDifferenceString?: string, 
}


export default class LastUpdatedTime extends React.Component<Props, State> {

    state = {
        timeDifferenceString: undefined,
    }

    componentDidMount() {
        setInterval(() => {
            const {time} = this.props;
            this.setState({
                timeDifferenceString: time && differenceSeconds(time, new Date()).toString()
            })
        }, 1000)
    }

    render() {
        const { timeDifferenceString} = this.state;
        if (!timeDifferenceString) return null;
        return (
        <View style={styles.alighRight}>
            <Text style={styles.darkText}>updated {this.state.timeDifferenceString} seconds ago</Text>
        </View>)
    }
}
