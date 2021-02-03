import React, { useState, useEffect, useRef, Fragment } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// import Web3 from 'web3';
import axios from 'axios';

const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
const endpoint = `https://api.etherscan.io/api`;


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/*
    Register an account on Infura with upgrade Archive Node
*/
// const web3 = new Web3('https://ropsten.infura.io/v3/b282c1e58f004cc3819ae035fec21fac');

function AppSearch(props) {
    const classes = useStyles();

    /**************************************************************************/
    // const [date, setDate] = useState('');
    // const [dateButtonState, setDateButtonState] = useState(true);
    // const [accountBalance, setAccountBalance] = useState('');
    /**************************************************************************/

    const initialPageSet = useRef(false);
    const [address, setAddress] = useState('');
    const [startBlock, setStartBlock] = useState('');
    const [endBlock, setEndBlock] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [noDataOpen, setNoDataOpen] = React.useState(false);
    const [missOpen, setMissOpen] = React.useState(false);
    const [blockNumbers, setBlockNumbers] = useState([]);

    useEffect(() => {
        if (!initialPageSet.current) {
            initialPageSet.current = true;
            return;
        }
        onSearchAddress(blockNumbers);
    // eslint-disable-next-line
    }, [props.page]);

    const handleSearch = () => {
        if(address === '' || startBlock === '') {
            setMissOpen(true);
            return;
        }
        setButtonDisabled(true);
        setBlockNumbers([]);
        onSearchAddress([]);
    }

    const onSearchAddress = async (blockNo) => {
        const response = await axios.get(
            endpoint +
            `?module=account&action=txlist&address=` +
            `${address}&sort=asc&startblock=${blockNo.slice(-1)[0] || startBlock}` +
            `${endBlock !== '' ? '&endblock=' + endBlock : ''}` +
            `&page=1&offset=100&apikey=${apiKey}`
        ).catch(() => setButtonDisabled(false));

        setButtonDisabled(false);

        if (!Array.isArray(response.data.result)) {
            setBlockNumbers([]);
            props.onSearch([]);
            setNoDataOpen(true);
            return;
        }

        const blocks = response.data.result.map(d => d.blockNumber);
        setBlockNumbers(blocks);
        
        props.onSearch(response.data.result);

        props.onEnd(response.data.result.length < 100);
    }

    // Alert handlers
    const handleNoDataClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNoDataOpen(false);
    };

    const handleMissingClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMissOpen(false);
    };

    // Input handlers
    const onSearchAddressChange = (e) => setAddress(e.target.value);
    const onStartBlockChange = (e) => setStartBlock(e.target.value);
    const onEndBlockChange = (e) => setEndBlock(e.target.value);

    /**************************************************************************/

     /**
     * Add Date/Time picker component
     * Integrate a button for search event trigger
     * Use the following:
     *  1. State variables defined at the begining of the component
     *  2. Event handlers defined bellow
     * 
     * Logic: Find the nodes closest to the date (before and after). Check
     *        which date matches date specifed in terms YYYY-MM-DD 00:00:00. 
     *        Extract block number of the one that matches. Use Web3 API to find
     *        account balance.
     */

    /**************************************************************************/

    // const onDateChange = (e) => {
    //     setDate(e.target.value);
    //     setDateButtonState(false);
    // }
    // const onGetBalance = async () => {
    //     const selectedTimestamp = new Date(date).getTime() / 1000;
    //     const resClosestBefore = await axios.get(`${endpoint}?module=startBlock&action=getblocknobytime&timestamp=${selectedTimestamp}&closest=before&apikey=${apiKey}`);
    //     const resClosestAfter = await axios.get(`${endpoint}?module=startBlock&action=getblocknobytime&timestamp=${selectedTimestamp}&closest=after&apikey=${apiKey}`);
        
    //     const beforeBlockInfo = await web3.eth.getBlock(resClosestBefore.data.result);
    //     const afterBlockInfo = await web3.eth.getBlock(resClosestAfter.data.result);

    //     const beforeDiff = Math.abs(selectedTimestamp - beforeBlockInfo.timestamp);
    //     const afterDiff = Math.abs(selectedTimestamp - afterBlockInfo.timestamp);

    //     result will be in Wei
    //     if (beforeDiff < afterDiff) {
    //         const accountBalance = await web3.eth.getBalance(address, beforeBlockInfo.number);
    //         setAccountBalance(accountBalance.result);
    //     } else {
    //         const accountBalance = await web3.eth.getBalance(address, afterBlockInfo.number);
    //         setAccountBalance(accountBalance.result);
    //     }
    // }

    /**************************************************************************/
    return(
        <Fragment>
            <AppBar position="static" classes={{colorPrimary: classes.appbar}}>
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Ethereum Crawler
                    </Typography>
                    <TextField
                        variant="outlined" 
                        label="Address *"
                        value={address}
                        color="secondary"
                        size="small"
                        className={classes.input}
                        onChange={onSearchAddressChange}
                    />

                    <TextField
                        variant="outlined" 
                        label="Start block *"
                        value={startBlock}
                        color="secondary"
                        size="small"
                        className={classes.input}
                        onChange={onStartBlockChange}
                    />
                    <TextField
                        variant="outlined" 
                        label="End block (optional)"
                        value={endBlock}
                        color="secondary"
                        size="small"
                        className={classes.input}
                        onChange={onEndBlockChange}
                    />
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleSearch}
                        disabled={buttonDisabled}
                    >
                        Search
                    </Button>
                    <Snackbar open={noDataOpen} autoHideDuration={6000} onClose={handleNoDataClose}>
                        <Alert onClose={handleNoDataClose} severity="warning">
                            No data found!
                        </Alert>
                    </Snackbar>
                    <Snackbar open={missOpen} autoHideDuration={6000} onClose={handleMissingClose}>
                        <Alert onClose={handleMissingClose} severity="error">
                            Address and starting block are required!
                        </Alert>
                    </Snackbar>
                </Toolbar>
            </AppBar>
        </Fragment>
    );
}

const useStyles = makeStyles((theme) => ({
    appbar: {
        backgroundColor: '#5f7ae3',
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    input: {
        margin: theme.spacing(0, 2.5),  
        width: theme.spacing(37.5),

        '& .MuiInputBase-root': {
            color: 'white',
        },

        '& .MuiFormLabel-root': {
            color: 'rgba(255, 255, 255, 0.5)',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
        },
    },
}));

export default AppSearch;
