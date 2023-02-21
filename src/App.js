import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import iconMain from '../src/img/exchange1.png'
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="">
                Fast-Change.io
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

async function sendReqPOST(data) {
    console.log(data)
    return (await fetch(`http://5.187.3.233/api/v1/exchange/`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })).json();
}

async function sendReqGET(data) {
    console.log(data)
    return (await fetch(`http://5.187.3.233/api/v1/exchange/calculate?fromCurrency=${data.fromCurrency}&toCurrency=${data.toCurrency}&amount=${data.fromAmount}`, {
        method: "GET",
    })).json();
}

export default function App() {
    const [address, setAddress] = useState("sveagruva");
    const [conversion, setConversion] = useState({})

    const [userWalletState, setuserWalletState] = useState()
    const [amountState, setamountState] = useState()
    const [fromState, setfromState] = useState()
    const [toState, settoState] = useState()

    function clearState() {
        settoState("")
        setfromState("")
        setamountState("")
        setuserWalletState("")
    }

    const hadleChangeInput = async (event, key) => {
        switch (key) {
            case 'user':
                setuserWalletState(event.target.value);
                break;
            case 'amount':
                setamountState(event.target.value);
                break;
            case 'from':
                setfromState(event.target.value);
                break;
            case 'to':
                settoState(event.target.value)
                break;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const baseJson = {
                fromAmount: amountState,
                fromCurrency: fromState,
                toCurrency: toState,
            }
            const baseEx = {
                ...baseJson,
                toWallet: userWalletState,
                extraId: "string",
                refundAddress: "string",
                refundExtraId: "string",
            }
            const resEx = await sendReqPOST(baseEx)
            const resFee = await sendReqGET(baseJson)
            console.log(resEx,resFee)
            clearState()
            setAddress(JSON.stringify(resEx.fromWallet).replace(/["']/g, ""))
            setConversion(resFee)
        } catch (e) {
            console.error(e, "Error from server response, sveagruva is banned")
        }

    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src={iconMain} alt=""/>
                    <Typography component="h1" variant="h5">
                        Get generated address check
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={userWalletState}
                                    onChange={e => hadleChangeInput(e, "user")}
                                    autoComplete="given-name"
                                    name="UserWallet"
                                    required
                                    fullWidth
                                    id="UserWallet"
                                    label="User Wallet"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={amountState}
                                    onChange={e => hadleChangeInput(e, "amount")}
                                    required
                                    fullWidth
                                    id="Amount"
                                    label="Amount"
                                    name="Amount"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={fromState}
                                    onChange={e => hadleChangeInput(e, "from")}
                                    required
                                    fullWidth
                                    id="fromCurrency"
                                    label="from Currency Address"
                                    name="fromCurrency"
                                    autoComplete="fromCurrency"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={toState}
                                    onChange={e => hadleChangeInput(e, "to")}
                                    required
                                    fullWidth
                                    id="toCurrency"
                                    label="to Currency Address"
                                    name="toCurrency"
                                    autoComplete="new-toCurrency"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            GO!!!
                        </Button>
                    </Box>
                </Box>


                <Box>
                    <Typography component="h1" variant="h5">
                        Response: {address !== "sveagruva" ? address : "is null"}
                    </Typography>
                    <Typography component="h1" variant="h5">
                        Flat conversion: {conversion != null ? conversion.flatConversion : "is null"} <br/>
                        Commission conversion: {conversion != null ? conversion.commissionConversion : "is null"}
                    </Typography>
                </Box>
                <Copyright sx={{mt: 5}}/>
            </Container>
        </ThemeProvider>
    );
}
