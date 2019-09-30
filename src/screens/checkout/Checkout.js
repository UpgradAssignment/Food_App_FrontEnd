import React, { Component } from 'react';
import './Checkout.css';
import Header from '../../common/Header/Header';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';



const styles = theme => ({
    root: {
        width: '90%',
      },
      button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
      actionsContainer: {
        marginBottom: theme.spacing(2),
      },
      resetContainer: {
        padding: theme.spacing(3),
      }, 
      formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
        maxWidth: 200,
        width: 200
      },
      gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
      },

});

class Checkout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            activeTab: 0,
            existingAddress: null,
            newAddress: null,
            states: [],
            paymentModes: [],
            newFlatNo:"",
            newLocality:"", 
            newCity:"",
            newState:"", 
            newPincode:"",
            flatNoRequired: "dispNone", 
            localityRequired: "dispNone", 
            cityRequired: "dispNone", 
            stateRequired: "dispNone",
            pincodeRequired: "dispNone",
            pincodeValidationMessage: "",
            newAddressAdded: false,
            snackBarOpen: false,
            snackBarMessage: '',
            selectedAddress: null,
            selectedPaymentMode: null,
            cartDetail: null

        }
    }

    componentWillMount() {
        // getting  cart details
        this.setState({
            cartDetail: this.props.location.state.cartDetail
        });
        if(this.props.location.state.cartDetail === null || this.props.location.state.cartDetail === undefined){
            this.props.history.push("/");
        }
        this.getExistingAddress();
        this.getStates();
        this.getPaymentModes();
    }

    getExistingAddress = () => {
        let dataExistingAddress = null;
        let xhrExistingAddress = new XMLHttpRequest();
        let that = this;
        xhrExistingAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let data = JSON.parse(this.responseText).addresses;
                that.setState({
                    existingAddress : data
                });
            }
        });

        xhrExistingAddress.open("GET", "http://localhost:8080/api/address/customer");
        xhrExistingAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrExistingAddress.setRequestHeader("Content-Type", "application/json");
        xhrExistingAddress.setRequestHeader("Cache-Control", "no-cache");
        xhrExistingAddress.send(dataExistingAddress);
    }

    getStates = () => {
        let dataStates = null;
        let xhrStates = new XMLHttpRequest();
        let that = this;
        xhrStates.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let data = JSON.parse(this.responseText).states;
                that.setState({
                    states : data
                });
            }
        });

        xhrStates.open("GET", "http://localhost:8080/api/states ");
        xhrStates.setRequestHeader("Cache-Control", "no-cache");
        xhrStates.send(dataStates);
    }

    getPaymentModes = () => {
        let dataPaymentModes = null;
        let xhrPaymentModes = new XMLHttpRequest();
        let that = this;
        xhrPaymentModes.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let data = JSON.parse(this.responseText).paymentMethods;
                that.setState({
                    paymentModes : data
                });
            }
        });

        xhrPaymentModes.open("GET", "http://localhost:8080/api/payment");
        xhrPaymentModes.setRequestHeader("Cache-Control", "no-cache");
        xhrPaymentModes.send(dataPaymentModes);
    }

    inputFlatNoChangeHandler = (e) => {
        this.setState({ newFlatNo: e.target.value });
    }
    

    inputLocalityChangeHandler = (e) => {
        this.setState({ newLocality: e.target.value });
    }
    

    inputCityChangeHandler = (e) => {
        this.setState({ newCity: e.target.value });
    }


    inputStateChangeHandler = (e) => {
        this.setState({ newState: e.target.value });
    }
    

    inputPincodeChangeHandler = (e) => {
        this.setState({ newPincode: e.target.value });
    }


    handlePaymentModeChangeHandler = (e) => {
        this.setState({ selectedPaymentMode: e.target.value });
    }


    saveNewAddress = () => {
        let pincodePattern =/^\d{6}$/;

        // Validating Fields
        this.state.newFlatNo === "" ? this.setState({ flatNoRequired: "dispBlock" }) : this.setState({ flatNoRequired: "dispNone" });
        this.state.newLocality === "" ? this.setState({ localityRequired: "dispBlock" }) : this.setState({ localityRequired: "dispNone" });
        this.state.newCity === "" ? this.setState({ cityRequired: "dispBlock" }) : this.setState({ cityRequired: "dispNone" });
        this.state.newState === "" ? this.setState({ stateRequired: "dispBlock" }) : this.setState({ stateRequired: "dispNone" });
        if(this.state.newPincode === "") {
            this.setState({ pincodeRequired: "dispBlock" });
            this.setState({ pincodeValidationMessage: "Required" });            
        } else if(!pincodePattern.test(this.state.newPincode)){
            this.setState({ pincodeRequired: "dispBlock" });
            this.setState({ pincodeValidationMessage: "Pincode must contain only numbers and must be 6 digits long" });
        } else {
            this.setState({ pincodeRequired: "dispNone" });
            this.setState({ pincodeValidationMessage: "" });
        }

        if( this.state.newFlatNo === "" || 
            this.state.newLocality === "" ||
            this.state.newCity === "" ||
            this.state.newState === "" ||
            this.state.newPincode === "" || 
            !pincodePattern.test(this.state.newPincode)){
            return;
        }

        let dataNewAddress = JSON.stringify({
            "city": this.state.newCity,
            "flat_building_name": this.state.newFlatNo,
            "locality": this.state.newLocality,
            "pincode": this.state.newPincode,
            "state_uuid": this.state.newState
        });

        // Rest call to add address
        let xhrNewAddress = new XMLHttpRequest();
        let that = this;
        xhrNewAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    newAddressAdded: true
                });

                that.resetNewAddress();

                that.getExistingAddress();

                that.setState({
                    activeTab: 0
                });
                that.snackBarHandler("New address added!!");
            }
        });

        xhrNewAddress.open("POST", "http://localhost:8080/api/address");
        xhrNewAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrNewAddress.setRequestHeader("Content-Type", "application/json");
        xhrNewAddress.setRequestHeader("Cache-Control", "no-cache");
        xhrNewAddress.send(dataNewAddress);

    }


    selectThisAddress = (_address) => {
        this.setState({
            selectedAddress: _address
        })
    }

    resetNewAddress = () => {
        this.setState({
            newCity: '',
            newFlatNo: '',
            newLocality: '',
            newPincode: '',
            newState: '',
            flatNoRequired: "dispNone",
            localityRequired: "dispNone",
            cityRequired: "dispNone",
            stateRequired: "dispNone",
            pincodeRequired: "dispNone",
            pincodeValidationMessage: ""
        });
    }

    handleNext = () => {
        if(this.state.selectedAddress === null){
            this.snackBarHandler("Please Select Delivery address.");
            return;
        }
        if(this.state.activeStep === 1 && this.state.selectedPaymentMode === null){
            this.snackBarHandler("Please Select Payment mode.");
            return;
        }
         if(this.state.activeTab !== 1){
            this.setState({
                activeStep: this.state.activeStep + 1
            })
        }
    }

    placeOrder = () => {

        let itemList = [];
        if(this.state.cartDetail === null ||
            this.state.selectedAddress === null ||
            this.state.selectedPaymentMode === null){
                this.snackBarHandler("Unable to place your order! Please try again!");
                return;
            }

        // setting items and quantities from cart details from details page
        this.state.cartDetail.itemList.forEach(_itemList => {
            let tempObj= {
                "item_id": _itemList.item.id,
                "price": _itemList.item.price,
                "quantity": _itemList.quantity
            }
            itemList.push(tempObj);
        });

        let dataOrder = JSON.stringify({
            "address_id": this.state.selectedAddress.id,
            "bill": this.state.cartDetail.totalPrice,
            "coupon_id": "",
            "discount": 0,
            "item_quantities": itemList,
            "payment_id": this.state.selectedPaymentMode,
            "restaurant_id": this.state.cartDetail.restaurant.id
          });

        let xhrOrder = new XMLHttpRequest();
        let that = this;
        xhrOrder.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let data = JSON.parse(this.responseText);
                if(this.status === 201){
                    that.snackBarHandler("Order placed successfully! Your order ID is "+data.id);
                   that.setState({
                       selectedAddress: null,
                       selectedPaymentMode: null
                   });
                }else{
                    that.snackBarHandler("Unable to place your order! Please try again!");
                }
                
            }
        });

        xhrOrder.open("POST", "http://localhost:8080/api/order");
        xhrOrder.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrOrder.setRequestHeader("Content-Type", "application/json");
        xhrOrder.setRequestHeader("Cache-Control", "no-cache");
        xhrOrder.send(dataOrder);
        
    }

    handleBack = () => {
        if(this.state.activeStep === 1){
            this.setState({
                activeStep: 0
            })
        }
    }

    handleReset = () => {
        this.setState({
            activeStep: 0
        })
    }

    handleChange = (event, newValue) => {
        this.setState({
            activeTab: newValue
        })
    }

    handleTabReset = () => {
        this.setState({
            activeTab: 0
        })
    }

    snackBarHandler = (message) => {
        this.setState({ snackBarOpen: false});
        this.setState({ snackBarMessage: message});
        this.setState({ snackBarOpen: true});
    }
    

    render() {
        const { classes } = this.props;
        let existAddress = this.state.existingAddress || [];
        return (
            <div>
                <Header baseUrl={this.props.baseUrl} />
                <Container fixed style={{ 'margin':16}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={9}>
                            <Stepper activeStep={this.state.activeStep} orientation="vertical">
                                <Step>
                                    <StepLabel>Delivery</StepLabel>
                                    <StepContent>
                                        <div> 
                                            <AppBar variant="fullWidth" position="static">
                                                <Tabs value={this.state.activeTab} onChange={this.handleChange.bind(this)} >
                                                <Tab label="Existing Address" />
                                                <Tab label="New Address" />
                                                </Tabs>
                                            </AppBar>
                                            {this.state.activeTab === 0 && (
                                                <div>
                                                    {existAddress.length === 0 ? (
                                                        <Typography variant="body2"  gutterBottom>
                                                            There are no saved addresses! You can save an address using the 'New Address' tab or using your ‘Profile’ menu option
                                                        </Typography>
                                                            
                                                    ) : (
                                                        <GridList className={classes.gridList} cols={3}  spacing={4}>
                                                            {existAddress.map((address,index) => (
                                                            <GridListTile style={{margin:10, borderRadius: 4}}  key={address.id} className={ this.state.selectedAddress && (this.state.selectedAddress.id === address.id) ? 'hightLightAddress' : 'noHighLight'}>
                                                                <Typography variant="body2"  gutterBottom>
                                                                    {address.flat_building_name}
                                                                </Typography>
                                                                <Typography variant="body2"  gutterBottom>
                                                                    {address.locality}
                                                                </Typography>
                                                                <Typography variant="body2"  gutterBottom>
                                                                    {address.city}
                                                                </Typography>
                                                                <Typography variant="body2"  gutterBottom>
                                                                    {address.state.state_name}
                                                                </Typography>
                                                                <Typography variant="body2"  gutterBottom>
                                                                    {address.pincode}
                                                                </Typography>
                                                                <div className="rightIcon">
                                                                    <IconButton disableRipple={true} onClick={this.selectThisAddress.bind(this,address)}>
                                                                        <CheckCircle className={ this.state.selectedAddress && (this.state.selectedAddress.id === address.id) ? 'greenBtn' : 'greyBtn'}/>
                                                                    </IconButton>
                                                                </div>
                                                            </GridListTile>
                                                            ))}
                                                        </GridList>
                                                    )}
                                                </div>
                                            )}
                                            {this.state.activeTab === 1 && (
                                                <div> 
                                                <FormControl required className={classes.formControl}>
                                                    <InputLabel htmlFor="flatNo">Flat / Building No</InputLabel>
                                                    <Input id="flatNo" type="text" newflatno={this.state.newFlatNo} onChange={this.inputFlatNoChangeHandler} />
                                                    <FormHelperText className={this.state.flatNoRequired}>
                                                        <span className="red">required</span>
                                                    </FormHelperText>
                                                </FormControl>
                                                <br />
                                                <FormControl required className={classes.formControl}>
                                                    <InputLabel htmlFor="locality">Locality</InputLabel>
                                                    <Input id="locality" type="text" newlocality={this.state.newLocality} onChange={this.inputLocalityChangeHandler} />
                                                    <FormHelperText className={this.state.localityRequired}>
                                                        <span className="red">required</span>
                                                    </FormHelperText> 
                                                </FormControl> 
                                                <br />
                                                <FormControl required className={classes.formControl}>
                                                    <InputLabel htmlFor="city">City</InputLabel>
                                                    <Input id="city" type="text" newcity={this.state.newCity} onChange={this.inputCityChangeHandler} />
                                                    <FormHelperText className={this.state.cityRequired}>
                                                        <span className="red">required</span>
                                                    </FormHelperText> 
                                                </FormControl>
                                                <br />
                                                <FormControl required className={classes.formControl}>
                                                    <InputLabel htmlFor="state">State</InputLabel>
                                                    <Select value={this.state.newState}  onChange={this.inputStateChangeHandler}  input={<Input name="state" id="state" />} className="stateSelect">
                                                    {(this.state.states || []).map((state, index) => (
                                                            <MenuItem key={state.id} value={state.id}>{state.state_name}</MenuItem>
                                                    ))}
                                                    </Select>
                                                    <FormHelperText className={this.state.stateRequired}>
                                                        <span className="red">required</span>
                                                    </FormHelperText> 
                                                </FormControl>
                                                <br />
                                                <FormControl required className={classes.formControl} >
                                                    <InputLabel htmlFor="pincode">Pincode</InputLabel>
                                                    <Input id="pincode" type="text" newcity={this.state.newPincode} onChange={this.inputPincodeChangeHandler} />
                                                    <FormHelperText className={this.state.pincodeRequired}>
                                                        <span className="red">{this.state.pincodeValidationMessage}</span>
                                                    </FormHelperText> 
                                                </FormControl> 
                                                <br />
                                                <Button variant="contained" color="secondary" style={{marginBottom:20, marginTop:20}}
                                                    onClick={this.saveNewAddress.bind(this)}
                                                >
                                                    SAVE ADDRESS
                                                </Button>
                                            </div>
                                            )}
                                        </div>
                                        
                                        <div className={classes.actionsContainer}>
                                            <div>
                                                <Button
                                                    disabled={this.state.activeStep === 0}
                                                    onClick={this.handleBack.bind(this)}
                                                    className={classes.button}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleNext.bind(this)}
                                                    className={classes.button}
                                                >Next
                                                </Button>
                                            </div>
                                        </div>
                                    </StepContent>
                                </Step>
                                <Step>
                                    <StepLabel>Payment</StepLabel>
                                    <StepContent>
                                        
                                        <FormControl component="fieldset" className={classes.formControl}>
                                            <FormLabel component="legend" className={this.state.selectedPaymentMode ? 'hightLightPayment': ''}>Select Mode of Payment</FormLabel>
                                            <RadioGroup
                                            aria-label="PaymentMode"
                                            name="paymentMode"
                                            className={classes.group}
                                            onChange={this.handlePaymentModeChangeHandler}
                                            >
                                            {(this.state.paymentModes || []).map((pModes,index) => (
                                                <FormControlLabel key={pModes.id} value={pModes.id} control={<Radio />} label={pModes.payment_name} 
                                                checked={this.state.selectedPaymentMode === pModes.id} className="radioButtons"/>
                                            ))}
                                            </RadioGroup>
                                        </FormControl>

                                        <div className={classes.actionsContainer}>
                                            <div>
                                                <Button
                                                    disabled={this.state.activeStep === 0}
                                                    onClick={this.handleBack.bind(this)}
                                                    className={classes.button}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleNext.bind(this)}
                                                    className={classes.button}
                                                >Finish
                                                </Button>
                                            </div>
                                        </div>
                                    </StepContent>
                                </Step>
                            </Stepper>
                            {this.state.activeStep > 1 && (
                                <Paper square elevation={0} className={classes.resetContainer}>
                                <Typography>View the summary and place your order now!</Typography>
                                <Button onClick={this.handleReset.bind(this)} className={classes.button}>
                                    CHANGE
                                </Button>
                                </Paper>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Card className={classes.card}>
                                <CardContent>
                                     <Typography className={classes.title} display="inline" variant="h6">Summary </Typography>
                                     <Typography className={classes.title} display="block" variant="body" style={{marginTop:8, marginBottom:8}}>{this.state.cartDetail.restaurant.restaurant_name} </Typography>
                                    {(this.state.cartDetail.itemList || []).map((cartItem, index) => (
                                            <Grid item xs container key={cartItem.item.id} >
                                                <Grid container spacing={2} direction="row" justify="space-between" alignItems="center">
                                                    <Grid item >
                                                        <Typography variant="caption"  gutterBottom className="capitalize">
                                                            <i className={cartItem.item.item_type !== 'VEG' ? 'fa fa-stop-circle-o redColor' : ' fa fa-stop-circle-o greenColor'} />
                                                            <span style={{marginLeft:8}} >{cartItem.item.item_name}</span>
                                                        </Typography>
                                                    </Grid>                                                            
                                                    <Grid item >
                                                        <Typography variant="caption"  gutterBottom>
                                                            <Typography variant="caption" style={{marginRight:20}}>{cartItem.quantity}</Typography> 
                                                            <i className="fa fa-inr"></i>
                                                            <span>{cartItem.totalItemPrice}</span>                                                                    
                                                        </Typography>
                                                    </Grid>                                                            
                                                </Grid>
                                            </Grid>
                                        ))}
                                        <Divider style={{ marginTop:8, marginBottom:8}} />
                                        <Grid item xs container justify="space-between">
                                            <Grid item >
                                                <Typography variant="caption"  gutterBottom className="bold">
                                                    Total Amount                                                                  
                                                </Typography>
                                            </Grid>
                                            <Grid item >
                                                <Typography variant="caption"  gutterBottom className="bold">
                                                    <i className="fa fa-inr"></i>
                                                    {this.state.cartDetail.totalPrice}                                                                  
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                </CardContent>
                                
                                <CardActions>
                                    <Button variant="contained" color="primary" style={{width:'100%'}} onClick={this.placeOrder.bind(this)}>
                                        PLACE ORDER
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>     

                     <Snackbar 
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }} 
                                open={this.state.snackBarOpen} 
                                autoHideDuration={6000}  
                                onClose={() => this.setState({ snackBarOpen: false })}
                                ContentProps={{
                                    'aria-describedby': 'message-id',
                                }}
                                message={<span id="message-id">{this.state.snackBarMessage}</span>}
                                action={[
                                    <IconButton
                                        key="close"
                                        aria-label="Close"
                                        color="inherit"
                                        className={classes.close}
                                        onClick={() => this.setState({ snackBarOpen: false })}
                                        >
                                        <CloseIcon />
                                    </IconButton>
                                ]}
                            />

                </Container>
            </div>
        )
    }
}

export default withStyles(styles)(Checkout);